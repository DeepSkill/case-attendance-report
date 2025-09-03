$api = Start-Process pnpm -ArgumentList "--dir","api","develop" -PassThru
$web = Start-Process pnpm -ArgumentList "--dir","web","dev" -PassThru
Wait-Process -Id $api.Id,$web.Id