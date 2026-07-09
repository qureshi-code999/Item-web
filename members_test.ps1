[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
$ImagePath = "C:\Users\ALICOM4\Desktop\iphone\WhatsApp Image 2026-07-02 at 10.58.21 AM (1).jpeg"
$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath)
$fileOp | Get-Member | Out-File "c:\Users\ALICOM4\Desktop\ITEMS WEB\members.txt"
Write-Host "Wrote members to members.txt"
