# RECOVERY SCRIPT: Restore transparent pixels back to white (undo white-removal damage)
# Then re-apply ONLY safe crop+zoom WITHOUT any white-pixel removal
Add-Type -AssemblyName System.Drawing

$imgDir = if ($PSScriptRoot) { Join-Path $PSScriptRoot "images" } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB\images" }
$files  = Get-ChildItem $imgDir -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp)$' }

Write-Host "RECOVERY: Fixing $($files.Count) damaged images..." -ForegroundColor Yellow

$fixedCount = 0
$processedCount = 0

foreach ($f in $files) {
    $processedCount++
    try {
        $filePath = $f.FullName
        $img = [System.Drawing.Image]::FromFile($filePath)
        $origBmp = New-Object System.Drawing.Bitmap($img)
        $img.Dispose()

        $w = $origBmp.Width
        $h = $origBmp.Height

        if ($w -lt 10 -or $h -lt 10) { $origBmp.Dispose(); continue }

        # --- STEP 1: RESTORE transparent pixels back to white ---
        # This undoes the previous white-removal damage
        $hadTransparent = $false
        for ($y = 0; $y -lt $h; $y++) {
            for ($x = 0; $x -lt $w; $x++) {
                $px = $origBmp.GetPixel($x, $y)
                if ($px.A -lt 30) {
                    $origBmp.SetPixel($x, $y, [System.Drawing.Color]::White)
                    $hadTransparent = $true
                }
            }
        }

        # --- STEP 2: SAFE crop+zoom (NO white removal) ---
        # Detect subject bounding box
        $c1 = $origBmp.GetPixel(2, 2)
        $minX = $w; $maxX = 0; $minY = $h; $maxY = 0
        $hasContent = $false

        $step = [Math]::Max(1, [Math]::Floor([Math]::Min($w, $h) / 100))

        for ($y = 0; $y -lt $h; $y += $step) {
            for ($x = 0; $x -lt $w; $x += $step) {
                $p = $origBmp.GetPixel($x, $y)
                $isWhiteBg = ($p.R -gt 245 -and $p.G -gt 245 -and $p.B -gt 245)
                $isCornerMatch = ([Math]::Abs([int]$p.R - [int]$c1.R) -lt 12 `
                               -and [Math]::Abs([int]$p.G - [int]$c1.G) -lt 12 `
                               -and [Math]::Abs([int]$p.B - [int]$c1.B) -lt 12)
                if (-not ($isWhiteBg -or $isCornerMatch)) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                    $hasContent = $true
                }
            }
        }

        # Only crop if we found a distinct subject area (>12% gain)
        $doCrop = $hasContent -and $minX -lt $maxX -and $minY -lt $maxY
        if ($doCrop) {
            $cropRatio = (($maxX - $minX + 1) * ($maxY - $minY + 1)) / ($w * $h)
            if ($cropRatio -gt 0.88) { $doCrop = $false }
        }

        if (-not $doCrop -and -not $hadTransparent) {
            $origBmp.Dispose(); continue
        }

        $targetSize = 500
        $newBmp = New-Object System.Drawing.Bitmap $targetSize, $targetSize
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        # White background (safe - no transparency)
        $g.Clear([System.Drawing.Color]::White)

        if ($doCrop) {
            # Crop with 3% padding and scale to 96% of canvas
            $cropW = $maxX - $minX + 1
            $cropH = $maxY - $minY + 1
            $padX = [int]($cropW * 0.03)
            $padY = [int]($cropH * 0.03)
            $fX1 = [Math]::Max(0, $minX - $padX)
            $fY1 = [Math]::Max(0, $minY - $padY)
            $fX2 = [Math]::Min($w - 1, $maxX + $padX)
            $fY2 = [Math]::Min($h - 1, $maxY + $padY)
            $fW  = $fX2 - $fX1 + 1
            $fH  = $fY2 - $fY1 + 1

            $scale = [Math]::Min(($targetSize * 0.96) / $fW, ($targetSize * 0.96) / $fH)
            $drawW = [int]($fW * $scale)
            $drawH = [int]($fH * $scale)
            $drawX = [int](($targetSize - $drawW) / 2)
            $drawY = [int](($targetSize - $drawH) / 2)

            $srcRect  = New-Object System.Drawing.Rectangle $fX1, $fY1, $fW, $fH
            $destRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawW, $drawH
            $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        } else {
            # Just scale whole image to fill 96% of canvas
            $scale = [Math]::Min(($targetSize * 0.96) / $w, ($targetSize * 0.96) / $h)
            $drawW = [int]($w * $scale)
            $drawH = [int]($h * $scale)
            $drawX = [int](($targetSize - $drawW) / 2)
            $drawY = [int](($targetSize - $drawH) / 2)
            $srcRect  = New-Object System.Drawing.Rectangle 0, 0, $w, $h
            $destRect = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawW, $drawH
            $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        }

        $origBmp.Dispose()
        $g.Dispose()

        $tmpFile = $filePath + ".tmp"
        $newBmp.Save($tmpFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $newBmp.Dispose()

        Remove-Item $filePath -Force
        Move-Item $tmpFile $filePath -Force
        $fixedCount++

        if ($processedCount % 50 -eq 0) {
            Write-Host "Processed $processedCount / $($files.Count)  |  Fixed: $fixedCount" -ForegroundColor Cyan
        }

    } catch { }
}

Write-Host "DONE! $fixedCount images recovered and safely re-cropped!" -ForegroundColor Green
