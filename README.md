# Dashboard Admin E-Commerce

Dashboard admin sederhana untuk mengelola toko online dengan backend integration.

## Setup Backend (Diperlukan untuk fitur lengkap)

**Pastikan backend sudah berjalan di `http://localhost:5000`**

### Manual Setup (Jika backend belum tersedia)
1. Clone backend repository:
   ```bash
   git clone https://github.com/Proy-1/back.git
   cd back/backend
   ```

2. Install dependencies:
   ```bash
   pip install flask flask-cors pymongo python-dotenv werkzeug
   ```

3. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/pitipaw
   ```

4. Run backend:
   ```bash
   python app.py
   ```

Backend akan berjalan di: `http://localhost:5000`

## Cara Menjalankan Dashboard

### Opsi 1: PowerShell (Recommended)
```powershell
.\start-dashboard.ps1
```

### Opsi 2: Command Prompt
```cmd
start-dashboard.bat
```

### Opsi 3: Manual
1. Buka file `index.html` di browser
2. Atau jalankan Python HTTP server:
   ```bash
   python -m http.server 8000
   ```

## Fitur Authentication

### Login Admin
- **File**: `login.html`
- **Demo Credentials**: 
  - Email: `superadmin@company.com`
  - Password: `SuperSecure123!`

### Register Admin
- **File**: `register.html` 
- **Akses**: Klik link "Daftar di sini" di halaman login
- **Fitur**:
  - Registrasi admin baru ke database
  - Password strength indicator
  - Validasi form lengkap
  - Integrasi dengan backend

## Fitur CRUD Produk

### Manajemen Produk
- ✅ **Create**: Tambah produk baru
- ✅ **Read**: Lihat daftar produk
- ✅ **Update**: Edit produk existing
- ✅ **Delete**: Hapus produk
- ✅ **Upload**: Upload gambar produk

### Backend Integration
- `GET /api/products` - Ambil semua produk
- `POST /api/products` - Tambah produk baru
- `GET /api/products/{id}` - Ambil satu produk
- `PUT /api/products/{id}` - Update produk
- `DELETE /api/products/{id}` - Hapus produk
- `POST /api/upload` - Upload gambar

## Mode Operasi

### 1. Dengan Backend (Production Mode)
- Semua data tersimpan di MongoDB
- CRUD operations ke database
- Authentication real
- File upload working

### 2. Tanpa Backend (Demo Mode)
- Data static/demo
- Operations simulasi
- Demo authentication
- Limited functionality

## Cara Mengubah Kredensial Login

### Frontend (Mode Demo)
Edit file `login.html` pada bagian:
```javascript
// Fallback authentication
if (email === 'superadmin@company.com' && password === 'SuperSecure123!') {
```

### Backend (Mode Production)
Gunakan halaman register atau API endpoint untuk mengelola admin.

## Troubleshooting

### Backend Connection Issues
1. Pastikan backend berjalan di `http://localhost:5000`
2. Check MongoDB connection
3. Verify CORS settings
4. Test dengan `http://localhost:5000/api/health`

### CRUD Not Working
1. Pastikan backend repository sudah di-setup
2. Check browser console untuk errors
3. Verify API endpoints di Network tab
4. Ensure MongoDB service running

## File Structure
```
dashboard/
├── index.html              # Dashboard utama
├── login.html              # Halaman login
├── register.html           # Halaman register admin
├── assets/
│   ├── js/
│   │   ├── config.js          # Konfigurasi backend
│   │   └── api-service.js     # Service API backend
│   └── css/                # Style files
├── start-dashboard.ps1     # Run dashboard (PowerShell)
├── start-dashboard.bat     # Run dashboard (CMD)
└── README.md              # Dokumentasi
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create product |
| GET | `/api/products/{id}` | Get single product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| POST | `/api/register` | Register admin |
| POST | `/api/login` | Login admin |
| POST | `/api/upload` | Upload image |
| GET | `/api/stats` | Get statistics |

## Requirements

### Frontend
- Modern web browser
- Python 3.x (untuk HTTP server, opsional)

### Backend
- Python 3.7+
- MongoDB (local atau Atlas)
- Dependencies: flask, flask-cors, pymongo, python-dotenv, werkzeug

## Support

Jika mengalami masalah:
1. Check browser console untuk errors
2. Verify backend status di `http://localhost:5000/api/health`
3. Ensure MongoDB service running
4. Check CORS configuration jika ada cross-origin issues

---

## Cara Penggunaan Tailwind CSS di Repo Ini

- Tailwind digunakan langsung dari CDN, sehingga Anda tidak perlu install atau build Tailwind secara manual.
- Lihat di bagian `<head>` pada file HTML:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```
- Anda bisa langsung menggunakan class Tailwind di HTML, misal:
  ```html
  <div class="bg-primary-500 text-white p-4 rounded-lg">Contoh Tailwind</div>
  ```
- Untuk custom warna dan font, konfigurasi dilakukan inline di HTML:
  ```html
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { primary: { ... } },
          fontFamily: { 'nunito': ['Nunito', 'sans-serif'] }
        }
      }
    }
  </script>
  ```
- Tidak perlu proses build, cukup edit HTML dan refresh browser.

## Cara Menghubungkan Dashboard dengan Backend

1. **Pastikan backend sudah berjalan** di `http://localhost:5000` (lihat instruksi setup di atas).
2. **Konfigurasi endpoint backend** ada di file `assets/js/config.js`:
   - Default: `BASE_URL: 'http://localhost:5000'`
   - Jika backend berjalan di port/host lain, ubah di file tersebut.
3. **Frontend akan otomatis terhubung** ke backend jika API backend aktif dan endpoint sesuai.
4. **Login, register, CRUD produk, dan upload gambar** akan menggunakan API backend sesuai repo [Proy-1/back](https://github.com/Proy-1/back).
5. **Troubleshooting:**
   - Jika data tidak muncul, cek koneksi backend dan endpoint di browser console.
   - Pastikan CORS backend mengizinkan akses dari frontend (lihat pengaturan CORS di backend).
   - Untuk demo, gunakan kredensial yang tertera di halaman login.

## FAQ

- **Apakah perlu install Tailwind secara lokal?**
  - Tidak, cukup gunakan CDN seperti di HTML.
- **Bagaimana jika ingin custom Tailwind lebih lanjut?**
  - Bisa build sendiri dengan Tailwind CLI, tapi untuk dashboard ini cukup CDN.
- **Bagaimana jika backend berjalan di port lain?**
  - Ubah `BASE_URL` di `assets/js/config.js`.
- **Bagaimana cara cek koneksi backend?**
  - Buka browser console, refresh dashboard, cek status API di Network tab.

---