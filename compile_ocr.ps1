$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$projectRoot = if ($PSScriptRoot) { $PSScriptRoot } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB" }

$winmds = Get-ChildItem "C:\Windows\System32\WinMetadata\*.winmd" | ForEach-Object { "/r:`"$($_.FullName)`"" }
$facades = Get-ChildItem "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Facades\*.dll" | ForEach-Object { "/r:`"$($_.FullName)`"" }
$runtime = "/r:`"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Runtime.WindowsRuntime.dll`""

$compilerArgs = @()
$compilerArgs += $winmds
$compilerArgs += $facades
$compilerArgs += $runtime
$compilerArgs += "/out:`"$projectRoot\ocr_tool.exe`""
$compilerArgs += "`"$projectRoot\OcrProgram.cs`""

Write-Host "Compiling with csc.exe..."
& $csc $compilerArgs
