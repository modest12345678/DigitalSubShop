$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd /c "`"$chrome`" --headless=new --disable-gpu --virtual-time-budget=8000 --dump-dom http://localhost:8080/tools/test-icons.html > C:\Desktop\digitalsubshop\tools\dom-dump.txt 2>&1"
[IO.File]::WriteAllText('C:\Desktop\digitalsubshop\tools\dom-status.txt', 'DONE')

