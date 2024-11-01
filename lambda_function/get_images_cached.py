import boto3
import requests
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
bucket_name = 'shopbop-bucket'

def lambda_handler(event, context):
    image_url1 = event.get("imageUrl1")
    image_url4 = event.get("imageUrl4")
    image_key1 = event.get("imageKey1")  # Will now include product-images/ prefix
    image_key4 = event.get("imageKey4")
    
    if not image_url1 or not image_key1 or not image_url4 or not image_key4:
        return {
            "statusCode": 400,
            "body": "Missing image URL or key information"
        }
    
    # Process each image
    for image_url, image_key in [(image_url1, image_key1), (image_url4, image_key4)]:
        try:
            # Check if image exists in S3
            try:
                s3.head_object(Bucket=bucket_name, Key=image_key)
                print(f"Image {image_key} already exists in S3.")
                continue
            except ClientError as e:
                if e.response['Error']['Code'] != '404':
                    raise e
            
            # Fetch and store image if not found
            image_response = requests.get(image_url, stream=True)
            if image_response.status_code == 200:
                # Set content type based on file extension
                content_type = 'image/jpeg' if image_key.lower().endswith('.jpg') else 'image/png'
                
                s3.put_object(
                    Bucket=bucket_name,
                    Key=image_key,
                    Body=image_response.content,
                    ContentType=content_type,
                    CacheControl='max-age=31536000'  # Cache for 1 year
                )
                print(f"Cached image {image_key} to S3.")
            else:
                print(f"Failed to fetch image from {image_url}")
                
        except Exception as e:
            print(f"Error processing image {image_key}: {str(e)}")
            return {
                "statusCode": 500,
                "body": f"Error processing image: {str(e)}"
            }
    
    return {
        "statusCode": 200,
        "body": "Images cached in S3"
    }

