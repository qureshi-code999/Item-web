# Master Script: Aggressive Crop, White Background Removal, & High-Resolution Scaling
Add-Type -AssemblyName System.Drawing

$imgDir = if ($PSScriptRoot) { Join-Path $PSScriptRoot "images" } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB\images" }
$files  = Get-ChildItem $imgDir -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp)$' }

Write-Host "Starting Aggressive White-Removal & Item Maximize on $($files.Count) catalog images..." -ForegroundColor Yellow

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

        if ($w -lt 15 -or $h -lt 15) {
            $origBmp.Dispose(); continue
        }

        # Corner background color
        $c1 = $origBmp.GetPixel(2, 2)
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
        $hasContent = $false

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
            # Still process white background removal even if whole box is content
            $minX = 0; $maxX = $w - 1; $minY = 0; $maxY = $h - 1
        }

        # Tight 1% margin
        $cropW = $maxX - $minX + 1
        $cropH = $maxY - $minY + 1

        $padX = [int]($cropW * 0.01)
        $padY = [int]($cropH * 0.01)

        $finalMinX = [Math]::Max(0, $minX - $padX)
        $finalMinY = [Math]::Max(0, $minY - $padY)
        $finalMaxX = [Math]::Min($w - 1, $maxX + $padX)
        $finalMaxY = [Math]::Min($h - 1, $maxY + $padY)

        $finalW = $finalMaxX - $finalMinX + 1
        $finalH = $finalMaxY - $finalMinY + 1

        # Target canvas 450x450
        $targetSize = 450
        $newBmp = New-Object System.Drawing.Bitmap $targetSize, $targetSize
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)

        # Scale content to fill 98% of target canvas!
        $scale = [Math]::Min(($targetSize * 0.98) / $finalW, ($targetSize * 0.98) / $finalH)
        $drawW = [int]($finalW * $scale)
        $drawH = [int]($finalH * $scale)
        $drawX = [int](($targetSize - $drawW) / 2)
        $drawY = [int](($targetSize - $drawH) / 2)

        $srcRect  = New-Object System.Drawing.Rectangle $finalMinX, $finalMinY, $finalW, $finalH
        $destRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawW, $drawH

        $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

        # Remove outer white pixels in the final image so NO white box shows on dark website cards
        for ($cy = 0; $cy -lt $targetSize; $cy++) {
            for ($cx = 0; $cx -lt $targetSize; $cx++) {
                $px = $newBmp.GetPixel($cx, $cy)
                if ($px.A -gt 0 -and $px.R -gt 220 -and $px.G -gt 220 -and $px.B -gt 220) {
                    $newBmp.SetPixel($cx, $cy, [System.Drawing.Color]::Transparent)
                }
            }
        }

        $origBmp.Dispose()
        $g.Dispose()

        $tmpFile = $filePath + ".tmp"
        $newBmp.Save($tmpFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $newBmp.Dispose()

        Remove-Item $filePath -Force
        Move-Item $tmpFile $filePath -Force
        $optimizedCount++

        if ($processedCount % 50 -eq 0) {
            Write-Host "Processed $processedCount / $($files.Count) images (Cleaned & Maximized: $optimizedCount)..." -ForegroundColor Cyan
        }
    } catch {
        # Continue silently on any file format error
    }
}

Write-Host "COMPLETE! $optimizedCount images were cleaned, background-removed, and maximized to 98% full-size!" -ForegroundColor Green
