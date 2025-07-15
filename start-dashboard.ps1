# Dashboard Admin E-Commerce Starter Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Dashboard Admin E-Commerce" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to dashboard directory
Set-Location "c:\Users\Admin\dashboard"

# Function to test if a command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) { return $true }
    }
    catch { return $false }
}

# Try Python first
if (Test-Command "python") {
    Write-Host "✅ Starting Python HTTP server..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Dashboard: " -NoNewline
    Write-Host "http://localhost:8000" -ForegroundColor Yellow
    Write-Host "Login: " -NoNewline
    Write-Host "admin@example.com / admin123" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Red
    Write-Host ""
    
    # Start browser automatically
    Start-Process "http://localhost:8000"
    
    # Start Python server
    python -m http.server 8000
}
# Fallback to direct file opening
else {
    Write-Host "❌ Python not found." -ForegroundColor Red
    Write-Host "Opening dashboard directly in browser..." -ForegroundColor Yellow
    
    $loginPath = Join-Path $PWD "login.html"
    Start-Process $loginPath
}

Write-Host ""
Write-Host "Dashboard stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"
