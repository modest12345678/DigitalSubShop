Set-Location C:\Desktop\digitalsubshop
$env:BROWSERSLIST_IGNORE_OLD_DATA = '1'
npx -y lighthouse http://localhost:8080/ --output=json --output-path=C:\Desktop\digitalsubshop\lh-after.json --only-categories=performance,accessibility,best-practices,seo --chrome-flags='--headless=new' --quiet
if ($LASTEXITCODE -eq 0) { [IO.File]::WriteAllText('C:\Desktop\digitalsubshop\lh-after-status.txt', 'OK') } else { [IO.File]::WriteAllText('C:\Desktop\digitalsubshop\lh-after-status.txt', 'EXIT ' + $LASTEXITCODE) }