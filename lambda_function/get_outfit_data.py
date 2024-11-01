import json
import boto3
import requests
import time
import random

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = 'ProductCache'
table = dynamodb.Table(table_name)

# Constants for API access
API_URL = "https://api.shopbop.com/categories/{}/products"
HEADERS = {
    'accept': 'application/json',
    'Client-Id': 'Shopbop-UW-Team2-2024',
    'Client-Version': '1.0.0'
}

# Cache time in seconds (e.g., 1 hour)
CACHE_DURATION = 3600

def lambda_handler(event, context):
    try:
        # Parse the incoming event body
        if isinstance(event.get('body'), str):
            body = json.loads(event.get('body'))
        else:
            body = event.get('body', event)

        category_array = body.get("categoryArray", [])
        timestamp = body.get("timestamp", int(time.time()))
        random_seed = body.get("randomSeed", "")

        if not category_array:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No category array provided"})
            }

        # Choose a random category
        category_id = str(category_array[0])

        # Create a cache key that includes the timestamp to avoid repetition
        cache_key = f"{category_id}_{timestamp}_{random_seed}"

        # Check DynamoDB cache
        cached_product = get_cached_product(cache_key)
        if cached_product:
            return {
                "statusCode": 200,
                "body": json.dumps(cached_product)
            }

        # Fetch product data from API if not in cache
        product_data = fetch_product_from_api(category_id, timestamp, random_seed)
        if not product_data:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "No products found in the category."})
            }

        # Cache metadata in DynamoDB
        cache_product(cache_key, product_data)

        # Return product metadata to the client
        return {
            "statusCode": 200,
            "body": json.dumps(product_data)
        }

    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Internal server error: {str(e)}"})
        }

def get_cached_product(cache_key):
    """Retrieve product from DynamoDB if cache is valid."""
    try:
        response = table.get_item(Key={'categoryId': cache_key})
        item = response.get('Item')
        if item and item['expiresAt'] > int(time.time()):
            return item['productData']
    except Exception as e:
        print(f"Error fetching from DynamoDB: {e}")
    return None

def fetch_product_from_api(category_id, timestamp, random_seed):
    """Fetch product data from the Shopbop API with randomization."""
    try:
        response = requests.get(API_URL.format(category_id), headers=HEADERS)
        if response.status_code != 200:
            print(f"API request failed with status code: {response.status_code}")
            return None
        
        data = response.json()
        products = data.get("products", [])
        if not products:
            print("No products found in API response")
            return None
        
        # Use timestamp and random_seed to get different products
        seed = int(str(timestamp) + str(hash(random_seed)))
        random.seed(seed)
        
        # Get a truly random product
        random_product = random.choice(products)
        
        # Ensure we have required fields
        if not random_product.get('colors') or not random_product['colors'][0].get('images'):
            print("Product missing required image data")
            return None
            
        product_data = {
            'productId': random_product.get('id', ''),
            'productName': random_product['shortDescription'],
            'productPrice': random_product['price']['retail'],
            'imageUrl1': f"https://m.media-amazon.com/images/G/01/Shopbop/p{random_product['colors'][0]['images'][0]['src']}",
            'imageUrl4': f"https://m.media-amazon.com/images/G/01/Shopbop/p{random_product['colors'][0]['images'][3]['src']}",
            'category': category_id,
            'fetchedAt': timestamp,
            'randomSeed': random_seed
        }
        
        return product_data
    except Exception as e:
        print(f"Error fetching from API: {e}")
        return None

def cache_product(cache_key, product_data):
    """Cache product metadata in DynamoDB with TTL."""
    expires_at = int(time.time()) + CACHE_DURATION
    try:
        table.put_item(
            Item={
                'categoryId': cache_key,
                'productData': product_data,
                'expiresAt': expires_at,
                'timestamp': int(time.time())
            }
        )
    except Exception as e:
        print(f"Error caching to DynamoDB: {e}")
