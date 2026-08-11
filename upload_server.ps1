param([switch]$NoBrowser)

# PowerShell Web Server for Sahil Traders - Item Upload Portal
$port     = 8888
$url      = "http://localhost:$port/"
$rootDir  = "c:\Users\ALICOM4\Desktop\ITEMS WEB"
$htmlFile = Join-Path $rootDir "index.html"
$jsxFile  = Join-Path $rootDir "INDEX.JSX"
$imgDir   = Join-Path $rootDir "images"
$portalFile = Join-Path $rootDir "item_upload_portal.html"

# Encoding compatible with PowerShell 5.1 (.NET Framework) & PowerShell 7
$isoEncoding = [System.Text.Encoding]::GetEncoding("iso-8859-1")

function Get-ProductStats {
    if (-not (Test-Path $htmlFile)) { return @{ total=0; nextId=1; images=0 } }
    $content = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
    $idMatches = [regex]::Matches($content, '\{ id: (\d+),')
    $ids = $idMatches | ForEach-Object { [int]$_.Groups[1].Value } | Sort-Object
    $imageCount = 0
    if (Test-Path $imgDir) {
        $imageCount = (Get-ChildItem $imgDir -File | Where-Object { $_.Name -match '^\d+\.' }).Count
    }
    $maxId = if ($ids.Count -gt 0) { ($ids | Measure-Object -Maximum).Maximum } else { 0 }
    return @{
        total  = $ids.Count
        nextId = $maxId + 1
        images = $imageCount
    }
}

function Escape-JsString {
    param([string]$value)
    if ($null -eq $value) { return "" }
    return $value.Replace('\', '\\').Replace('"', '\"')
}

function Escape-JsonString {
    param([string]$value)
    if ($null -eq $value) { return "" }
    return $value.Replace('\', '\\').Replace('"', '\"').Replace("`r", "\r").Replace("`n", "\n")
}

function Normalize-CategoryId {
    param([string]$value)
    $slug = "$value".Trim().ToLower()
    $slug = [regex]::Replace($slug, '&', ' and ')
    $slug = [regex]::Replace($slug, '[^a-z0-9]+', '')
    if ($slug.Length -gt 28) { $slug = $slug.Substring(0, 28) }
    return $slug
}

function Ensure-CategoryInFile {
    param([string]$filePath, [string]$catId, [string]$catName)
    if (-not (Test-Path $filePath)) { return }
    if ([string]::IsNullOrWhiteSpace($catId) -or [string]::IsNullOrWhiteSpace($catName)) { return }
    $fc = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $escapedId = Escape-JsString $catId
    $escapedName = Escape-JsString $catName
    $idPattern = '(\{\s*id:\s*"' + [regex]::Escape($escapedId) + '"\s*,\s*name:\s*)"[^"]*"'
    if ([regex]::IsMatch($fc, $idPattern)) {
        $fc = [regex]::Replace($fc, $idPattern, "`$1`"$escapedName`"")
    } else {
        $catStart = $fc.IndexOf("const CATEGORIES = [")
        if ($catStart -ge 0) {
            $catEnd = $fc.IndexOf("];", $catStart)
            if ($catEnd -gt $catStart) {
                $newCatLine = "`n      { id: `"$escapedId`",        name: `"$escapedName`" },"
                $fc = $fc.Substring(0, $catEnd) + $newCatLine + $fc.Substring($catEnd)
            }
        }
    }
    [System.IO.File]::WriteAllText($filePath, $fc, [System.Text.Encoding]::UTF8)
}

function Remove-CategoryFromFile {
    param([string]$filePath, [string]$catId)
    if (-not (Test-Path $filePath)) { return }
    if ([string]::IsNullOrWhiteSpace($catId)) { return }
    $fc = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $escapedId = [regex]::Escape($catId)
    $pattern = '(?m)^\s*\{\s*id:\s*"' + $escapedId + '"\s*,\s*name:\s*"[^"]*"\s*\},?\s*\r?\n?'
    $fc = [regex]::Replace($fc, $pattern, "")
    [System.IO.File]::WriteAllText($filePath, $fc, [System.Text.Encoding]::UTF8)
}

function Rename-CategoryInFile {
    param([string]$filePath, [string]$catId, [string]$catName)
    if (-not (Test-Path $filePath)) { return 0 }
    if ([string]::IsNullOrWhiteSpace($catId) -or [string]::IsNullOrWhiteSpace($catName)) { return 0 }
    $fc = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $escapedId = [regex]::Escape($catId)
    $escapedName = Escape-JsString $catName
    $pattern1 = '(\{\s*id:\s*"' + $escapedId + '"\s*,\s*name:\s*)"[^"]*"'
    $count = [regex]::Matches($fc, $pattern1).Count
    $fc = [regex]::Replace($fc, $pattern1, "`$1`"$escapedName`"")
    $pattern2 = '(categoryId:\s*"' + $escapedId + '"\s*,\s*categoryName:\s*)"[^"]*"'
    $count += [regex]::Matches($fc, $pattern2).Count
    $fc = [regex]::Replace($fc, $pattern2, "`$1`"$escapedName`"")
    [System.IO.File]::WriteAllText($filePath, $fc, [System.Text.Encoding]::UTF8)
    return $count
}

function Move-ProductsToCategoryInFile {
    param([string]$filePath, [int[]]$ids, [string]$catId, [string]$catName)
    if (-not (Test-Path $filePath)) { return 0 }
    if (-not $ids -or $ids.Count -eq 0) { return 0 }
    Ensure-CategoryInFile -filePath $filePath -catId $catId -catName $catName
    $fc = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $escapedCatId = Escape-JsString $catId
    $escapedCatName = Escape-JsString $catName
    $updated = 0
    foreach ($id in $ids) {
        $itemPattern = '\{\s*id:\s*' + $id + ',[^}]*\}'
        if (-not [regex]::IsMatch($fc, $itemPattern)) { continue }
        $fc = [regex]::Replace($fc, $itemPattern, {
            param($m)
            $item = $m.Value
            $item = [regex]::Replace($item, '(categoryId:\s*)"[^"]*"', "`$1`"$escapedCatId`"")
            $item = [regex]::Replace($item, '(categoryName:\s*)"[^"]*"', "`$1`"$escapedCatName`"")
            return $item
        }, 1)
        $updated++
    }
    [System.IO.File]::WriteAllText($filePath, $fc, [System.Text.Encoding]::UTF8)
    return $updated
}

function Get-CategoryRows {
    if (-not (Test-Path $htmlFile)) { return @() }
    $content = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
    $visibleNames = @{}
    $enFile = Join-Path $rootDir "languages\en.js"
    if (Test-Path $enFile) {
        $enContent = [System.IO.File]::ReadAllText($enFile, [System.Text.Encoding]::UTF8)
        $enMatch = [regex]::Match($enContent, 'categories:\s*\{([\s\S]*?)\n\s*\}')
        if ($enMatch.Success) {
            foreach ($tm in [regex]::Matches($enMatch.Groups[1].Value, '([A-Za-z0-9_]+):\s*"([^"]+)"')) {
                $visibleNames[$tm.Groups[1].Value] = $tm.Groups[2].Value
            }
        }
    }
    $catStart = $content.IndexOf("const CATEGORIES = [")
    if ($catStart -lt 0) { return @() }
    $catEnd = $content.IndexOf("];", $catStart)
    if ($catEnd -lt $catStart) { return @() }
    $catBlock = $content.Substring($catStart + "const CATEGORIES = [".Length, $catEnd - $catStart - "const CATEGORIES = [".Length)
    $catMatches = [regex]::Matches($catBlock, '\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*\}')
    $rows = @()
    foreach ($m in $catMatches) {
        $id = $m.Groups[1].Value
        $name = $m.Groups[2].Value
        if ($visibleNames.ContainsKey($id)) { $name = $visibleNames[$id] }
        $count = [regex]::Matches($content, 'categoryId:\s*"' + [regex]::Escape($id) + '"').Count
        $rows += [pscustomobject]@{ id=$id; name=$name; count=$count }
    }
    return $rows
}

function Get-CategoryMap {
    $map = @{}
    foreach ($row in (Get-CategoryRows)) {
        if ($row.id -and $row.name) { $map[$row.id] = $row.name }
    }
    return $map
}

function Optimize-ProductImage {
    param([string]$filePath)
    try {
        Add-Type -AssemblyName System.Drawing -ErrorAction SilentlyContinue
        $img = [System.Drawing.Image]::FromFile($filePath)
        $origBmp = New-Object System.Drawing.Bitmap($img)
        $img.Dispose()
        $w = $origBmp.Width; $h = $origBmp.Height
        if ($w -lt 15 -or $h -lt 15) { $origBmp.Dispose(); return }
        $c1 = $origBmp.GetPixel(2, 2)
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0; $hasContent = $false
        $step = [Math]::Max(1, [Math]::Floor([Math]::Min($w, $h) / 120))
        for ($y = 0; $y -lt $h; $y += $step) {
            for ($x = 0; $x -lt $w; $x += $step) {
                $p = $origBmp.GetPixel($x, $y)
                $isTransparent = ($p.A -lt 30)
                $isWhiteBg     = ($p.R -gt 205 -and $p.G -gt 205 -and $p.B -gt 205)
                $isCornerMatch = ([Math]::Abs([int]$p.R - [int]$c1.R) -lt 25 -and [Math]::Abs([int]$p.G - [int]$c1.G) -lt 25 -and [Math]::Abs([int]$p.B - [int]$c1.B) -lt 25)
                if (-not ($isTransparent -or $isWhiteBg -or $isCornerMatch)) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                    $hasContent = $true
                }
            }
        }
        if (-not $hasContent -or $minX -ge $maxX -or $minY -ge $maxY) {
            $minX = 0; $maxX = $w - 1; $minY = 0; $maxY = $h - 1
        }
        $cropW = $maxX - $minX + 1; $cropH = $maxY - $minY + 1
        $padX = [int]($cropW * 0.01); $padY = [int]($cropH * 0.01)
        $finalMinX = [Math]::Max(0, $minX - $padX); $finalMinY = [Math]::Max(0, $minY - $padY)
        $finalMaxX = [Math]::Min($w - 1, $maxX + $padX); $finalMaxY = [Math]::Min($h - 1, $maxY + $padY)
        $finalW = $finalMaxX - $finalMinX + 1; $finalH = $finalMaxY - $finalMinY + 1
        $targetSize = 450
        $newBmp = New-Object System.Drawing.Bitmap $targetSize, $targetSize
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)
        $scale = [Math]::Min(($targetSize * 0.98) / $finalW, ($targetSize * 0.98) / $finalH)
        $drawW = [int]($finalW * $scale); $drawH = [int]($finalH * $scale)
        $drawX = [int](($targetSize - $drawW) / 2); $drawY = [int](($targetSize - $drawH) / 2)
        $srcRect  = New-Object System.Drawing.Rectangle $finalMinX, $finalMinY, $finalW, $finalH
        $destRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawW, $drawH
        $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        for ($cy = 0; $cy -lt $targetSize; $cy++) {
            for ($cx = 0; $cx -lt $targetSize; $cx++) {
                $px = $newBmp.GetPixel($cx, $cy)
                if ($px.A -gt 0 -and $px.R -gt 220 -and $px.G -gt 220 -and $px.B -gt 220) {
                    $newBmp.SetPixel($cx, $cy, [System.Drawing.Color]::Transparent)
                }
            }
        }
        $origBmp.Dispose(); $g.Dispose()
        $tmpFile = $filePath + ".tmp"
        $newBmp.Save($tmpFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $newBmp.Dispose()
        Remove-Item $filePath -Force
        Move-Item $tmpFile $filePath -Force
    } catch {}
}

function Parse-Multipart {
    param($stream, $contentType)
    
    $ms = New-Object System.IO.MemoryStream
    $stream.CopyTo($ms)
    $bytes = $ms.ToArray()
    
    $boundary = ""
    if ($contentType -and $contentType -match 'boundary=(?:"([^"]+)"|([^\s;]+))') {
        $boundary = if ($Matches[1]) { $Matches[1] } else { $Matches[2] }
    }
    if (-not $boundary -and $contentType) {
        $boundary = ($contentType -replace '.*boundary=', '').Trim().Trim('"')
    }

    if (-not $boundary) { return @{ fields=@{}; imageBytes=$null; imageExt=".png" } }
    
    $fields = @{}
    $imageBytes = $null
    $imageExt = ".png"
    
    $boundaryStr = "--$boundary"
    $bodyText = $isoEncoding.GetString($bytes)
    $escapedB = [regex]::Escape($boundaryStr)
    $parts = $bodyText -split $escapedB
    
    foreach ($part in $parts) {
        if ($part.Trim() -eq "" -or $part.Trim() -eq "--") { continue }
        
        $headerEnd = $part.IndexOf("`r`n`r`n")
        if ($headerEnd -lt 0) { $headerEnd = $part.IndexOf("`n`n") }
        if ($headerEnd -lt 0) { continue }
        
        $headerSep = if ($part.IndexOf("`r`n`r`n") -ge 0) { "`r`n`r`n" } else { "`n`n" }
        $header = $part.Substring(0, $headerEnd)
        $body   = $part.Substring($headerEnd + $headerSep.Length)
        
        if ($body.EndsWith("`r`n")) { $body = $body.Substring(0, $body.Length - 2) }
        
        $nameMatch = [regex]::Match($header, 'name="([^"]+)"')
        if (-not $nameMatch.Success) {
            $nameMatch = [regex]::Match($header, 'name=([^\s;]+)')
        }
        if (-not $nameMatch.Success) { continue }
        $fieldName = $nameMatch.Groups[1].Value
        
        $filenameMatch = [regex]::Match($header, 'filename="([^"]+)"')
        if ($filenameMatch.Success -and $filenameMatch.Groups[1].Value.Trim() -ne "") {
            $origFilename = $filenameMatch.Groups[1].Value
            $imageExt = [System.IO.Path]::GetExtension($origFilename).ToLower()
            if (-not $imageExt) { $imageExt = ".png" }
            $imageBytes = $isoEncoding.GetBytes($body)
        } else {
            $fields[$fieldName] = $body.Trim()
        }
    }
    
    return @{ fields=$fields; imageBytes=$imageBytes; imageExt=$imageExt }
}

function Read-HttpRequest {
    param([System.Net.Sockets.NetworkStream]$stream)

    $headerBuffer = New-Object System.IO.MemoryStream
    $one = New-Object byte[] 1
    while ($stream.Read($one, 0, 1) -eq 1) {
        $headerBuffer.Write($one, 0, 1)
        $hb = $headerBuffer.ToArray()
        $n = $hb.Length
        if ($n -ge 4 -and $hb[$n-4] -eq 13 -and $hb[$n-3] -eq 10 -and $hb[$n-2] -eq 13 -and $hb[$n-1] -eq 10) { break }
        if ($n -gt 65536) { throw "Request header is too large" }
    }

    $headerText = [System.Text.Encoding]::ASCII.GetString($headerBuffer.ToArray())
    $lines = $headerText -split "`r?`n"
    if ($lines.Count -eq 0 -or [string]::IsNullOrWhiteSpace($lines[0])) { return $null }

    $requestParts = $lines[0].Split(" ")
    if ($requestParts.Count -lt 2) { return $null }

    $headers = @{}
    foreach ($line in $lines | Select-Object -Skip 1) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $colon = $line.IndexOf(":")
        if ($colon -gt 0) {
            $headers[$line.Substring(0, $colon).Trim().ToLower()] = $line.Substring($colon + 1).Trim()
        }
    }

    $contentLength = 0
    if ($headers.ContainsKey("content-length")) { [int]::TryParse($headers["content-length"], [ref]$contentLength) | Out-Null }
    $body = New-Object byte[] $contentLength
    $read = 0
    while ($read -lt $contentLength) {
        $chunk = $stream.Read($body, $read, $contentLength - $read)
        if ($chunk -le 0) { break }
        $read += $chunk
    }

    return [pscustomobject]@{
        Method      = $requestParts[0]
        RawPath     = $requestParts[1]
        Headers     = $headers
        BodyStream  = (New-Object System.IO.MemoryStream(,$body))
    }
}

function New-HttpResponse {
    param([System.Net.Sockets.NetworkStream]$stream, [System.Net.Sockets.TcpClient]$client)

    $response = [pscustomobject]@{
        Headers         = @{}
        StatusCode      = 200
        ContentType     = "text/plain; charset=utf-8"
        ContentLength64 = 0
        OutputStream    = (New-Object System.IO.MemoryStream)
        NetworkStream   = $stream
        Client          = $client
        Closed          = $false
    }

    $response | Add-Member -MemberType ScriptMethod -Name Close -Value {
        if ($this.Closed) { return }
        $this.Closed = $true
        $body = $this.OutputStream.ToArray()
        $statusText = switch ($this.StatusCode) {
            200 { "OK" }
            204 { "No Content" }
            400 { "Bad Request" }
            404 { "Not Found" }
            default { "OK" }
        }
        $headerText = "HTTP/1.1 $($this.StatusCode) $statusText`r`n"
        $headerText += "Content-Type: $($this.ContentType)`r`n"
        $headerText += "Content-Length: $($body.Length)`r`n"
        $headerText += "Connection: close`r`n"
        foreach ($key in $this.Headers.Keys) {
            $headerText += "$key`: $($this.Headers[$key])`r`n"
        }
        $headerText += "`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerText)
        $this.NetworkStream.Write($headerBytes, 0, $headerBytes.Length)
        if ($body.Length -gt 0) { $this.NetworkStream.Write($body, 0, $body.Length) }
        $this.OutputStream.Dispose()
        $this.NetworkStream.Dispose()
        $this.Client.Close()
    }

    return $response
}

$listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Parse("127.0.0.1"), $port)

try {
    $listener.Start()
} catch {
    Write-Host "ERROR: Port $port already in use." -ForegroundColor Red
    exit 1
}

Write-Host "Server running at $url"
if (-not $NoBrowser) {
    try { Start-Process "http://localhost:$port/upload" } catch {}
}

while ($true) {
    try {
        $tcpClient = $listener.AcceptTcpClient()
        $stream = $tcpClient.GetStream()
        $rawRequest = Read-HttpRequest -stream $stream
        if ($null -eq $rawRequest) { $tcpClient.Close(); continue }

        $request  = [pscustomobject]@{
            HttpMethod  = $rawRequest.Method
            Url         = [System.Uri]("http://localhost:$port$($rawRequest.RawPath)")
            InputStream = $rawRequest.BodyStream
            ContentType = if ($rawRequest.Headers.ContainsKey("content-type")) { $rawRequest.Headers["content-type"] } else { "" }
        }
        $response = New-HttpResponse -stream $stream -client $tcpClient
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        $path = $request.Url.AbsolutePath

        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $($request.HttpMethod) $path"

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        if ($path -eq "/upload" -or $path -eq "/upload/") {
            $bytes = [System.IO.File]::ReadAllBytes($portalFile)
            $response.StatusCode    = 200
            $response.ContentType   = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "GET" -and $path -eq "/api/stats") {
            $stats = Get-ProductStats
            $json  = "{`"total`":$($stats.total),`"nextId`":$($stats.nextId),`"images`":$($stats.images)}"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.StatusCode = 200
            $response.ContentType = "application/json"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "GET" -and $path -eq "/api/products") {
            try {
                $content = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
                $catMap = Get-CategoryMap
                $prodStart = $content.IndexOf("const PRODUCTS = [")
                $prodEnd   = $content.IndexOf("];", $prodStart)
                $prodBlock = $content.Substring($prodStart + "const PRODUCTS = [".Length, $prodEnd - $prodStart - "const PRODUCTS = [".Length)
                $matches3 = [regex]::Matches($prodBlock, '\{\s*id:\s*(\d+),\s*name:\s*"([^"]*)",\s*price:\s*(\d+),\s*categoryId:\s*"([^"]*)",\s*categoryName:\s*"([^"]*)"[^}]*\}')
                $items = $matches3 | ForEach-Object {
                    $mid=$_.Groups[1].Value; $mname=$_.Groups[2].Value.Replace('\','\\').Replace('"','\"')
                    $mprice=$_.Groups[3].Value; $mcatid=$_.Groups[4].Value
                    $mcatname = $_.Groups[5].Value
                    if ($catMap.ContainsKey($mcatid)) { $mcatname = $catMap[$mcatid] }
                    $mcatname=$mcatname.Replace('\','\\').Replace('"','\"')
                    "{`"id`":$mid,`"name`":`"$mname`",`"price`":$mprice,`"categoryId`":`"$mcatid`",`"categoryName`":`"$mcatname`"}"
                }
                $json = "[" + ($items -join ",") + "]"
            } catch {
                $json = "[]"
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.StatusCode = 200
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "GET" -and $path -eq "/api/categories") {
            try {
                $rows = Get-CategoryRows
                $items = $rows | ForEach-Object {
                    $cid = Escape-JsonString $_.id
                    $cname = Escape-JsonString $_.name
                    "{`"id`":`"$cid`",`"name`":`"$cname`",`"count`":$($_.count)}"
                }
                $json = "[" + ($items -join ",") + "]"
            } catch {
                $json = "[]"
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.StatusCode = 200
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/edit-product") {
            try {
                $parsed2   = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                $f2        = $parsed2.fields
                $imgBytes2 = $parsed2.imageBytes
                $editId    = 0; [int]::TryParse("$($f2['id'])", [ref]$editId) | Out-Null
                $newName   = "$($f2['name'])".Trim().ToUpper()
                $newPrice  = 0
                $priceOk = [int]::TryParse("$($f2['price'])", [ref]$newPrice)
                $newCatId  = ""
                if ($f2.ContainsKey("categoryId") -and $f2["categoryId"]) { $newCatId = "$($f2['categoryId'])" }
                $newCatId = (Normalize-CategoryId $newCatId)
                $newCatName = ""
                if ($f2.ContainsKey("categoryName") -and $f2["categoryName"]) { $newCatName = "$($f2['categoryName'])" }
                $newCatName = $newCatName.Trim()
                if (-not $newCatName) { $newCatName = $newCatId }
                if ($editId -le 0)   { throw "Invalid ID" }
                if (-not $newName)   { throw "Name cannot be empty" }
                if (-not $priceOk -or $newPrice -lt 0) { throw "Price must be 0 or more" }
                if ([string]::IsNullOrWhiteSpace($newCatId)) { throw "Category select karna zaroori hai!" }
                $eName = Escape-JsString $newName
                $eCatId = Escape-JsString $newCatId
                $eCatName = Escape-JsString $newCatName
                $initial = $newName.Substring(0,1).ToUpper()

                # Save image if provided
                $imgSaved = $false
                if ($imgBytes2 -and $imgBytes2.Length -gt 100) {
                    $imgPath2 = Join-Path $imgDir "$editId.png"
                    [System.IO.File]::WriteAllBytes($imgPath2, $imgBytes2)
                    Optimize-ProductImage -filePath $imgPath2
                    $imgSaved = $true
                    Write-Host "  IMG UPDATED: $imgPath2 ($([Math]::Round($imgBytes2.Length/1024,1)) KB)" -ForegroundColor Magenta
                }

                $gradients = @("SWATCH_GRADIENTS[0]","SWATCH_GRADIENTS[1]","SWATCH_GRADIENTS[2]","SWATCH_GRADIENTS[3]","SWATCH_GRADIENTS[4]","SWATCH_GRADIENTS[5]","SWATCH_GRADIENTS[6]","SWATCH_GRADIENTS[7]")
                $grad = $gradients[$editId % 8]

                foreach ($f in @($htmlFile, $jsxFile)) {
                    if (-not (Test-Path $f)) { continue }
                    Ensure-CategoryInFile -filePath $f -catId $newCatId -catName $newCatName
                    $fc = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
                    # Update name
                    $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',\s*name:\s*)"[^"]*"', "`$1`"$eName`"")
                    # Update price
                    $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',\s*name:\s*"[^"]*",\s*price:\s*)\d+', "`${1}$newPrice")
                    # Update category
                    $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',[^}]*?categoryId:\s*)"[^"]*"', "`$1`"$eCatId`"")
                    $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',[^}]*?categoryName:\s*)"[^"]*"', "`$1`"$eCatName`"")
                    # If image newly saved, ensure hasImage, gradient, initial are present
                    if ($imgSaved) {
                        # Check if this item already has hasImage
                        $hasImgMatch = [regex]::Match($fc, '\{\s*id:\s*' + $editId + ',[^}]+hasImage')
                        if (-not $hasImgMatch.Success) {
                            # Add hasImage, gradient, initial before closing }
                            $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',(?:[^}]*?)),(\s*\})', "`$1, hasImage: true, gradient: $grad, initial: `"$initial`"`$2")
                        } else {
                            # Update initial in case name changed
                            $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',[^}]+initial:\s*)"[^"]*"', "`$1`"$initial`"")
                        }
                        # Update PRODUCT_IMAGES set if present
                        $setM = [regex]::Match($fc, 'window\.PRODUCT_IMAGES\s*=\s*new Set\(\[([^\]]+)\]\)')
                        if ($setM.Success -and $fc -notmatch "new Set\(\[.*?$editId.*?\]\)") {
                            $curIds = $setM.Groups[1].Value.Trim()
                            $fc = $fc.Replace($setM.Value, "window.PRODUCT_IMAGES = new Set([$curIds,$editId])")
                        }
                    }
                    [System.IO.File]::WriteAllText($f, $fc, [System.Text.Encoding]::UTF8)
                }
                Write-Host "  EDIT: ID $editId -> '$newName' Rs.$newPrice [$newCatName]$(if($imgSaved){' + new image'})" -ForegroundColor Cyan
                $imgSavedStr = if ($imgSaved) { "true" } else { "false" }
                $json = "{`"ok`":true,`"imgSaved`":$imgSavedStr,`"message`":`"Item updated successfully`"}"
            } catch {
                $em = "$($_.Exception.Message)".Replace('"','\"').Replace("`n"," ")
                $json = "{`"ok`":false,`"message`":`"$em`"}"
                $response.StatusCode = 400
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/delete-category") {
            try {
                $parsedCat = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                $catId = ""
                if ($parsedCat.fields.ContainsKey("categoryId") -and $parsedCat.fields["categoryId"]) {
                    $catId = "$($parsedCat.fields['categoryId'])"
                }
                $catId = Normalize-CategoryId $catId
                if ([string]::IsNullOrWhiteSpace($catId)) { throw "Invalid category" }

                $rows = Get-CategoryRows
                $row = @($rows | Where-Object { $_.id -eq $catId } | Select-Object -First 1)
                if (-not $row -or $row.Count -eq 0) { throw "Category not found" }
                if ([int]$row[0].count -gt 0) { throw "Category empty nahi hai. Pehle is category ke items shift ya delete karein." }

                foreach ($f in @($htmlFile, $jsxFile)) {
                    Remove-CategoryFromFile -filePath $f -catId $catId
                }
                Write-Host "  DELETE CATEGORY: $catId" -ForegroundColor Yellow
                $json = "{`"ok`":true,`"message`":`"Category deleted successfully`"}"
            } catch {
                $em = "$($_.Exception.Message)".Replace('"','\"').Replace("`n"," ")
                $json = "{`"ok`":false,`"message`":`"$em`"}"
                $response.StatusCode = 400
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/rename-category") {
            try {
                $parsedCat = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                $catId = ""
                if ($parsedCat.fields.ContainsKey("categoryId") -and $parsedCat.fields["categoryId"]) {
                    $catId = "$($parsedCat.fields['categoryId'])"
                }
                $catId = Normalize-CategoryId $catId
                $catName = ""
                if ($parsedCat.fields.ContainsKey("categoryName") -and $parsedCat.fields["categoryName"]) {
                    $catName = "$($parsedCat.fields['categoryName'])"
                }
                $catName = $catName.Trim()
                if ([string]::IsNullOrWhiteSpace($catId)) { throw "Invalid category" }
                if ([string]::IsNullOrWhiteSpace($catName)) { throw "Category name cannot be empty" }

                $rows = Get-CategoryRows
                $row = @($rows | Where-Object { $_.id -eq $catId } | Select-Object -First 1)
                if (-not $row -or $row.Count -eq 0) { throw "Category not found" }

                foreach ($f in @($htmlFile, $jsxFile)) {
                    Rename-CategoryInFile -filePath $f -catId $catId -catName $catName | Out-Null
                }
                Write-Host "  RENAME CATEGORY: $catId -> $catName" -ForegroundColor Yellow
                $json = "{`"ok`":true,`"message`":`"Category renamed successfully`"}"
            } catch {
                $em = "$($_.Exception.Message)".Replace('"','\"').Replace("`n"," ")
                $json = "{`"ok`":false,`"message`":`"$em`"}"
                $response.StatusCode = 400
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/bulk-move-products") {
            try {
                $parsedBulk = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                $idsText = ""
                if ($parsedBulk.fields.ContainsKey("ids") -and $parsedBulk.fields["ids"]) {
                    $idsText = "$($parsedBulk.fields['ids'])"
                }
                $ids = @()
                foreach ($part in ($idsText -split ",")) {
                    $num = 0
                    if ([int]::TryParse($part.Trim(), [ref]$num) -and $num -gt 0) { $ids += $num }
                }
                $ids = @($ids | Select-Object -Unique)
                $catId = ""
                if ($parsedBulk.fields.ContainsKey("categoryId") -and $parsedBulk.fields["categoryId"]) {
                    $catId = "$($parsedBulk.fields['categoryId'])"
                }
                $catId = Normalize-CategoryId $catId
                $catName = ""
                if ($parsedBulk.fields.ContainsKey("categoryName") -and $parsedBulk.fields["categoryName"]) {
                    $catName = "$($parsedBulk.fields['categoryName'])"
                }
                $catName = $catName.Trim()
                if ($ids.Count -eq 0) { throw "No items selected" }
                if ([string]::IsNullOrWhiteSpace($catId)) { throw "Invalid category" }
                if ([string]::IsNullOrWhiteSpace($catName)) { $catName = $catId }

                $updated = 0
                $firstFile = $true
                foreach ($f in @($htmlFile, $jsxFile)) {
                    $count = Move-ProductsToCategoryInFile -filePath $f -ids $ids -catId $catId -catName $catName
                    if ($firstFile) { $updated = $count; $firstFile = $false }
                }
                Write-Host "  BULK MOVE: $updated items -> $catName" -ForegroundColor Cyan
                $json = "{`"ok`":true,`"updated`":$updated,`"message`":`"Items moved successfully`"}"
            } catch {
                $em = "$($_.Exception.Message)".Replace('"','\"').Replace("`n"," ")
                $json = "{`"ok`":false,`"message`":`"$em`"}"
                $response.StatusCode = 400
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/delete-product") {
            try {
                $parsed3 = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                $delId   = 0; [int]::TryParse("$($parsed3.fields['id'])", [ref]$delId) | Out-Null
                if ($delId -le 0) { throw "Invalid ID" }
                foreach ($f in @($htmlFile, $jsxFile)) {
                    if (-not (Test-Path $f)) { continue }
                    $fc = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
                    $fc = [regex]::Replace($fc, '(?m)^\s*\{\s*id:\s*' + $delId + ',\s*name:[^\r\n]+[\r\n]*', "")
                    [System.IO.File]::WriteAllText($f, $fc, [System.Text.Encoding]::UTF8)
                }
                # Remove image if it exists
                $imgFile = Join-Path $imgDir "$delId.png"
                if (Test-Path $imgFile) { Remove-Item $imgFile -Force }
                Write-Host "  DELETE: ID $delId" -ForegroundColor Red
                $json = "{`"ok`":true,`"message`":`"Item deleted successfully`"}"
            } catch {
                $em = "$($_.Exception.Message)".Replace('"','\"').Replace("`n"," ")
                $json = "{`"ok`":false,`"message`":`"$em`"}"
                $response.StatusCode = 400
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/add-product") {
            try {
                $parsed = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                
                $fields     = $parsed.fields
                $imageBytes = $parsed.imageBytes
                $imageExt   = $parsed.imageExt
                
                $name = ""
                if ($fields.ContainsKey("name") -and $fields["name"]) { $name = "$($fields['name'])" }
                $name = $name.Trim()

                $priceStr = "0"
                if ($fields.ContainsKey("price") -and $fields["price"]) { $priceStr = "$($fields['price'])" }
                $price = 0
                [int]::TryParse($priceStr, [ref]$price) | Out-Null

                $catId = ""
                if ($fields.ContainsKey("categoryId") -and $fields["categoryId"]) { $catId = "$($fields['categoryId'])" }
                $catId = Normalize-CategoryId $catId

                $catName = ""
                if ($fields.ContainsKey("categoryName") -and $fields["categoryName"]) { $catName = "$($fields['categoryName'])" }
                $catName = $catName.Trim()
                if (-not $catName) { $catName = $catId }

                if ([string]::IsNullOrWhiteSpace($name)) { throw "Item ka naam zaroori hai!" }
                if ($price -le 0) { throw "Sahi price likhna zaroori hai!" }
                if ([string]::IsNullOrWhiteSpace($catId)) { throw "Category select karna zaroori hai!" }

                $stats = Get-ProductStats
                $newId = $stats.nextId

                $hasImage = $false
                if ($imageBytes -and $imageBytes.Length -gt 100) {
                    $imgPath = Join-Path $imgDir "$newId.png"
                    [System.IO.File]::WriteAllBytes($imgPath, $imageBytes)
                    Optimize-ProductImage -filePath $imgPath
                    $hasImage = $true
                    Write-Host "  Image saved: $imgPath ($([Math]::Round($imageBytes.Length/1024,1)) KB)" -ForegroundColor Green
                }

                $initial = if ($name.Length -gt 0) { $name.Substring(0,1).ToUpper() } else { "P" }
                $gradients = @("SWATCH_GRADIENTS[0]","SWATCH_GRADIENTS[1]","SWATCH_GRADIENTS[2]","SWATCH_GRADIENTS[3]","SWATCH_GRADIENTS[4]","SWATCH_GRADIENTS[5]","SWATCH_GRADIENTS[6]","SWATCH_GRADIENTS[7]")
                $grad = $gradients[$newId % 8]

                $escapedName = Escape-JsString $name
                $escapedCat  = Escape-JsString $catName
                $escapedCatId = Escape-JsString $catId

                if ($hasImage) {
                    $newLine = "`n      { id: $newId, name: `"$escapedName`", price: $price, categoryId: `"$escapedCatId`", categoryName: `"$escapedCat`", hasImage: true, gradient: $grad, initial: `"$initial`" },"
                } else {
                    $newLine = "`n      { id: $newId, name: `"$escapedName`", price: $price, categoryId: `"$escapedCatId`", categoryName: `"$escapedCat`" },"
                }

                Ensure-CategoryInFile -filePath $htmlFile -catId $catId -catName $catName
                $html = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
                $prodStart = $html.IndexOf("const PRODUCTS = [")
                if ($prodStart -lt 0) { throw "Could not find PRODUCTS array in index.html" }
                $idx = $html.IndexOf("];", $prodStart)
                if ($idx -lt 0) { throw "Could not find PRODUCTS array end in index.html" }
                $updatedHtml = $html.Substring(0, $idx) + $newLine + "`n    ];" + $html.Substring($idx + 2)
                [System.IO.File]::WriteAllText($htmlFile, $updatedHtml, [System.Text.Encoding]::UTF8)

                if (Test-Path $jsxFile) {
                    Ensure-CategoryInFile -filePath $jsxFile -catId $catId -catName $catName
                    $jsx = [System.IO.File]::ReadAllText($jsxFile, [System.Text.Encoding]::UTF8)
                    $jsxProdStart = $jsx.IndexOf("const PRODUCTS = [")
                    if ($jsxProdStart -ge 0) {
                        $idx2 = $jsx.IndexOf("];", $jsxProdStart)
                        if ($idx2 -ge 0) {
                            $updatedJsx = $jsx.Substring(0, $idx2) + $newLine + "`n    ];" + $jsx.Substring($idx2 + 2)
                            [System.IO.File]::WriteAllText($jsxFile, $updatedJsx, [System.Text.Encoding]::UTF8)
                        }
                    }
                }

                if ($hasImage) {
                    $updatedHtml2 = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
                    $setMatch = [regex]::Match($updatedHtml2, 'window\.PRODUCT_IMAGES\s*=\s*new Set\(\[([^\]]+)\]\)')
                    if ($setMatch.Success) {
                        $currentIds = $setMatch.Groups[1].Value.Trim()
                        $newSet = "window.PRODUCT_IMAGES = new Set([$currentIds,$newId])"
                        $updatedHtml2 = $updatedHtml2.Replace($setMatch.Value, $newSet)
                        [System.IO.File]::WriteAllText($htmlFile, $updatedHtml2, [System.Text.Encoding]::UTF8)
                    }
                }

                Write-Host "  SUCCESS: Added '$name' (ID: $newId, Price: $price)" -ForegroundColor Green

                $json = "{`"ok`":true,`"id`":$newId,`"message`":`"'$escapedName' added successfully with ID $newId`"}"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)

            } catch {
                $errObj = $_
                $errMsg = "$errObj"
                if ($errObj.Exception -and $errObj.Exception.Message) {
                    $errMsg = "$($errObj.Exception.Message)"
                }
                Write-Host "  [CATCH TRIGGERED] Exception: $errMsg" -ForegroundColor Red

                $cleanMsg = $errMsg.Replace('\', '\\').Replace('"', '\"').Replace("`r", "").Replace("`n", " ")
                $json = "{`"ok`":false,`"message`":`"$cleanMsg`"}"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.StatusCode = 400
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        $relPath = $path.TrimStart('/')
        if (-not $relPath -or $relPath -eq "") { $relPath = "index.html" }
        $filePath = Join-Path $rootDir $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext   = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".js"   { "application/javascript" }
                ".css"  { "text/css" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".webp" { "image/webp" }
                ".gif"  { "image/gif" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }
            $response.StatusCode = 200
            $response.ContentType = $ct
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
            $response.StatusCode = 404
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $response.Close()

    } catch {
        Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
        try { if ($response) { $response.Close() } } catch {}
        try { if ($tcpClient) { $tcpClient.Close() } } catch {}
    }
}
