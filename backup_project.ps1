# ============================================================
#  SAHIL TRADERS - PROJECT BACKUP SCRIPT
#  Double-click "CREATE BACKUP.bat" to run.
# ============================================================

Add-Type -AssemblyName "System.IO.Compression"
Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$rootDir   = $PSScriptRoot
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupDir = Join-Path $rootDir "Backups"
$zipName   = "Sahil_Traders_Backup_$timestamp.zip"
$zipPath   = Join-Path $backupDir $zipName

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   SAHIL TRADERS - BACKUP SYSTEM" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup shuru ho raha hai..." -ForegroundColor Yellow
Write-Host "Saving to: $zipPath"
Write-Host ""

$excludeDirs = @("Backups","archive","xlsx_tmp","scratch",".git",".agents")
$excludeFiles = @("temp_preprocessed.png","sample_preprocessed.png","cloudflared.exe","eng.traineddata")

$allFiles = Get-ChildItem -Path $rootDir -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($rootDir.Length + 1)
    $topDir = $rel.Split('\')[0]
    if ($excludeDirs -contains $topDir) { return $false }
    if ($excludeFiles -contains $_.Name) { return $false }
    return $true
}

$totalFiles = $allFiles.Count
$totalMB    = [math]::Round(($allFiles | Measure-Object -Property Length -Sum).Sum / 1MB, 1)
Write-Host "Backing up: $totalFiles files ($totalMB MB)" -ForegroundColor White
Write-Host ""

try {
    $zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
    $archive   = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

    $done = 0
    foreach ($file in $allFiles) {
        $entryName = $file.FullName.Substring($rootDir.Length + 1).Replace('\','/')
        try {
            $entry = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
            $entryStream = $entry.Open()
            $fileStream  = [System.IO.File]::OpenRead($file.FullName)
            $fileStream.CopyTo($entryStream)
            $fileStream.Close()
            $entryStream.Close()
            $done++
        } catch {
            Write-Host "  [Skip] $entryName" -ForegroundColor DarkGray
        }
    }

    $archive.Dispose()
    $zipStream.Close()

    $sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)

    Write-Host "============================================" -ForegroundColor Green
    Write-Host "   BACKUP KAMYAAB HO GAYA!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "File  : $zipName" -ForegroundColor White
    Write-Host "Size  : $sizeMB MB (compressed)" -ForegroundColor White
    Write-Host "Files : $done" -ForegroundColor White
    Write-Host "Path  : $backupDir" -ForegroundColor White
    Write-Host ""
    Write-Host ">>> Is ZIP file ko USB ya Google Drive mein copy karein!" -ForegroundColor Yellow
    Write-Host ">>> Taake laptop kharab hone par bhi sara data mehfooz rahe." -ForegroundColor Yellow
    Write-Host ""

    Start-Process "explorer.exe" $backupDir

    # Keep only last 5 backups
    $old = Get-ChildItem -Path $backupDir -Filter "Sahil_Traders_Backup_*.zip" |
           Sort-Object LastWriteTime -Descending | Select-Object -Skip 5
    if ($old) {
        $old | Remove-Item -Force
        Write-Host "Auto-cleanup: $($old.Count) purana backup remove kiya." -ForegroundColor DarkGray
    }

} catch {
    Write-Host ""
    Write-Host "ERROR: Backup fail ho gaya!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
