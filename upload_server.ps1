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

function Optimize-ProductImage {
    param([string]$filePath)
    try {
        Add-Type -AssemblyName System.Drawing -ErrorAction SilentlyContinue
        $img = [System.Drawing.Image]::FromFile($filePath)
        $origBmp = New-Object System.Drawing.Bitmap($img)
        $img.Dispose()
        $w = $origBmp.Width; $h = $origBmp.Height
        if ($w -lt 20 -or $h -lt 20) { $origBmp.Dispose(); return }
        $c1 = $origBmp.GetPixel(2, 2)
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0; $hasContent = $false
        $step = [Math]::Max(1, [Math]::Floor([Math]::Min($w, $h) / 100))
        for ($y = 0; $y -lt $h; $y += $step) {
            for ($x = 0; $x -lt $w; $x += $step) {
                $p = $origBmp.GetPixel($x, $y)
                $isTransparent = ($p.A -lt 30)
                $isWhiteBg     = ($p.R -gt 238 -and $p.G -gt 238 -and $p.B -gt 238)
                $isCornerMatch = ([Math]::Abs([int]$p.R - [int]$c1.R) -lt 18 -and [Math]::Abs([int]$p.G - [int]$c1.G) -lt 18 -and [Math]::Abs([int]$p.B - [int]$c1.B) -lt 18)
                if (-not ($isTransparent -or $isWhiteBg -or $isCornerMatch)) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                    $hasContent = $true
                }
            }
        }
        if (-not $hasContent -or $minX -ge $maxX -or $minY -ge $maxY) { $origBmp.Dispose(); return }
        $cropW = $maxX - $minX + 1; $cropH = $maxY - $minY + 1
        if ($cropW * $cropH / ($w * $h) -gt 0.88) { $origBmp.Dispose(); return }
        $padX = [int]($cropW * 0.025); $padY = [int]($cropH * 0.025)
        $finalMinX = [Math]::Max(0, $minX - $padX); $finalMinY = [Math]::Max(0, $minY - $padY)
        $finalMaxX = [Math]::Min($w - 1, $maxX + $padX); $finalMaxY = [Math]::Min($h - 1, $maxY + $padY)
        $finalW = $finalMaxX - $finalMinX + 1; $finalH = $finalMaxY - $finalMinY + 1
        $newBmp = New-Object System.Drawing.Bitmap $w, $h
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)
        $scale = [Math]::Min(($w * 0.95) / $finalW, ($h * 0.95) / $finalH)
        $drawW = [int]($finalW * $scale); $drawH = [int]($finalH * $scale)
        $drawX = [int](($w - $drawW) / 2); $drawY = [int](($h - $drawH) / 2)
        $srcRect  = New-Object System.Drawing.Rectangle $finalMinX, $finalMinY, $finalW, $finalH
        $destRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawW, $drawH
        $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
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

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Host "ERROR: Port $port already in use." -ForegroundColor Red
    exit 1
}

Write-Host "Server running at $url"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $path = $request.Url.AbsolutePath

        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $($request.HttpMethod) $path"

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
                $prodStart = $content.IndexOf("const PRODUCTS = [")
                $prodEnd   = $content.IndexOf("];", $prodStart)
                $prodBlock = $content.Substring($prodStart + "const PRODUCTS = [".Length, $prodEnd - $prodStart - "const PRODUCTS = [".Length)
                $matches3 = [regex]::Matches($prodBlock, '\{\s*id:\s*(\d+),\s*name:\s*"([^"]*)",\s*price:\s*(\d+),\s*categoryId:\s*"([^"]*)",\s*categoryName:\s*"([^"]*)"[^}]*\}')
                $items = $matches3 | ForEach-Object {
                    $mid=$_.Groups[1].Value; $mname=$_.Groups[2].Value.Replace('\','\\').Replace('"','\"')
                    $mprice=$_.Groups[3].Value; $mcatid=$_.Groups[4].Value; $mcatname=$_.Groups[5].Value.Replace('\','\\').Replace('"','\"')
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

        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/edit-product") {
            try {
                $parsed2   = Parse-Multipart -stream $request.InputStream -contentType $request.ContentType
                $f2        = $parsed2.fields
                $imgBytes2 = $parsed2.imageBytes
                $editId    = 0; [int]::TryParse("$($f2['id'])", [ref]$editId) | Out-Null
                $newName   = "$($f2['name'])".Trim().ToUpper()
                $newPrice  = 0; [int]::TryParse("$($f2['price'])", [ref]$newPrice) | Out-Null
                if ($editId -le 0)   { throw "Invalid ID" }
                if (-not $newName)   { throw "Name cannot be empty" }
                if ($newPrice -le 0) { throw "Price must be positive" }
                $eName = $newName.Replace('\','\\').Replace('"','\"')
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
                    $fc = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
                    # Update name
                    $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',\s*name:\s*)"[^"]*"', "`$1`"$eName`"")
                    # Update price
                    $fc = [regex]::Replace($fc, '(\{\s*id:\s*' + $editId + ',\s*name:\s*"[^"]*",\s*price:\s*)\d+', "`${1}$newPrice")
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
                Write-Host "  EDIT: ID $editId -> '$newName' Rs.$newPrice$(if($imgSaved){' + new image'})" -ForegroundColor Cyan
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
                $catId = $catId.Trim()

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

                $escapedName = $name.Replace('\', '\\').Replace('"', '\"')
                $escapedCat  = $catName.Replace('\', '\\').Replace('"', '\"')

                if ($hasImage) {
                    $newLine = "`n      { id: $newId, name: `"$escapedName`", price: $price, categoryId: `"$catId`", categoryName: `"$escapedCat`", hasImage: true, gradient: $grad, initial: `"$initial`" },"
                } else {
                    $newLine = "`n      { id: $newId, name: `"$escapedName`", price: $price, categoryId: `"$catId`", categoryName: `"$escapedCat`" },"
                }

                $html = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
                $prodStart = $html.IndexOf("const PRODUCTS = [")
                if ($prodStart -lt 0) { throw "Could not find PRODUCTS array in index.html" }
                $idx = $html.IndexOf("];", $prodStart)
                if ($idx -lt 0) { throw "Could not find PRODUCTS array end in index.html" }
                $updatedHtml = $html.Substring(0, $idx) + $newLine + "`n    ];" + $html.Substring($idx + 2)
                [System.IO.File]::WriteAllText($htmlFile, $updatedHtml, [System.Text.Encoding]::UTF8)

                if (Test-Path $jsxFile) {
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
        try { if ($context.Response) { $context.Response.Close() } } catch {}
    }
}