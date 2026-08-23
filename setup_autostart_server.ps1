# ================================================================
#  SAHIL TRADERS - PERMANENT SERVER SETUP
#  Windows Task Scheduler mein register karta hai
#  Taake PC start hone par automatically server chal jaye
# ================================================================

$rootPath   = if ($PSScriptRoot) { $PSScriptRoot } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB" }
$scriptPath = Join-Path $rootPath "admin_server.ps1"
$taskName   = "SahilTradersServer"

# Purani task hati to pehle remove karo
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File `"$scriptPath`"" `
    -WorkingDirectory $rootPath

$trigger = New-ScheduledTaskTrigger -AtLogOn

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName  $taskName `
    -Action    $action `
    -Trigger   $trigger `
    -Settings  $settings `
    -RunLevel  Highest `
    -Force

Write-Host "Task registered. Starting now..."

# Abhi bhi turant chala do
Start-ScheduledTask -TaskName $taskName

Start-Sleep -Seconds 3

$portConn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portConn) {
    Write-Host ""
    Write-Host "=============================================="
    Write-Host "  SERVER CHAL GAYA! PORT 8000 ACTIVE"
    Write-Host "  http://localhost:8000"
    Write-Host "=============================================="
    Start-Process "http://localhost:8000"
} else {
    Write-Host "Server start hone mein thodi der lag rahi hai..."
    Write-Host "Browser kholo aur jao: http://localhost:8000"
    Start-Process "http://localhost:8000"
}
