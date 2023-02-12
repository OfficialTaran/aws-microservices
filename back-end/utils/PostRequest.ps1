Param(
  [Parameter(Mandatory = $true)]
  [string]$file = $null,

  [Parameter(Mandatory = $true)]
  [string]$route = $null
)

$data = cat "$PSScriptRoot/data/$file" | ConvertFrom-Json -AsHashtable
$data.Remove('id')

curl -X POST "http://127.0.0.1:3000/$route" `
  --data $($data | ConvertTo-Json).Replace('"','\"')