# Dashboard Admin E-Commerce

Dashboard admin sederhana dengan **backend Golang integration**.

## 🚀 Cara Menjalankan

### 1. Setup Backend (Opsional)
```bash
git clone https://github.com/Proy-1/back.git
cd back/backend
go run main.go
```

### 2. Jalankan Dashboard
```bash
go run server.go
```

### 3. Buka Browser
- **Dashboard**: http://localhost:8000 (atau port yang tersedia)
- **Login**: superadmin@company.com / SuperSecure123!

## 💡 Alternative Ways

- **Double-click**: Buka `login.html` langsung
- **Python**: `python -m http.server 8000`
- **Drag**: Seret `login.html` ke browser

## 🔧 Tech Stack

- **Frontend**: HTML, CSS, JavaScript, TailwindCSS
- **Backend**: Golang dengan Gin framework
- **Database**: MongoDB
- **Server**: Go HTTP Server (built-in)

## 📋 Files

- `server.go` - HTTP server untuk dashboard
- `login.html` - Halaman login
- `index.html` - Dashboard utama
- `register.html` - Halaman registrasi
- `assets/` - CSS dan JavaScript files

## 🎯 Features

- ✅ Auto-detect available port
- ✅ Built-in HTTP server
- ✅ Static file serving
- ✅ SPA routing support
- ✅ Security headers
- ✅ Health check endpoint

---

**Ready to use!** 🎉
