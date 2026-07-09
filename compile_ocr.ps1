$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

$winmds = Get-ChildItem "C:\Windows\System32\WinMetadata\*.winmd" | ForEach-Object { "/r:`"$($_.FullName)`"" }
$facades = Get-ChildItem "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Facades\*.dll" | ForEach-Object { "/r:`"$($_.FullName)`"" }
$runtime = "/r:`"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Runtime.WindowsRuntime.dll`""

$compilerArgs = @()
$compilerArgs += $winmds
$compilerArgs += $facades
$compilerArgs += $runtime
$compilerArgs += "/out:`"c:\Users\ALICOM4\Desktop\ITEMS WEB\ocr_tool.exe`""
$compilerArgs += "`"c:\Users\ALICOM4\Desktop\ITEMS WEB\OcrProgram.cs`""

Write-Host "Compiling with csc.exe..."
& $csc $compilerArgs
