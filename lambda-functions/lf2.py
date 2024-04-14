import json
import boto3
import requests
from requests_aws4auth import AWS4Auth


def handler(event, context):
    print("========Start Lambda=======")
    # Extract the user's input text from the event triggered by API Gateway
    user_input = event["queryStringParameters"]["q"]
    print("========User Input=======")
    print(user_input)

    # Initialize Lex client
    lex_client = boto3.client("lexv2-runtime", region_name="us-east-1")

    # Send the user input to Lex to disambiguate
    params = {
        "botId": "63JDYQBTTD",
        "botAliasId": "TSTALIASID",
        "localeId": "en_US",  # e.g., 'en_US'
        "sessionId": "user-id",
        "text": "find photo " + user_input,
    }

    lex_response = lex_client.recognize_text(**params)
    print("========Lex=======")
    print(lex_response)

    # Extract the keyword slot value from the Lex response
    keyword = (
        lex_response["sessionState"]["intent"]["slots"]["keywords"]["value"][
            "resolvedValues"
        ]
        if lex_response["sessionState"]["intent"]["slots"]["keywords"]
        else None
    )
    print("========Keyword=======")
    print(keyword)
    region = "us-east-1"  # Region of your OpenSearch domain
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        region,
        "es",
        session_token=credentials.token,
    )

    # OpenSearch domain endpoint
    domain_endpoint = "search-hw3-opensearch-apr12-7ths5pasqldju3yjidbj4swyxi.us-east-1.es.amazonaws.com"  # Replace with your OpenSearch endpoint
    index_url = f"https://{domain_endpoint}/photos/_search"

    headers = {"Content-Type": "application/json"}

    # Set up the AWS authentication for OpenSearch
    print("========Querying Opensearch=======")

    # Construct the search query
    if keyword:
        # query = {
        #     "size": 50,
        #     "query": {"multi_match": {"query": keyword[0], "fields": ["labels"]}},
        # }
        query = {"query": {"bool": {"must": []}}}
        keywords = keyword[0].split(" ")
        for k in keywords:
            query["query"]["bool"]["must"].append({"match": {"labels": k}})
    else:
        query = {"size": 50, "query": {"match_all": {}}}

    # Make a request to OpenSearch
    response = requests.post(index_url, auth=awsauth, json=query, headers=headers)

    # Check the response from OpenSearch
    if response.status_code == 200:
        search_results = response.json()["hits"]["hits"]
        photos = []

        for result in search_results:
            url = (
                "https://"
                + result["_source"]["bucket"]
                + ".s3.amazonaws.com/"
                + result["_source"]["objectKey"]
            )
            # https://bucket-name.s3.amazonaws.com/object-key
            labels = result["_source"]["labels"]
            photos.append({"url": url, "labels": labels})
        print(photos)

        return {"statusCode": 200, "body": json.dumps(photos)}
    else:
        return {"statusCode": response.status_code, "body": response.text}


# # Be sure to replace 'YourBotName', 'YourBotAlias', and 'your-opensearch-endpoint'
# # with your actual Lex bot name, alias, and OpenSearch endpoint.
# # Also, make sure the index name 'photos' matches your OpenSearch index name.
# # The query parameter name 'q' should match the query string parameter expected from the API Gateway.
# # This code assumes that the Lex bot has been set up with an intent that uses a slot named 'keyword'.
