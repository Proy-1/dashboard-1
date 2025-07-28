# Dashboard Admin E-Commerce

Dashboard admin untuk mengelola produk e-commerce yang terhubung dengan backend Go.

## 🚀 Fitur Utama

- **Autentikasi Admin**: Login dan register untuk admin
- **Manajemen Produk**: Tambah, edit, hapus produk dengan upload gambar
- **Pengaturan Website**: Kelola nama, deskripsi, dan logo website
- **Manajemen Admin**: Tambah dan hapus admin
- **Statistik Dashboard**: Overview total produk, admin, dan nilai
- **Upload Gambar**: Mendukung upload ke Cloudinary melalui backend

## 🔧 Backend Integration

Dashboard ini terhubung dengan backend Go yang ada di:
https://github.com/Proy-1/back/tree/main/backend

### Endpoint yang Digunakan:
- `GET /api/health` - Health check
- `POST /api/login` - Login admin
- `POST /api/register` - Register admin baru
- `GET /api/products` - Ambil semua produk
- `POST /api/products` - Tambah produk baru
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk
- `GET /api/admins` - Ambil semua admin
- `POST /api/admins` - Tambah admin baru
- `DELETE /api/admins/:id` - Hapus admin
- `GET /api/stats` - Statistik dashboard

## 📋 Persyaratan

1. **Backend Server**: Pastikan backend Go berjalan di `http://localhost:5000`
2. **MongoDB**: Database untuk menyimpan data produk dan admin
3. **Browser Modern**: Mendukung ES6+ dan Fetch API

## 🚀 Cara Menjalankan

### 1. Setup Backend
```bash
# Clone backend repository
git clone https://github.com/Proy-1/back.git
cd back/backend

# Install dependencies
go mod tidy

# Setup environment variables
# Buat file .env dengan konfigurasi MongoDB dan Cloudinary

# Jalankan server
go run main.go
```

### 2. Setup Dashboard
```bash
# Clone dashboard repository
git clone https://github.com/Proy-1/dashboard-1.git
cd dashboard-1

# Buka index.html di browser atau gunakan live server
```

### 3. Akses Dashboard
1. Buka `register.html` untuk membuat akun admin pertama
2. Login melalui `login.html`
3. Akses dashboard di `index.html`

## 📁 Struktur Proyek

```
dashboard-1/
├── index.html          # Dashboard utama
├── login.html          # Halaman login
├── register.html       # Halaman register
├── js/
│   ├── api.js          # Service untuk koneksi API
│   └── dashboard.js    # Logic dashboard utama
└── README.md           # Dokumentasi
```

## 🎨 Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **Tailwind CSS**: Framework CSS untuk styling
- **Vanilla JavaScript**: Logic frontend tanpa framework
- **Font Awesome**: Icon set
- **Fetch API**: HTTP requests ke backend

## 🔐 Autentikasi

Dashboard menggunakan token-based authentication:
- Login menghasilkan token yang disimpan di localStorage
- Token dikirim di header Authorization untuk setiap request
- Auto-redirect ke login jika token tidak valid/expired

## 📱 Responsive Design

Dashboard responsif dan dapat diakses di:
- Desktop (optimal)
- Tablet 
- Mobile (sidebar collapsible)

## 🌐 Integrasi dengan Frontend Website

Produk yang dikelola di dashboard ini akan ditampilkan di website e-commerce yang ada di:
https://github.com/Proy-1/front

## 🛠️ Development

### Menambah Fitur Baru
1. Tambahkan endpoint baru di `js/api.js`
2. Buat UI component di `index.html`
3. Implementasikan logic di `js/dashboard.js`

### Kustomisasi Styling
- Edit kelas Tailwind CSS di HTML
- Atau tambahkan custom CSS di bagian `<style>`

## 🔧 Konfigurasi

### Backend URL
Edit di `js/api.js`:
```javascript
this.baseURL = 'http://localhost:5000/api';
```

### Cloudinary Upload
Konfigurasi di backend `.env`:
```env
CLOUDINARY_URL=cloudinary://...
```

## 📞 Support

Jika mengalami masalah:
1. Pastikan backend berjalan di port 5000
2. Check console browser untuk error
3. Verify koneksi MongoDB
4. Test API endpoints secara manual

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap.
