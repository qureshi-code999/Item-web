param(
    [int]$startId = 1,
    [int]$endId = 1266
)

$imagesFolder = if ($PSScriptRoot) { Join-Path $PSScriptRoot "images" } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB\images" }
$htmlFile = if ($PSScriptRoot) { Join-Path $PSScriptRoot "index.html" } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB\index.html" }
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

$html = Get-Content $htmlFile -Raw
$productItems = [regex]::Matches($html, '\{\s*id:\s*(\d+),\s*name:\s*"([^"]+)"')
Write-Output "Total products: $($productItems.Count)"
Write-Output "Processing IDs $startId to $endId"
Write-Output ""

foreach ($item in $productItems) {
    $id = [int]$item.Groups[1].Value
    $name = $item.Groups[2].Value

    if ($id -lt $startId -or $id -gt $endId) { continue }

    $jpgPath = Join-Path $imagesFolder "$id.jpg"
    $pngPath = Join-Path $imagesFolder "$id.png"

    if ((Test-Path $jpgPath) -or (Test-Path $pngPath)) {
        Write-Output "[$id] SKIP (exists): $name"
        continue
    }

    Write-Output "[$id] Searching: $name"

    try {
        $q = [uri]::EscapeDataString($name)
        $ddgSearch = Invoke-WebRequest -Uri "https://duckduckgo.com/?q=$q" -UserAgent $ua -UseBasicParsing -TimeoutSec 10
        $vqdMatch = [regex]::Match($ddgSearch.Content, "vqd=([0-9\-]+)")
        $vqd = if ($vqdMatch.Success) { $vqdMatch.Groups[1].Value } else { "" }

        if ($vqd) {
            $apiUrl = "https://duckduckgo.com/i.js?l=us-en&o=json&q=$q&vqd=$vqd&f=,,,,,&p=1"
            $apiResp = Invoke-WebRequest -Uri $apiUrl -UserAgent $ua -UseBasicParsing -TimeoutSec 10
            $json = $apiResp.Content | ConvertFrom-Json

            $downloaded = $false
            $maxTry = [Math]::Min(3, $json.results.Count)
            for ($i = 0; $i -lt $maxTry; $i++) {
                $imgUrl = $json.results[$i].image
                if (-not $imgUrl) { continue }
                try {
                    $isPng = $imgUrl -match "\.png"
                    $ext = if ($isPng) { "png" } else { "jpg" }
                    $outPath = Join-Path $imagesFolder "$id.$ext"
                    Invoke-WebRequest -Uri $imgUrl -OutFile $outPath -UserAgent $ua -TimeoutSec 8
                    $sz = (Get-Item $outPath).Length
                    if ($sz -lt 1000) { Remove-Item $outPath -Force; continue }
                    Write-Output "  [OK] $imgUrl"
                    $downloaded = $true
                    break
                } catch {
                    # try next
                }
            }
            if (-not $downloaded) { Write-Output "  [FAIL] No valid image downloaded" }
        } else {
            Write-Output "  [WARN] No vqd token"
        }
    } catch {
        Write-Output "  [ERROR] $($_.Exception.Message)"
    }

    Start-Sleep -Milliseconds 800
}

# ---- Auto-update PRODUCT_IMAGES in index.html ----
Write-Output ""
Write-Output "Updating PRODUCT_IMAGES list in index.html..."

$imageIds = Get-ChildItem $imagesFolder | Select-Object -ExpandProperty BaseName | Sort-Object {[int]$_}
$idsJoined = ($imageIds | ForEach-Object { [int]$_ }) -join ","
$newSet = "    window.PRODUCT_IMAGES = new Set([$idsJoined]);"

$htmlContent = Get-Content $htmlFile -Raw
$updated = [regex]::Replace($htmlContent, '    window\.PRODUCT_IMAGES = new Set\([^)]*\);', $newSet)
Set-Content -Path $htmlFile -Value $updated -Encoding UTF8

Write-Output "PRODUCT_IMAGES updated with IDs: $idsJoined"
Write-Output ""
Write-Output "All done! $($imageIds.Count) images total in folder."
