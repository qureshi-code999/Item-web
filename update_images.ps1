# update_images.ps1
$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = "c:\Users\ALICOM4\Desktop\ITEMS WEB" }

$folder = Join-Path $rootDir "images"
$htmlFile = Join-Path $rootDir "index.html"
$jsxFile = Join-Path $rootDir "INDEX.JSX"

if (-not (Test-Path $folder)) {
    Write-Host "Error: images folder nahi mila!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $htmlFile)) {
    Write-Host "Error: index.html nahi mila!" -ForegroundColor Red
    exit 1
}

$images = @()
foreach ($file in Get-ChildItem $folder -File) {
    if ($file.Name -match '^(\d+)\.(png|jpg|jpeg|webp|jfif)$') {
        $images += [PSCustomObject]@{
            Id = [int]$matches[1]
            Ext = $matches[2].ToLower()
        }
    }
}

$sorted = $images | Sort-Object Id
$mapItems = $sorted | ForEach-Object { "$($_.Id):'$($_.Ext)'" }
$mapBody = $mapItems -join ','
$setItems = $sorted | ForEach-Object { "$($_.Id)" }
$setBody = $setItems -join ','

# Update index.html
$html = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
$patternMap = 'window\.PRODUCT_IMAGE_MAP\s*=\s*\{[\s\S]*?\};(\s*window\.PRODUCT_IMAGES\s*=\s*new Set\(\[[\s\S]*?\]\);)?'
$replacementMap = "window.PRODUCT_IMAGE_MAP = {$mapBody};`r`n    window.PRODUCT_IMAGES = new Set([$setBody]);"

if ([regex]::IsMatch($html, $patternMap)) {
    $html = [regex]::Replace($html, $patternMap, $replacementMap, 1)
    [System.IO.File]::WriteAllText($htmlFile, $html, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "SUCCESS: $($sorted.Count) product images mapped in index.html!" -ForegroundColor Green
} else {
    Write-Host "Warning: window.PRODUCT_IMAGE_MAP pattern not found in index.html." -ForegroundColor Yellow
}

# Also update INDEX.JSX if present
if (Test-Path $jsxFile) {
    $jsx = [System.IO.File]::ReadAllText($jsxFile, [System.Text.Encoding]::UTF8)
    if ([regex]::IsMatch($jsx, $patternMap)) {
        $jsx = [regex]::Replace($jsx, $patternMap, $replacementMap, 1)
        [System.IO.File]::WriteAllText($jsxFile, $jsx, (New-Object System.Text.UTF8Encoding $false))
        Write-Host "SUCCESS: $($sorted.Count) product images mapped in INDEX.JSX!" -ForegroundColor Green
    }
}

Write-Host "`nBreakdown:" -ForegroundColor Cyan
$groups = $sorted | Group-Object Ext
foreach ($g in $groups) {
    Write-Host "  .$($g.Name): $($g.Count) files"
}
