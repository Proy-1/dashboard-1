@echo off
echo ========================================
echo   Dashboard E-Commerce - Local Server
echo ========================================
echo.
echo 🚀 Starting local HTTP server...
echo 💡 Dashboard akan tersedia di: http://localhost:8000
echo 💡 Tekan Ctrl+C untuk menghentikan server
echo.
echo 📱 Buka browser dan akses:
echo    👉 http://localhost:8000/register.html
echo    👉 http://localhost:8000/login.html
echo.
python -m http.server 8000
