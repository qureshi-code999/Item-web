$rootDir = if ($PSScriptRoot) { $PSScriptRoot } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB" }
$port = 8000
$url  = "http://localhost:$port/"

# Kill any existing process on port 8000
$existing = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($existing) {
    $pid8000 = $existing[0].OwningProcess
    Stop-Process -Id $pid8000 -Force -ErrorAction SilentlyContinue
    Write-Host "Purana server band kiya (PID $pid8000)"
    Start-Sleep -Seconds 1
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()
Write-Host "=========================================="
Write-Host "  SERVER CHAL RAHA HAI: $url"
Write-Host "  BAND KARNE KE LIYE: Ctrl+C"
Write-Host "=========================================="

# Open browser
Start-Process $url

function Get-MimeType($ext) {
    switch ($ext) {
        ".html" { "text/html; charset=utf-8" }
        ".js"   { "application/javascript; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".png"  { "image/png" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".gif"  { "image/gif" }
        ".ico"  { "image/x-icon" }
        ".svg"  { "image/svg+xml" }
        ".webp" { "image/webp" }
        ".txt"  { "text/plain; charset=utf-8" }
        default { "application/octet-stream" }
    }
}

$ADMIN_TOKEN = "SAHIL-ADMIN-2026-SECURE"

while ($listener.IsListening) {
    try {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $res  = $ctx.Response

        $path = $req.Url.AbsolutePath
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $($req.HttpMethod) $path"

        # Handle POST /api/order
        if ($req.HttpMethod -eq "POST" -and $path -eq "/api/order") {
            $res.StatusCode = 200
            $res.ContentType = "application/json"
            $b = [System.Text.Encoding]::UTF8.GetBytes('{"ok":true}')
            $res.ContentLength64 = $b.Length
            $res.OutputStream.Write($b, 0, $b.Length)
            $res.OutputStream.Close()
            continue
        }

        # Handle POST /api/save (protected)
        if ($req.HttpMethod -eq "POST" -and $path -eq "/api/save") {
            $auth = $req.Headers["Authorization"]
            $tok  = $req.QueryString["token"]
            if ($auth -ne "Bearer $ADMIN_TOKEN" -and $tok -ne $ADMIN_TOKEN) {
                $b = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Unauthorized"}')
                $res.StatusCode = 401
                $res.ContentType = "application/json"
                $res.ContentLength64 = $b.Length
                $res.OutputStream.Write($b, 0, $b.Length)
                $res.OutputStream.Close()
                continue
            }
            $reader = New-Object System.IO.StreamReader($req.InputStream)
            $bodyStr = $reader.ReadToEnd()
            $data = $bodyStr | ConvertFrom-Json
            if ($data.html -and $data.html.Length -gt 1000 -and $data.html -match '<!DOCTYPE html>') {
                $target = Join-Path $rootDir "index.html"
                $backupDir = Join-Path $rootDir "Backups"
                if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
                $ts = (Get-Date).ToString("yyyyMMdd_HHmmss")
                Copy-Item -Path $target -Destination (Join-Path $backupDir "index_backup_adminsave_$ts.html") -Force -ErrorAction SilentlyContinue
                
                $tmpPath = "$target.tmp"
                [System.IO.File]::WriteAllText($tmpPath, $data.html, (New-Object System.Text.UTF8Encoding $false))
                Move-Item -Path $tmpPath -Destination $target -Force
            }
            $b = [System.Text.Encoding]::UTF8.GetBytes('{"ok":true}')
            $res.StatusCode = 200
            $res.ContentType = "application/json"
            $res.ContentLength64 = $b.Length
            $res.OutputStream.Write($b, 0, $b.Length)
            $res.OutputStream.Close()
            continue
        }

        # Static files
        $localPath = $path.TrimStart("/").Replace("/", "\")
        if ($localPath -eq "" -or $localPath -eq "\") { $localPath = "index.html" }
        $filePath = Join-Path $rootDir $localPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext   = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime  = Get-MimeType $ext
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.StatusCode = 200
            $res.ContentType = $mime
            # NO cache for JS and CSS
            if ($ext -eq ".js" -or $ext -eq ".css") {
                $res.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                $res.Headers.Add("Pragma", "no-cache")
                $res.Headers.Add("Expires", "0")
            }
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $res.OutputStream.Close()
        } else {
            $b = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $res.StatusCode = 404
            $res.ContentType = "text/plain"
            $res.ContentLength64 = $b.Length
            $res.OutputStream.Write($b, 0, $b.Length)
            $res.OutputStream.Close()
        }

    } catch {
        # silently continue
    }
}
