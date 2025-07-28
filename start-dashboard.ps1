# PowerShell HTTP Server untuk Dashboard E-Commerce
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Dashboard E-Commerce - Local Server" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Starting PowerShell HTTP server..." -ForegroundColor Green
Write-Host "💡 Dashboard akan tersedia di: http://localhost:8000" -ForegroundColor Yellow
Write-Host "💡 Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 Buka browser dan akses:" -ForegroundColor Magenta
Write-Host "   👉 http://localhost:8000/register.html" -ForegroundColor White
Write-Host "   👉 http://localhost:8000/login.html" -ForegroundColor White
Write-Host ""

# Set location to dashboard folder
Set-Location "c:\Users\user\dashboard-1"

# Try Python first
try {
    python -m http.server 8000
} catch {
    # Fallback to PowerShell HTTP server
    Write-Host "Python tidak tersedia, menggunakan PowerShell HTTP server..." -ForegroundColor Yellow
    
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:8000/")
    $listener.Start()
    
    Write-Host "✅ Server berjalan di http://localhost:8000" -ForegroundColor Green
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.AbsolutePath
        if ($path -eq "/") { $path = "/login.html" }
        
        $filePath = Join-Path (Get-Location) $path.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
        }
        
        $response.OutputStream.Close()
    }
}
