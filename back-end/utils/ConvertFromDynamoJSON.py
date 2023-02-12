from dynamodb_json import json_util as dynamo_json
import json
import sys

py_object = dynamo_json.loads(sys.stdin.read())
print(json.dumps(py_object))