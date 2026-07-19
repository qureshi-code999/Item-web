@echo off
echo ================================================
echo    Sahil Traders - Image Update Tool
echo ================================================
echo.
echo Images folder scan kar raha hai...

powershell -ExecutionPolicy Bypass -Command ^
"$folder = 'c:\Users\ALICOM4\Desktop\ITEMS WEB\images'; ^
$htmlFile = 'c:\Users\ALICOM4\Desktop\ITEMS WEB\index.html'; ^
$ids = Get-ChildItem $folder | Select-Object -ExpandProperty BaseName | Where-Object {$_ -match '^\d+$'} | Sort-Object {[int]$_}; ^
$joined = ($ids | ForEach-Object {[int]$_}) -join ','; ^
$html = Get-Content $htmlFile -Raw; ^
$updated = [regex]::Replace($html, 'window\.PRODUCT_IMAGES\s*=\s*new Set\([^)]*\);', ""window.PRODUCT_IMAGES = new Set([$joined]);""); ^
Set-Content -Path $htmlFile -Value $updated -Encoding UTF8; ^
Write-Host ('Total images found: ' + $ids.Count); ^
Write-Host ('IDs: ' + $joined)"

echo.
echo ================================================
echo  DONE! Website update ho gayi.
echo  Ab index.html dobara kholo browser mein.
echo ================================================
echo.
pause
