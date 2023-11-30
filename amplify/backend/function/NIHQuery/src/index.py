from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
import boto3
from botocore.exceptions import ClientError
import csv
import json
import os

region = os.environ.get('REGION')
host = os.environ.get('OS_HOST')
service = 'aoss'
credentials = boto3.Session().get_credentials()
auth = AWSV4SignerAuth(credentials, region, service)
index_name = 'grant-opportunities-index'


# create an opensearch client and use the request-signer
client = OpenSearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=auth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
    pool_maxsize=20,
)
  

def handler(event, context):
  print('received event:')
  print(event)

  queryStringParameters = event.get("queryStringParameters")
  queryText = queryStringParameters['searchtext']

  print('Searching for: ' + queryText)
  
  query = {
    'size': 50,
    'query': {
      'multi_match': {
        'type': 'best_fields',
         'query': queryText,
      }
    }
  }
  
  response = client.search(
    body = query,
    index = index_name
  )
  print('\nSearch results:')
  
  return {
      'statusCode': 200,
      'headers': {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(response)
  }