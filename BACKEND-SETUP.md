# Backend Golang Setup Guide

## Overview
Dashboard ini menggunakan backend **Golang** dengan framework **Gin** dan database **MongoDB**. Backend sebelumnya menggunakan Python Flask, tapi sekarang sudah dimigrasi ke Golang untuk performa yang lebih baik.

## 🚀 Quick Start

### 1. Clone Backend Repository
```bash
git clone https://github.com/Proy-1/back.git
cd back/backend
```

### 2. Install Dependencies
```bash
go mod init pitipaw-backend
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
go get go.mongodb.org/mongo-driver/mongo
go get github.com/joho/godotenv
go get golang.org/x/crypto/bcrypt
```

### 3. Setup Environment
Create `.env` file:
```bash
MONGO_URI=mongodb://localhost:27017/pitipaw
PORT=5000
```

### 4. Run Backend
```bash
go run main.go
```

Backend akan berjalan di: `http://localhost:5000`

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Cek status backend dan database connection

### Products
- `GET /api/products` - Ambil semua produk
- `POST /api/products` - Tambah produk baru
- `GET /api/products/{id}` - Ambil produk berdasarkan ID
- `PUT /api/products/{id}` - Update produk
- `DELETE /api/products/{id}` - Hapus produk

### Admins
- `GET /api/admins` - Ambil semua admin (password disembunyikan)
- `POST /api/admins` - Tambah admin baru
- `DELETE /api/admins/{id}` - Hapus admin

### Authentication
- `POST /api/register` - Register admin baru
- `GET /api/login` - Info endpoint login
- `POST /api/login` - Login admin

### Upload
- `POST /api/upload` - Upload gambar produk (max 10MB)

### Statistics
- `GET /api/stats` - Statistik produk dan admin

### Static Files
- `GET /static/uploads/{filename}` - Akses file gambar yang diupload

## 🔧 Configuration

### Database
- **MongoDB**: `mongodb://localhost:27017/pitipaw`
- **Collections**: `products`, `admins`

### CORS
Backend sudah dikonfigurasi untuk menerima request dari:
- `http://localhost:3000` (frontend)
- `http://localhost:8000` (dashboard)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8000`

### File Upload
- **Directory**: `./static/uploads/`
- **Max Size**: 10MB
- **Allowed Types**: JPG, PNG, GIF, JPEG

## 🔐 Security Features

- **Password Hashing**: bcrypt untuk password admin
- **Input Validation**: Gin binding untuk validasi data
- **File Type Validation**: Hanya image files yang diizinkan
- **File Size Limits**: Maksimal 10MB per upload
- **Secure Filename Handling**: Mencegah directory traversal

## 🚫 Perubahan dari Python Flask

### Yang Dihapus:
- ❌ Python Flask dependencies
- ❌ `requirements.txt`
- ❌ `app.py`
- ❌ Python-specific configuration

### Yang Ditambahkan:
- ✅ Golang dengan Gin framework
- ✅ `main.go` sebagai entry point
- ✅ `go.mod` untuk dependency management
- ✅ Better error handling
- ✅ Improved performance dengan goroutines
- ✅ Smaller binary size untuk deployment

## 📊 Performance Advantages

Dibanding Python Flask:
- **5-10x lebih cepat** dalam request handling
- **Lower memory usage** (~50% lebih efisien)
- **Better concurrency** dengan goroutines
- **Single binary deployment** tanpa dependencies
- **Compile-time error checking**

## 🛠️ Development

### Build Production
```bash
go build -o backend main.go
```

### Run Production
```bash
./backend
```

### Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Upload image
curl -X POST -F "image=@image.jpg" http://localhost:5000/api/upload
```

## 🔍 Verifikasi Setup

### 1. Test Backend Manual
```bash
# Test health check
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "ok", 
  "message": "Backend is running",
  "database": "connected"
}
```

### 2. Test dari Browser
- Buka: http://localhost:5000/api/health
- Pastikan muncul response JSON dengan status "ok"

### 3. Test Frontend Connection
- Jalankan dashboard di http://localhost:8000
- Check browser console untuk: "✅ Backend connection established"
- Lihat status backend di header dashboard

## 📝 Notes

- Backend **TIDAK** lagi menggunakan Python Flask
- Database structure tetap sama (MongoDB)
- API endpoints tetap kompatibel dengan frontend
- Upload folder: `./static/uploads/`
- Default port: 5000
