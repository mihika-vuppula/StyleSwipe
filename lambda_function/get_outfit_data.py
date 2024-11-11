import boto3
import requests
import random
import json
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

TABLE_NAME = 'cached_metadata'
BUCKET_NAME = 'shopbop-bucket'

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        category_array = body.get('categoryArray', [])
        if not category_array:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'No categories provided'})
            }
        
        random_category = random.choice(category_array)

        headers = {
            'accept': 'application/json',
            'Client-Id': 'Shopbop-UW-Team2-2024',
            'Client-Version': '1.0.0'
        }
        response = requests.get(f'https://api.shopbop.com/categories/{random_category}/products', headers=headers)
        data = response.json()
        
        products = data.get('products', [])
        if not products:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'No products found'})
            }
        
        random_product = random.choice(products)
        product_id = random_product['id']
        product_name = random_product['shortDescription']
        designer_name = random_product['designerName']
        product_price = random_product['price']['retail']

        color_images = random_product['colors'][0]['images']
        image_url1 = color_images[0]['src']
        image_url2 = color_images[3]['src']

        table = dynamodb.Table(TABLE_NAME)
        try:
            response = table.get_item(Key={'productId': product_id})
            if 'Item' in response:
                return {
                    'statusCode': 200,
                    'body': json.dumps(response['Item'])
                }
        except Exception as e:
            print(f'Error fetching from DynamoDB: {e}')

        s3_urls = []
        for idx, url in enumerate([image_url1, image_url2], start=1):
            s3_key = f'cached_images/{product_id}-image{idx}.jpg'
            # Check if image is already in S3
            try:
                s3.head_object(Bucket=BUCKET_NAME, Key=s3_key)
                print(f"Image {s3_key} already exists in S3.")
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    # Image does not exist, upload it
                    image_response = requests.get(f'https://m.media-amazon.com/images/G/01/Shopbop/p{url}')
                    s3.put_object(
                        Bucket=BUCKET_NAME, 
                        Key=s3_key, 
                        Body=image_response.content, 
                        ContentType='image/jpeg'
                    )
                    print(f"Uploaded {s3_key} to S3.")
            s3_urls.append(f'https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}')

        metadata = {
            'productId': product_id,
            'productName': product_name,
            'designerName': designer_name,
            'productPrice': product_price,
            'imageUrls': s3_urls
        }
        table.put_item(Item=metadata)

        return {
            'statusCode': 200,
            'body': json.dumps(metadata)
        }
    
    except Exception as e:
        print(f'Error: {e}')
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error', 'error': str(e)})
        }
