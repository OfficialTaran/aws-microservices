$endpoint = 'http://localhost:8000'

docker compose -f $PSScriptRoot/docker-compose.yml up -d

ls $PSScriptRoot/tables | % {
  $table = cat $_ | ConvertFrom-Json -AsHashtable

  $attributes = $($table.attribute_definitions `
    | ConvertTo-Json -AsArray -Compress).Replace('"','\"')
  $key_schema = $($table.key_schema `
    | ConvertTo-Json -AsArray -Compress).Replace('"','\"')

  aws dynamodb create-table --endpoint $endpoint `
    --table-name $table.name `
    --attribute-definitions $attributes `
    --key-schema $key_schema `
    --billing-mode PAY_PER_REQUEST | ConvertFrom-Json -AsHashtable

  ls $PSScriptRoot/data/$($table.name) | % {
    aws dynamodb put-item --endpoint $endpoint `
    --table-name $table.name `
    --item $(cat $_ | python $PSScriptRoot/ConvertToDynamoJSON.py).Replace('"','\"')
  }
}