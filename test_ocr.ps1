try {
    # Check if Windows.Media.Ocr is available
    $assembly1 = [Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]
    $assembly2 = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
    $assembly3 = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
    Write-Host "Loaded WinRT assemblies successfully!"
} catch {
    Write-Host "Failed to load WinRT assemblies: $_"
}
