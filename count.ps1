# Parse existing products directly from index.html
$htmlPath = "c:\Users\ALICOM4\Desktop\ITEMS WEB\index.html"
$htmlContent = Get-Content $htmlPath -Raw
$productsBlock = [regex]::Match($htmlContent, '(?ms)const PRODUCTS = \[(.*?)\];').Groups[1].Value

$matches = [regex]::Matches($productsBlock, '\{\s*id:\s*(\d+),\s*name:\s*"([^"]+)",\s*price:\s*(\d+),\s*categoryId:\s*"([^"]+)",\s*categoryName:\s*"([^"]+)",\s*hasImage:\s*(true|false),\s*gradient:\s*SWATCH_GRADIENTS\[(\d+)\],\s*initial:\s*"([^"]+)"\s*\}')

Write-Host "Total Parsed products in index.html:" $matches.Count
