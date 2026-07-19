# PowerShell Web Server for Sahil Traders Admin Portal
$port = 8000
$url = "http://localhost:$port/"
$htmlFile = "c:\Users\ALICOM4\Desktop\ITEMS WEB\index.html"
$jsxFile = "c:\Users\ALICOM4\Desktop\ITEMS WEB\INDEX.JSX"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Error "Could not start server on port $port. Check if port is already in use."
    exit 1
}

Write-Output "=================================================="
Write-Output "   SAHIL TRADERS ADMIN PORTAL SERVER"
Write-Output "=================================================="
Write-Output "Running local server at: $url"
Write-Output "Press Ctrl+C in this window to stop the server."
Write-Output "=================================================="

# Open default web browser
Start-Process $url

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        Write-Output "[$(Get-Date -Format 'HH:mm:ss')] $($request.HttpMethod) $($request.Url.AbsolutePath)"

        # Handle API Save Request
        if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/api/save") {
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $body = $reader.ReadToEnd()
            
            # Parse JSON products array
            $products = $body | ConvertFrom-Json
            
            # Format products array as javascript objects
            $formattedLines = [System.Collections.Generic.List[string]]::new()
            foreach ($p in $products) {
                # Construct object keys dynamically
                $props = [System.Collections.Generic.List[string]]::new()
                $props.Add("id: $($p.id)")
                $props.Add("name: `"$($p.name.Replace('"', '\"'))`"")
                $props.Add("price: $($p.price)")
                $props.Add("categoryId: `"$($p.categoryId)`"")
                
                if ($p.categoryName) { $props.Add("categoryName: `"$($p.categoryName)`"") }
                if ($p.hasImage -eq $true -or $p.hasImage -eq "true") { $props.Add("hasImage: true") }
                if ($p.gradient) { $props.Add("gradient: $($p.gradient)") }
                if ($p.initial) { $props.Add("initial: `"$($p.initial)`"") }
                
                $line = "      { " + ($props -join ", ") + " },"
                $formattedLines.Add($line)
            }
            $productsBlock = "`n" + ($formattedLines -join "`n") + "`n    "

            # Update index.html
            if (Test-Path $htmlFile) {
                $html = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
                $pattern = '(?s)(const\s+PRODUCTS\s*=\s*\[)(.*?)(?=\s*\];)'
                if ($html -match $pattern) {
                    $updatedHtml = [regex]::Replace($html, $pattern, "${1}$productsBlock")
                    [System.IO.File]::WriteAllText($htmlFile, $updatedHtml, [System.Text.Encoding]::UTF8)
                }
            }

            # Update INDEX.JSX
            if (Test-Path $jsxFile) {
                $jsx = [System.IO.File]::ReadAllText($jsxFile, [System.Text.Encoding]::UTF8)
                $pattern = '(?s)(const\s+PRODUCTS\s*=\s*\[)(.*?)(?=\s*\];)'
                if ($jsx -match $pattern) {
                    $updatedJsx = [regex]::Replace($jsx, $pattern, "${1}$productsBlock")
                    [System.IO.File]::WriteAllText($jsxFile, $updatedJsx, [System.Text.Encoding]::UTF8)
                }
            }

            $responseBytes = [System.Text.Encoding]::UTF8.GetBytes("Changes saved successfully to index.html and INDEX.JSX!")
            $response.StatusCode = 200
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $responseBytes.Length
            $response.OutputStream.Write($responseBytes, 0, $responseBytes.Length)
            $response.Close()
            
            Write-Output "--> Saved $($products.Count) products to files."
            continue
        }

        # Handle static files serving
        $relPath = $request.Url.AbsolutePath.TrimStart('/')
        if (-not $relPath) {
            $relPath = "index.html"
        }
        
        $filePath = Join-Path "c:\Users\ALICOM4\Desktop\ITEMS WEB" $relPath
        if (-not (Test-Path $filePath -PathType Leaf)) {
            # Fallback to index.html for virtual routing / SPA fallback
            $filePath = $htmlFile
        }

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".js"   { "application/javascript" }
                ".jsx"  { "application/javascript" }
                ".css"  { "text/css" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".png"  { "image/png" }
                ".webp" { "image/webp" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $response.StatusCode = 200
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $responseBytes = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
            $response.OutputStream.Write($responseBytes, 0, $responseBytes.Length)
        }
        $response.Close()
    } catch {
        Write-Output "[ERROR] $($_.Exception.Message)"
        if ($response) {
            try { $response.Close() } catch {}
        }
    }
}
