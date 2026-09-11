param([switch]$NoBrowser)

# ========================================================
# ZS MART - Daily Sales Report (DSR) and Profit Management Server
# Port: 8889
# ========================================================

$port      = 8889
$url       = "http://localhost:$port/"
$rootDir   = if ($PSScriptRoot) { $PSScriptRoot } else { "c:\Users\ALICOM4\Desktop\ITEMS WEB" }
$portalFile= Join-Path $rootDir "dsr_portal.html"
$prodFile  = Join-Path $rootDir "products.json"
$ratesFile = Join-Path $rootDir "purchase_rates.json"
$dsrFile   = Join-Path $rootDir "dsr_data.json"
$backupDir = Join-Path $rootDir "Backups"

# Kill any existing process on port 8889
try {
    $existing = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($existing) {
        $pids2 = $existing | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($p in $pids2) {
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            Write-Host "[DSR Server] Purana process band kiya (PID $p)" -ForegroundColor Yellow
        }
        Start-Sleep -Milliseconds 800
    }
} catch {}

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

if (-not (Test-Path $ratesFile)) {
    Set-Content -Path $ratesFile -Value '{"updatedAt":"2026-09-10T10:00:00.000Z","rates":{}}' -Encoding UTF8
}

if (-not (Test-Path $dsrFile)) {
    Set-Content -Path $dsrFile -Value '{"orders":[],"expenses":[]}' -Encoding UTF8
}

function Safe-WriteJson($filePath, $content) {
    try {
        $ts = (Get-Date).ToString("yyyyMMdd_HHmmss")
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
        if (Test-Path $filePath) {
            $bkPath = Join-Path $backupDir ($fileName + "_backup_" + $ts + ".json")
            Copy-Item -Path $filePath -Destination $bkPath -Force -ErrorAction SilentlyContinue
        }
        $tmp = "$filePath.tmp"
        [System.IO.File]::WriteAllText($tmp, $content, (New-Object System.Text.UTF8Encoding($false)))
        Move-Item -Path $tmp -Destination $filePath -Force
        return $true
    } catch {
        Write-Host "File write error: $_" -ForegroundColor Red
        return $false
    }
}

function Get-MimeType($ext) {
    switch ($ext.ToLower()) {
        ".html" { "text/html; charset=utf-8" }
        ".js"   { "application/javascript; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".png"  { "image/png" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".webp" { "image/webp" }
        ".svg"  { "image/svg+xml" }
        ".ico"  { "image/x-icon" }
        ".csv"  { "text/csv; charset=utf-8" }
        default { "application/octet-stream" }
    }
}

function Send-Json($res, $data, $status = 200) {
    $json = $data | ConvertTo-Json -Depth 20 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $res.StatusCode = $status
    $res.ContentType = "application/json; charset=utf-8"
    $res.Headers.Add("Access-Control-Allow-Origin", "*")
    $res.Headers.Add("Access-Control-Allow-Headers", "*")
    $res.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()
}

function Send-Error($res, $msg, $status = 400) {
    Send-Json $res @{ ok = $false; error = $msg } $status
}

# Start HTTP Listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  ZS MART - DAILY SALES (DSR) PROFIT SERVER RUNNING" -ForegroundColor Cyan
Write-Host "  URL: $url" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to Stop" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green

if (-not $NoBrowser) {
    Start-Process $url
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $path = $req.Url.AbsolutePath
        $method = $req.HttpMethod

        Write-Host "[$( (Get-Date).ToString('HH:mm:ss') )] $method $path" -ForegroundColor DarkGray

        # CORS preflight
        if ($method -eq "OPTIONS") {
            $res.StatusCode = 204
            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.Headers.Add("Access-Control-Allow-Headers", "*")
            $res.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $res.OutputStream.Close()
            continue
        }

        # ---- GET /api/products ----
        if ($method -eq "GET" -and $path -eq "/api/products") {
            if (Test-Path $prodFile) {
                $pJson = [System.IO.File]::ReadAllText($prodFile, [System.Text.Encoding]::UTF8)
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($pJson)
                $res.StatusCode = 200
                $res.ContentType = "application/json; charset=utf-8"
                $res.Headers.Add("Access-Control-Allow-Origin", "*")
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.OutputStream.Close()
            } else {
                Send-Error $res "products.json not found" 404
            }
            continue
        }

        # ---- GET /api/purchase-rates ----
        if ($method -eq "GET" -and $path -eq "/api/purchase-rates") {
            if (Test-Path $ratesFile) {
                $rJson = [System.IO.File]::ReadAllText($ratesFile, [System.Text.Encoding]::UTF8)
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($rJson)
                $res.StatusCode = 200
                $res.ContentType = "application/json; charset=utf-8"
                $res.Headers.Add("Access-Control-Allow-Origin", "*")
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.OutputStream.Close()
            } else {
                Send-Json $res @{ rates = @{} }
            }
            continue
        }

        # ---- POST /api/save-purchase-rates ----
        if ($method -eq "POST" -and $path -eq "/api/save-purchase-rates") {
            $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $payload = $body | ConvertFrom-Json

            $existingRates = @{}
            if (Test-Path $ratesFile) {
                try {
                    $old = ([System.IO.File]::ReadAllText($ratesFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json
                    if ($old.rates) {
                        $old.rates.PSObject.Properties | ForEach-Object { $existingRates[$_.Name] = [double]$_.Value }
                    }
                } catch {}
            }

            if ($payload.rates) {
                $payload.rates.PSObject.Properties | ForEach-Object {
                    $val = [double]$_.Value
                    if ($val -ge 0) {
                        $existingRates[$_.Name] = $val
                    }
                }
            }

            $toSave = @{ updatedAt = (Get-Date).ToString("o"); rates = $existingRates }
            Safe-WriteJson $ratesFile ($toSave | ConvertTo-Json -Depth 10) | Out-Null
            Send-Json $res @{ ok = $true; message = "Purchase rates saved"; count = $existingRates.Count }
            continue
        }

        # ---- POST /api/update-single-purchase-rate ----
        if ($method -eq "POST" -and $path -eq "/api/update-single-purchase-rate") {
            $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $payload = $body | ConvertFrom-Json

            if ($null -ne $payload.id -and $null -ne $payload.rate) {
                $idStr   = [string]$payload.id
                $rateVal = [double]$payload.rate
                $existingRates = @{}
                if (Test-Path $ratesFile) {
                    try {
                        $old = ([System.IO.File]::ReadAllText($ratesFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json
                        if ($old.rates) {
                            $old.rates.PSObject.Properties | ForEach-Object { $existingRates[$_.Name] = [double]$_.Value }
                        }
                    } catch {}
                }
                $existingRates[$idStr] = $rateVal
                $toSave = @{ updatedAt = (Get-Date).ToString("o"); rates = $existingRates }
                Safe-WriteJson $ratesFile ($toSave | ConvertTo-Json -Depth 10) | Out-Null
                Send-Json $res @{ ok = $true; id = $idStr; rate = $rateVal }
            } else {
                Send-Error $res "Invalid id or rate"
            }
            continue
        }

        # ---- GET /api/dsr ----
        if ($method -eq "GET" -and $path -eq "/api/dsr") {
            $qDate = $req.QueryString["date"]
            if ([string]::IsNullOrWhiteSpace($qDate)) { $qDate = (Get-Date).ToString("yyyy-MM-dd") }

            $dsrObj = @{ orders = @(); expenses = @() }
            if (Test-Path $dsrFile) {
                try {
                    $dsrObj = ([System.IO.File]::ReadAllText($dsrFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json
                } catch {}
            }

            $allOrders   = @($dsrObj.orders)
            $allExpenses = @($dsrObj.expenses)

            # Collect all unique dates for history picker
            $dateSet = @{}
            foreach ($o in $allOrders)   { if ($o.date) { $dateSet[$o.date] = $true } }
            foreach ($e in $allExpenses) { if ($e.date) { $dateSet[$e.date] = $true } }
            $dateSet[$qDate] = $true
            $allDates = @($dateSet.Keys | Sort-Object -Descending)

            $matchedOrders   = @($allOrders   | Where-Object { $_.date -eq $qDate })
            $matchedExpenses = @($allExpenses | Where-Object { $_.date -eq $qDate })

            $totalSales = 0; $totalCost = 0; $totalItemsSold = 0
            $shopOrders = 0; $onlineOrders = 0
            foreach ($ord in $matchedOrders) {
                $totalSales += [double]($ord.totalSale)
                $totalCost  += [double]($ord.totalCost)
                if ($ord.channel -eq "shop") { $shopOrders++ } else { $onlineOrders++ }
                if ($ord.items) { foreach ($it in $ord.items) { $totalItemsSold += [int]($it.qty) } }
            }

            $grossProfit   = $totalSales - $totalCost
            $totalExpenses = 0
            foreach ($exp in $matchedExpenses) { $totalExpenses += [double]($exp.amount) }
            $netProfit = $grossProfit - $totalExpenses
            $marginPct = if ($totalSales -gt 0) { [Math]::Round(($netProfit / $totalSales) * 100, 1) } else { 0 }

            Send-Json $res @{
                ok       = $true
                date     = $qDate
                allDates = $allDates
                summary  = @{
                    date           = $qDate
                    totalOrders    = $matchedOrders.Count
                    shopOrders     = $shopOrders
                    onlineOrders   = $onlineOrders
                    totalItemsSold = $totalItemsSold
                    totalSales     = [Math]::Round($totalSales, 2)
                    totalCost      = [Math]::Round($totalCost, 2)
                    grossProfit    = [Math]::Round($grossProfit, 2)
                    totalExpenses  = [Math]::Round($totalExpenses, 2)
                    netProfit      = [Math]::Round($netProfit, 2)
                    marginPct      = $marginPct
                }
                orders   = $matchedOrders
                expenses = $matchedExpenses
            }
            continue
        }

        # ---- POST /api/save-order ----
        if ($method -eq "POST" -and $path -eq "/api/save-order") {
            $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $body   = $reader.ReadToEnd()
            $order  = $body | ConvertFrom-Json

            if (-not $order.date) { $order | Add-Member -NotePropertyName "date" -NotePropertyValue ((Get-Date).ToString("yyyy-MM-dd")) -Force }
            if (-not $order.time) { $order | Add-Member -NotePropertyName "time" -NotePropertyValue ((Get-Date).ToString("HH:mm")) -Force }
            if (-not $order.id -or [string]::IsNullOrWhiteSpace($order.id)) {
                $order | Add-Member -NotePropertyName "id" -NotePropertyValue ("ORD-" + (Get-Date).ToString("yyyyMMdd") + "-" + (Get-Random -Minimum 1000 -Maximum 9999)) -Force
            }

            # Save updated purchase rates if included in order payload
            if ($order.updatedRates) {
                try {
                    $existingRates = @{}
                    if (Test-Path $ratesFile) {
                        $old = ([System.IO.File]::ReadAllText($ratesFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json
                        if ($old.rates) { $old.rates.PSObject.Properties | ForEach-Object { $existingRates[$_.Name] = [double]$_.Value } }
                    }
                    $order.updatedRates.PSObject.Properties | ForEach-Object { $existingRates[$_.Name] = [double]$_.Value }
                    Safe-WriteJson $ratesFile (@{ updatedAt = (Get-Date).ToString("o"); rates = $existingRates } | ConvertTo-Json -Depth 10) | Out-Null
                } catch {}
            }

            $dsrObj = @{ orders = @(); expenses = @() }
            if (Test-Path $dsrFile) {
                try { $dsrObj = ([System.IO.File]::ReadAllText($dsrFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json } catch {}
            }

            $ordersList = [System.Collections.ArrayList]@()
            $found = $false
            if ($dsrObj.orders) {
                foreach ($o in $dsrObj.orders) {
                    if ($o.id -eq $order.id) { $ordersList.Add($order) | Out-Null; $found = $true }
                    else { $ordersList.Add($o) | Out-Null }
                }
            }
            if (-not $found) { $ordersList.Insert(0, $order) }

            $dsrObj.orders = $ordersList
            Safe-WriteJson $dsrFile ($dsrObj | ConvertTo-Json -Depth 20) | Out-Null
            Send-Json $res @{ ok = $true; message = "Order saved"; order = $order }
            continue
        }

        # ---- POST /api/delete-order ----
        if ($method -eq "POST" -and $path -eq "/api/delete-order") {
            $reader  = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $payload = $reader.ReadToEnd() | ConvertFrom-Json
            if ($payload.id) {
                $dsrObj = @{ orders = @(); expenses = @() }
                if (Test-Path $dsrFile) {
                    try { $dsrObj = ([System.IO.File]::ReadAllText($dsrFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json } catch {}
                }
                $dsrObj.orders = @($dsrObj.orders | Where-Object { $_.id -ne $payload.id })
                Safe-WriteJson $dsrFile ($dsrObj | ConvertTo-Json -Depth 20) | Out-Null
                Send-Json $res @{ ok = $true; id = $payload.id }
            } else { Send-Error $res "Order ID required" }
            continue
        }

        # ---- POST /api/save-expense ----
        if ($method -eq "POST" -and $path -eq "/api/save-expense") {
            $reader  = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $expense = $reader.ReadToEnd() | ConvertFrom-Json

            if (-not $expense.date) { $expense | Add-Member -NotePropertyName "date" -NotePropertyValue ((Get-Date).ToString("yyyy-MM-dd")) -Force }
            if (-not $expense.time) { $expense | Add-Member -NotePropertyName "time" -NotePropertyValue ((Get-Date).ToString("HH:mm")) -Force }
            if (-not $expense.id -or [string]::IsNullOrWhiteSpace($expense.id)) {
                $expense | Add-Member -NotePropertyName "id" -NotePropertyValue ("EXP-" + (Get-Date).ToString("yyyyMMdd") + "-" + (Get-Random -Minimum 1000 -Maximum 9999)) -Force
            }

            $dsrObj = @{ orders = @(); expenses = @() }
            if (Test-Path $dsrFile) {
                try { $dsrObj = ([System.IO.File]::ReadAllText($dsrFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json } catch {}
            }

            $expList = [System.Collections.ArrayList]@()
            $found = $false
            if ($dsrObj.expenses) {
                foreach ($e in $dsrObj.expenses) {
                    if ($e.id -eq $expense.id) { $expList.Add($expense) | Out-Null; $found = $true }
                    else { $expList.Add($e) | Out-Null }
                }
            }
            if (-not $found) { $expList.Insert(0, $expense) }

            $dsrObj.expenses = $expList
            Safe-WriteJson $dsrFile ($dsrObj | ConvertTo-Json -Depth 20) | Out-Null
            Send-Json $res @{ ok = $true; message = "Expense saved"; expense = $expense }
            continue
        }

        # ---- POST /api/delete-expense ----
        if ($method -eq "POST" -and $path -eq "/api/delete-expense") {
            $reader  = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $payload = $reader.ReadToEnd() | ConvertFrom-Json
            if ($payload.id) {
                $dsrObj = @{ orders = @(); expenses = @() }
                if (Test-Path $dsrFile) {
                    try { $dsrObj = ([System.IO.File]::ReadAllText($dsrFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json } catch {}
                }
                $dsrObj.expenses = @($dsrObj.expenses | Where-Object { $_.id -ne $payload.id })
                Safe-WriteJson $dsrFile ($dsrObj | ConvertTo-Json -Depth 20) | Out-Null
                Send-Json $res @{ ok = $true; id = $payload.id }
            } else { Send-Error $res "Expense ID required" }
            continue
        }

        # ---- GET /api/export-csv ----
        if ($method -eq "GET" -and $path -eq "/api/export-csv") {
            $qDate = $req.QueryString["date"]
            if ([string]::IsNullOrWhiteSpace($qDate)) { $qDate = (Get-Date).ToString("yyyy-MM-dd") }

            $dsrObj = @{ orders = @(); expenses = @() }
            if (Test-Path $dsrFile) {
                try { $dsrObj = ([System.IO.File]::ReadAllText($dsrFile, [System.Text.Encoding]::UTF8)) | ConvertFrom-Json } catch {}
            }

            $matchedOrders   = @($dsrObj.orders   | Where-Object { $_.date -eq $qDate })
            $matchedExpenses = @($dsrObj.expenses | Where-Object { $_.date -eq $qDate })

            $sb = New-Object System.Text.StringBuilder
            [void]$sb.AppendLine("ZS MART - DAILY SALES REPORT (DSR)")
            [void]$sb.AppendLine("Report Date: $qDate")
            [void]$sb.AppendLine("")
            [void]$sb.AppendLine("--- ORDERS ---")
            [void]$sb.AppendLine("Order ID,Time,Type,Customer Name,Phone,Payment,Items Count,Total Sale (Rs.),Total Cost (Rs.),Total Profit (Rs.)")

            foreach ($o in $matchedOrders) {
                $type   = if ($o.channel -eq "online") { "Online" } else { "Shop" }
                $cName  = if ($o.customerName)  { $o.customerName.Replace('"', '""') } else { "Walk-in" }
                $cPhone = if ($o.customerPhone) { $o.customerPhone } else { "-" }
                $pay    = if ($o.paymentMethod) { $o.paymentMethod } else { "Cash" }
                $itCnt  = if ($o.items) { $o.items.Count } else { 0 }
                [void]$sb.AppendLine("""$($o.id)"",""$($o.time)"",""$type"",""$cName"",""$cPhone"",""$pay"",$itCnt,$($o.totalSale),$($o.totalCost),$($o.totalProfit)")
            }

            [void]$sb.AppendLine("")
            [void]$sb.AppendLine("--- EXPENSES ---")
            [void]$sb.AppendLine("Expense ID,Time,Category,Title,Amount (Rs.),Notes")
            foreach ($e in $matchedExpenses) {
                $title = if ($e.title) { $e.title.Replace('"', '""') } else { "Expense" }
                $notes = if ($e.notes) { $e.notes.Replace('"', '""') } else { "" }
                [void]$sb.AppendLine("""$($e.id)"",""$($e.time)"",""$($e.category)"",""$title"",$($e.amount),""$notes""")
            }

            $csvStr   = $sb.ToString()
            $csvBytes = [System.Text.Encoding]::UTF8.GetPreamble() + [System.Text.Encoding]::UTF8.GetBytes($csvStr)
            $res.StatusCode = 200
            $res.ContentType = "text/csv; charset=utf-8"
            $res.Headers.Add("Content-Disposition", "attachment; filename=DSR_$qDate.csv")
            $res.ContentLength64 = $csvBytes.Length
            $res.OutputStream.Write($csvBytes, 0, $csvBytes.Length)
            $res.OutputStream.Close()
            continue
        }

        # ---- Static file routing ----
        $localPath = $path.TrimStart("/").Replace("/", "\")
        if ($localPath -eq "" -or $localPath -eq "\" -or $localPath -eq "index.html") {
            $filePath = $portalFile
        } else {
            $filePath = Join-Path $rootDir $localPath
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext   = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime  = Get-MimeType $ext
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.StatusCode = 200
            $res.ContentType = $mime
            if ($ext -eq ".js" -or $ext -eq ".css" -or $ext -eq ".html") {
                $res.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            }
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $res.OutputStream.Close()
        } else {
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.StatusCode = 404
            $res.ContentType = "text/plain"
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $res.OutputStream.Close()
        }

    } catch {
        Write-Host "Request error: $_" -ForegroundColor DarkRed
        try { $res.OutputStream.Close() } catch {}
    }
}
