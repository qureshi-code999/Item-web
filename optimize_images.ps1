# PowerShell script to auto-crop excess blank borders and zoom in product images
Add-Type -AssemblyName System.Drawing

$imgDir = if ($PSScriptRoot) { Join-Path $PSScriptRoot "images" } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB\images" }
$files  = Get-ChildItem $imgDir -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp)$' }

Write-Host "Starting Auto-Crop & High Quality Zoom on $($files.Count) images..." -ForegroundColor Yellow

$processedCount = 0
$optimizedCount = 0

foreach ($f in $files) {
    $processedCount++
    try {
        $filePath = $f.FullName
        $img = [System.Drawing.Image]::FromFile($filePath)
        $origBmp = New-Object System.Drawing.Bitmap($img)
        $img.Dispose()

        $w = $origBmp.Width
        $h = $origBmp.Height

        if ($w -lt 20 -or $h -lt 20) {
            $origBmp.Dispose(); continue
        }

        # Determine corner background color
        $c1 = $origBmp.GetPixel(2, 2)
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
        $hasContent = $false

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

        if (-not $hasContent -or $minX -ge $maxX -or $minY -ge $maxY) {
            $origBmp.Dispose(); continue
        }

        $cropW = $maxX - $minX + 1
        $cropH = $maxY - $minY + 1

        $origArea = $w * $h
        $cropArea = $cropW * $cropH

        # Only crop if excess blank border is present (cropArea < 88% of original)
        if ($cropArea / $origArea -gt 0.88) {
            $origBmp.Dispose(); continue
        }

        # Add small padding margin (2.5%)
        $padX = [int]($cropW * 0.025)
        $padY = [int]($cropH * 0.025)

        $finalMinX = [Math]::Max(0, $minX - $padX)
        $finalMinY = [Math]::Max(0, $minY - $padY)
        $finalMaxX = [Math]::Min($w - 1, $maxX + $padX)
        $finalMaxY = [Math]::Min($h - 1, $maxY + $padY)

        $finalW = $finalMaxX - $finalMinX + 1
        $finalH = $finalMaxY - $finalMinY + 1

        $targetW = $w
        $targetH = $h

        $newBmp = New-Object System.Drawing.Bitmap $targetW, $targetH
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)

        # Scale product content to fill 95% of target image bounds
        $scale = [Math]::Min(($targetW * 0.95) / $finalW, ($targetH * 0.95) / $finalH)
        $drawW = [int]($finalW * $scale)
        $drawH = [int]($finalH * $scale)
        $drawX = [int](($targetW - $drawW) / 2)
        $drawY = [int](($targetH - $drawH) / 2)

        $srcRect  = New-Object System.Drawing.Rectangle $finalMinX, $finalMinY, $finalW, $finalH
        $destRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawW, $drawH

        $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

        $origBmp.Dispose()
        $g.Dispose()

        $tmpFile = $filePath + ".tmp"
        $newBmp.Save($tmpFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $newBmp.Dispose()

        Remove-Item $filePath -Force
        Move-Item $tmpFile $filePath -Force
        $optimizedCount++

        if ($processedCount % 50 -eq 0) {
            Write-Host "Processed $processedCount / $($files.Count) images (Optimized: $optimizedCount)..." -ForegroundColor Cyan
        }
    } catch {
        # Continue on any corrupted file
    }
}

Write-Host "DONE! Total $optimizedCount images were auto-cropped & zoomed to full view!" -ForegroundColor Green
