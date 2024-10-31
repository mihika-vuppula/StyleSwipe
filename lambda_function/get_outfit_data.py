import boto3
import json
import requests
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
bucket_name = 'shopbop-bucket'

def lambda_handler(event, context):
    category_array = event['queryStringParameters']['categories'].split(',')
    random_category = random.choice(category_array)
    cache_key = f"products/{random_category}.json"

    # Check S3 for cached data
    try:
        cached_data = s3.get_object(Bucket=bucket_name, Key=cache_key)
        return {
            'statusCode': 200,
            'body': cached_data['Body'].read().decode('utf-8')
        }
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            # No cache found, call Shopbop API
            response = requests.get(f'https://api.shopbop.com/categories/{random_category}/products')
            if response.status_code == 200:
                products = response.json().get('products', [])
                if products:
                    random_product = random.choice(products)
                    product_data = {
                        "productName": random_product["shortDescription"],
                        "productPrice": random_product["price"]["retail"],
                        "imageUrl1": f"https://m.media-amazon.com/images/G/01/Shopbop/p{random_product['colors'][0]['images'][0]['src']}",
                        "imageUrl4": f"https://m.media-amazon.com/images/G/01/Shopbop/p{random_product['colors'][0]['images'][3]['src']}"
                    }
                    # Cache data in S3
                    s3.put_object(Bucket=bucket_name, Key=cache_key, Body=json.dumps(product_data), ContentType='application/json')
                    return {
                        'statusCode': 200,
                        'body': json.dumps(product_data)
                    }
        return {'statusCode': 500, 'body': 'Error fetching data'}
