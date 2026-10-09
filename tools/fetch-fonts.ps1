$ErrorActionPreference = 'Stop'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
$root = 'C:\Desktop\digitalsubshop'
$fontsDir = Join-Path $root 'fonts'
New-Item -ItemType Directory -Force -Path $fontsDir | Out-Null

$icons = 'account_balance_wallet arrow_forward auto_awesome bolt chat check_circle chevron_right close expand_more explore flash_on grid_view help lock menu payments search search_off shield shield_lock south stars trending_up tune verified verified_user'
$iconsParam = $icons -replace ' ', '+'

$reqs = @(
  @{ css = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'; prefix = 'inter' },
  @{ css = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap'; prefix = 'space-grotesk' },
  @{ css = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block&text=$iconsParam"; prefix = 'msymbols' }
)

$log = @()
foreach ($r in $reqs) {
  $css = (Invoke-WebRequest -Uri $r.css -Headers @{ 'User-Agent' = $ua } -UseBasicParsing -TimeoutSec 60).Content
  $chunks = $css -split '@font-face'
  foreach ($ch in $chunks) {
    $w = '400'
    if ($ch -match 'font-weight:\s*(\d+)') { $w = $Matches[1] }
    $isIcon = ($r.prefix -eq 'msymbols')
    $isLatin = ($ch -match 'U\+0000-00FF')
    if ($isLatin -or $isIcon) {
      $url = $null
      if ($ch -match 'url\((https://[^)]+)\)') { $url = $Matches[1] }
      if ($url) {
        $fname = "$($r.prefix)-$w.woff2"
        $out = Join-Path $fontsDir $fname
        Invoke-WebRequest -Uri $url -Headers @{ 'User-Agent' = $ua } -OutFile $out -UseBasicParsing -TimeoutSec 120
        $len = (Get-Item $out).Length
        $log += "OK $fname $len bytes"
      }
    }
  }
}
[IO.File]::WriteAllText((Join-Path $fontsDir 'fetch-status.txt'), ($log -join "`n"))
