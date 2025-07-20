# 🔐 Authentication System Documentation

## 📋 Overview
Dashboard ini sekarang memiliki sistem authentication lengkap dengan:
- **Backend API** (Go server dengan in-memory database)
- **Frontend validation** dengan alert yang jelas
- **Registrasi user baru** 
- **Login dengan validasi**

## 🚀 Server Info
- **Port**: 8001 (auto-detected)
- **Base URL**: http://localhost:8001
- **API Base**: http://localhost:8001/api

## 🔑 Default Admin Account
- **Email**: `superadmin@company.com`
- **Password**: `SuperSecure123!`

## 📖 API Endpoints

### 1. POST /api/register
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "email": "user@example.com"
  }
}
```

**Error Response (409 - User exists):**
```json
{
  "success": false,
  "error": "Email sudah terdaftar"
}
```

### 2. POST /api/login
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "email": "user@example.com",
    "token": "demo-token-1234567890"
  }
}
```

**Error Response (401 - Invalid credentials):**
```json
{
  "success": false,
  "error": "Email atau password salah"
}
```

### 3. GET /api/users
**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar user berhasil diambil",
  "data": {
    "users": [
      "superadmin@company.com",
      "user@example.com"
    ],
    "count": 2
  }
}
```

## 🧪 Testing

### 1. API Testing
- **URL**: http://localhost:8001/api-test.html
- **Features**: 
  - Test registration (new user)
  - Test registration (existing user)
  - Test login (valid credentials)
  - Test login (invalid credentials)
  - Get all registered users

### 2. Login Testing
- **URL**: http://localhost:8001/login.html
- **Test Buttons**:
  - ✅ Test Valid Login
  - ❌ Test Invalid Login

### 3. Register Testing
- **URL**: http://localhost:8001/register.html
- **Features**:
  - Email validation
  - Password strength checker
  - Confirm password validation
  - Terms & conditions checkbox

## 📱 Frontend Features

### Login Page
- **Real-time validation**: Email format, empty fields
- **Backend integration**: API call dengan fallback ke local auth
- **Error handling**: Specific error messages
- **Success feedback**: Success message sebelum redirect
- **Alert system**: Browser alert + styled HTML alert

### Register Page
- **Password strength**: Real-time strength indicator
- **Email validation**: Format checking
- **Password confirmation**: Match validation
- **Backend integration**: API call dengan fallback ke demo mode
- **Success handling**: Auto-redirect ke login setelah berhasil

## 🔍 Error Messages

### Login Errors
- **Email kosong**: "Email tidak boleh kosong!"
- **Password kosong**: "Password tidak boleh kosong!"
- **Format email salah**: "Format email tidak valid!"
- **Email tidak ditemukan**: "Email tidak ditemukan. Gunakan: superadmin@company.com atau daftar akun baru."
- **Password salah**: "Password salah. Silakan periksa password Anda."

### Register Errors
- **Email sudah ada**: "Email sudah terdaftar"
- **Password lemah**: "Password harus minimal 6 karakter"
- **Password tidak cocok**: "Password dan konfirmasi password tidak cocok!"
- **Terms not accepted**: "Anda harus menyetujui syarat dan ketentuan!"

## 🎯 How to Use

### 1. Login dengan akun existing
```
1. Buka http://localhost:8001/login.html
2. Masukkan: superadmin@company.com / SuperSecure123!
3. Klik "Masuk ke Dashboard"
4. Akan redirect ke dashboard
```

### 2. Registrasi akun baru
```
1. Buka http://localhost:8001/register.html
2. Masukkan email baru (contoh: admin@test.com)
3. Masukkan password kuat (minimal 6 karakter)
4. Konfirmasi password
5. Centang syarat & ketentuan
6. Klik "Daftar Akun Admin"
7. Akan redirect ke login page
```

### 3. Login dengan akun baru
```
1. Setelah registrasi berhasil, akan redirect ke login
2. Masukkan email dan password yang baru didaftarkan
3. Klik "Masuk ke Dashboard"
4. Akan redirect ke dashboard
```

## 🔧 Technical Details

### Backend (Go)
- **In-memory database**: Map[email]password
- **CORS enabled**: Cross-origin requests allowed
- **JSON API**: REST endpoints
- **Error handling**: Proper HTTP status codes

### Frontend (JavaScript)
- **Dual authentication**: Backend API + local fallback
- **Real-time validation**: Client-side validation
- **User feedback**: Alert system yang reliable
- **Session management**: localStorage untuk session

### Security Features
- **Password strength**: Minimum 6 characters
- **Email validation**: Format checking
- **CORS headers**: Proper cross-origin setup
- **Error handling**: Specific error messages

## 🚨 Important Notes

1. **Data persistence**: User data tersimpan di memory, akan hilang saat server restart
2. **Production ready**: Untuk production, ganti dengan database yang persistent
3. **Security**: Implement proper password hashing dan JWT tokens
4. **HTTPS**: Gunakan HTTPS untuk production

## 🎉 Status
✅ **Authentication system working!**
✅ **Registration system working!**
✅ **Error alerts working!**
✅ **Success feedback working!**
✅ **Backend API working!**
