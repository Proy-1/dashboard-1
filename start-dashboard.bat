@echo off
echo ========================================
echo   Dashboard Admin E-Commerce
echo ========================================
echo.

cd /d "c:\Users\Admin\dashboard"

echo Checking for Python...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Starting with Python HTTP server...
    echo.
    echo Dashboard: http://localhost:8000
    echo Login: admin@example.com / admin123
    echo.
    echo Press Ctrl+C to stop server
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

echo 📂 Opening dashboard directly in browser...
echo Running in offline mode
echo.
echo Login: admin@example.com / admin123
echo.
start "" "login.html"

:end
echo.
echo Dashboard ready!
pause
