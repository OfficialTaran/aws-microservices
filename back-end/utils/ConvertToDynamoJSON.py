from dynamodb_json import json_util as dynamo_json
import json
import sys

py_object = json.loads(sys.stdin.read())
print(dynamo_json.dumps(py_object))