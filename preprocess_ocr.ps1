param(
    [Parameter(Mandatory=$true)][string]$ImagePath,
    [Parameter(Mandatory=$true)][string]$OutputPath,
    [int]$CropX = 0,
    [int]$CropY = 220,
    [int]$CropW = 860,
    [int]$CropH = 980,
    [int]$Scale = 3
)

Add-Type -AssemblyName System.Drawing

$source = [System.Drawing.Bitmap]::FromFile($ImagePath)
try {
    $x = [Math]::Max(0, [Math]::Min($CropX, $source.Width - 1))
    $y = [Math]::Max(0, [Math]::Min($CropY, $source.Height - 1))
    $w = [Math]::Min($CropW, $source.Width - $x)
    $h = [Math]::Min($CropH, $source.Height - $y)
    $cropRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $source.Clone($cropRect, $source.PixelFormat)
    try {
        $targetW = [int]($cropped.Width * $Scale)
        $targetH = [int]($cropped.Height * $Scale)
        $target = New-Object System.Drawing.Bitmap -ArgumentList $targetW, $targetH
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($target)
            try {
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.DrawImage($cropped, 0, 0, $target.Width, $target.Height)
            } finally {
                $graphics.Dispose()
            }

            $dir = Split-Path -Parent $OutputPath
            if ($dir -and -not (Test-Path -LiteralPath $dir)) {
                New-Item -ItemType Directory -Path $dir | Out-Null
            }
            $target.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $target.Dispose()
        }
    } finally {
        $cropped.Dispose()
    }
} finally {
    $source.Dispose()
}
