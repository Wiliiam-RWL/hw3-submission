import boto3
import json
from datetime import datetime
import requests
from requests_aws4auth import AWS4Auth


def handler(event, context):
    print("===========Start Lambda===========")
    # Initialize clients
    s3_client = boto3.client("s3")
    rekognition_client = boto3.client("rekognition")
    region = "us-east-1"
    service = "es"
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        region,
        service,
        session_token=credentials.token,
    )
    print("===========Start Detecting Label===========")

    # Extract bucket name and object key from the event
    bucket_name = "image-bucket-hw2-894311263883"
    object_key = event["Records"][0]["s3"]["object"]["key"]

    # Detect labels in the image using Rekognition
    response = rekognition_client.detect_labels(
        Image={"S3Object": {"Bucket": bucket_name, "Name": object_key}}
    )

    labels = [label["Name"] for label in response["Labels"]]
    print("===========Detected Labels===========")
    print(labels)

    # Fetch the image metadata
    response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
    customLabels = response.get("Metadata", {}).get("customlabels", "[]")
    
    print("===========Custom Labels===========")
    customLabelsArray = customLabels.strip().split(",")
    print(customLabelsArray)


    # Merge Rekognition labels and custom labels
    labels.extend(customLabelsArray)

    # Prepare the document to be indexed
    document = {
        "objectKey": object_key,
        "bucket": bucket_name,
        "createdTimestamp": datetime.now().isoformat(),
        "labels": labels,
    }

    print(document)
    print("===========Start Uploading to ES===========")

    # # Index the document in ElasticSearch
    es_host = "search-hw3-opensearch-apr12-7ths5pasqldju3yjidbj4swyxi.us-east-1.es.amazonaws.com"
    index_url = f"https://{es_host}/photos/_doc"
    headers = {"Content-Type": "application/json"}

    try:
        r = requests.post(index_url, auth=awsauth, json=document, headers=headers)
        if r.status_code not in range(200, 299):
            # Log the error response from OpenSearch
            print(f"Error indexing document: {r.text}")
            return {"statusCode": 500, "body": json.dumps("Failed to index document")}
        print("===========Lambda Success!===========")
    except Exception as e:
        # Log the exception
        print(f"Exception occurred: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps("Exception occurred during execution"),
        }
