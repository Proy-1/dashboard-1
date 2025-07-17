# Migrasi dari Python Flask ke Golang

## ⚠️ PERHATIAN
Backend ini **SUDAH TIDAK MENGGUNAKAN PYTHON FLASK** lagi. Sekarang menggunakan **Golang dengan Gin framework**.

## 🔄 Perubahan yang Dilakukan

### Yang Dihapus:
- ❌ `app.py` (Python Flask)
- ❌ `requirements.txt` (Python dependencies)
- ❌ Flask, Flask-CORS, PyMongo dependencies
- ❌ Python-specific error handling
- ❌ Python virtual environment

### Yang Ditambahkan:
- ✅ `main.go` (Golang dengan Gin)
- ✅ `go.mod` (Go module dependencies)
- ✅ Gin framework untuk HTTP routing
- ✅ Better error handling dengan Golang
- ✅ Improved performance dan memory efficiency
- ✅ Single binary deployment

## 🚀 Cara Menjalankan Backend Baru

### 1. Install Go (jika belum ada)
```bash
# Download dari https://golang.org/dl/
# Atau gunakan package manager
winget install GoLang.Go
```

### 2. Clone Repository
```bash
git clone https://github.com/Proy-1/back.git
cd back/backend
```

### 3. Install Dependencies
```bash
go mod init pitipaw-backend
go mod tidy
```

### 4. Setup Environment
```bash
# Create .env file
MONGO_URI=mongodb://localhost:27017/pitipaw
PORT=5000
```

### 5. Run Backend
```bash
go run main.go
```

## 📊 Endpoint Compatibility

API endpoints tetap **100% kompatibel** dengan frontend yang ada:

| Endpoint | Method | Status |
|----------|---------|--------|
| `/api/health` | GET | ✅ Compatible |
| `/api/products` | GET, POST | ✅ Compatible |
| `/api/products/{id}` | GET, PUT, DELETE | ✅ Compatible |
| `/api/admins` | GET, POST | ✅ Compatible |
| `/api/admins/{id}` | DELETE | ✅ Compatible |
| `/api/register` | POST | ✅ Compatible |
| `/api/login` | GET, POST | ✅ Compatible |
| `/api/upload` | POST | ✅ Compatible |
| `/api/stats` | GET | ✅ Compatible |
| `/static/uploads/{file}` | GET | ✅ Compatible |

## 🔧 Configuration Changes

### Frontend (config.js)
```javascript
// File upload limit disesuaikan dengan backend Go
MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB (naik dari 5MB)

// Error handling untuk format response Go
{
  "error": "Error message",  // Format error Go
  "message": "Success message"  // Format success Go
}
```

### Database
- MongoDB structure **tidak berubah**
- Collections: `products`, `admins`
- Schema tetap sama

## 🛠️ Troubleshooting

### Jika Masih Mencoba Menjalankan Python:
```bash
# ❌ JANGAN LAKUKAN INI LAGI
python app.py
pip install -r requirements.txt

# ✅ GUNAKAN INI SEKARANG
go run main.go
go mod tidy
```

### Error Common:
- **"Python not found"** → Install Golang, bukan Python
- **"Requirements.txt not found"** → File sudah tidak dibutuhkan, gunakan `go.mod`
- **"Flask module not found"** → Backend sudah tidak menggunakan Flask
- **"Connection refused"** → Pastikan backend Go berjalan di port 5000

### Quick Check:
1. ✅ Backend running: `curl http://localhost:5000/api/health`
2. ✅ Frontend: Buka http://localhost:8000
3. ✅ Console: Lihat "✅ Backend connection established"

## 📝 Development Notes

1. **Port**: Backend tetap di port 5000
2. **Database**: MongoDB setup tetap sama
3. **CORS**: Sudah dikonfigurasi untuk frontend
4. **Upload**: Directory `./static/uploads/` tetap sama
5. **Authentication**: bcrypt password hashing tetap sama

## 🎯 Next Steps

1. ✅ Ensure Golang installed
2. ✅ Clone backend repository
3. ✅ Run `go mod tidy`
4. ✅ Setup `.env` file
5. ✅ Start backend dengan `go run main.go`
6. ✅ Test frontend connection
7. ✅ Remove Python dependencies (jika ada)

---

**Backend migration complete!** 🎉
Frontend tetap berfungsi normal dengan backend Golang yang baru.
