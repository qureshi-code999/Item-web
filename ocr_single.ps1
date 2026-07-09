[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$ImagePath = "C:\Users\ALICOM4\Desktop\iphone\WhatsApp Image 2026-07-02 at 10.58.21 AM (1).jpeg"

$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath)
while ($fileOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$file = $fileOp.GetResults()

$streamOp = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
while ($streamOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$stream = $streamOp.GetResults()

$decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
while ($decoderOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$decoder = $decoderOp.GetResults()

$bitmapOp = $decoder.GetSoftwareBitmapAsync()
while ($bitmapOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$bitmap = $bitmapOp.GetResults()

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $lang = New-Object Windows.Globalization.Language("en-US")
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
}

$ocrOp = $engine.RecognizeAsync($bitmap)
while ($ocrOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$result = $ocrOp.GetResults()

Write-Host "OCR Text of $ImagePath :"
foreach ($line in $result.Lines) {
    Write-Host $line.Text
}
