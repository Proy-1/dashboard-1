# 🛍️ E-Commerce Dashboard Admin

> Dashboard administrasi e-commerce yang lengkap dengan sistem authentication, manajemen produk, pesanan, dan pelanggan.

## 🚀 Features

- **Authentication System**: Login dan registrasi dengan validation
- **Product Management**: CRUD produk dengan upload gambar
- **Order Management**: Kelola pesanan dan status
- **Customer Management**: Manajemen data pelanggan
- **Dashboard Analytics**: Statistik dan grafik
- **Responsive Design**: Mobile-friendly interface
- **Backend API**: Go server dengan REST API

## 📋 Quick Start

### 1. Instalasi & Setup
```bash
# Clone repository
git clone https://github.com/username/dashboard-1.git
cd dashboard-1

# Install Go dependencies (jika ada)
go mod tidy

# Start server
go run server.go
```

### 2. Akses Dashboard
```
🌐 Dashboard: http://localhost:8001
🔐 Login: http://localhost:8001/login.html
📝 Register: http://localhost:8001/register.html
🧪 API Test: http://localhost:8001/api-test.html
```

### 3. Default Credentials
```
Email: superadmin@company.com
Password: SuperSecure123!
```

## 🛠️ Tech Stack

### Backend
- **Go**: HTTP server dengan routing
- **In-memory Database**: Untuk demo (easily upgradeable)
- **REST API**: JSON endpoints
- **CORS**: Cross-origin support

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling + Tailwind utility
- **JavaScript**: Vanilla JS, no frameworks
- **Font Awesome**: Icons
- **Google Fonts**: Nunito typography

## 📁 Project Structure

```
dashboard-1/
├── 📄 server.go                 # Backend Go server
├── 📄 index.html                # Dashboard utama
├── 📄 login.html                # Halaman login
├── 📄 register.html             # Halaman registrasi
├── 📄 api-test.html             # Testing API endpoints
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── dashboard.css        # Dashboard styles
│   │   ├── login.css            # Login/register styles
│   │   └── tailwind-local.css   # Tailwind utilities
│   └── 📁 js/
│       ├── config.js            # Backend configuration
│       ├── api-service.js       # API service layer
│       └── admin-script-tailwind.js # Dashboard logic
└── 📁 docs/
    ├── AUTHENTICATION.md        # Auth system docs
    └── QUICK_START.md          # Quick start guide
```

## 🔐 Authentication System

### Login Flow
1. User masuk email/password
2. Validasi di backend API
3. Jika valid, set session & redirect
4. Jika invalid, tampilkan error specific

### Registration Flow
1. User isi form registrasi
2. Validasi password strength
3. Kirim ke backend API
4. Jika berhasil, redirect ke login
5. Jika gagal, tampilkan error

### Error Handling
- **Email kosong**: "Email tidak boleh kosong!"
- **Password kosong**: "Password tidak boleh kosong!"
- **Format email salah**: "Format email tidak valid!"
- **Email sudah ada**: "Email sudah terdaftar"
- **Password lemah**: "Password harus minimal 6 karakter"

## 📊 API Endpoints

### Authentication
```
POST /api/login      # Login user
POST /api/register   # Register new user
GET  /api/users      # Get all users
```

### Products
```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product by ID
POST   /api/products           # Create new product
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product
```

### Orders
```
GET    /api/orders             # Get all orders
GET    /api/orders/:id         # Get order by ID
PUT    /api/orders/:id         # Update order status
```

### Customers
```
GET    /api/customers          # Get all customers
GET    /api/customers/:id      # Get customer by ID
PUT    /api/customers/:id      # Update customer
```

## 🧪 Testing

### Built-in Testing Tools
- **Dashboard Panel**: Testing buttons di main dashboard
- **API Test Page**: Direct endpoint testing
- **Form Test Buttons**: Auto-fill untuk rapid testing

### Manual Testing
```bash
# Test registration
curl -X POST http://localhost:8001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test login
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Get users
curl http://localhost:8001/api/users
```

## 🎨 UI/UX Features

### Dashboard
- **Responsive sidebar**: Collapsible navigation
- **Stats cards**: Real-time statistics
- **Charts**: Visual analytics
- **Data tables**: Sortable, filterable

### Forms
- **Real-time validation**: Immediate feedback
- **Password strength**: Visual indicator
- **Auto-complete**: User-friendly forms
- **Error handling**: Clear error messages

### Notifications
- **Toast alerts**: Success/error messages
- **Loading states**: User feedback
- **Confirm dialogs**: Destructive actions

## 🔧 Configuration

### Backend Configuration
```javascript
// assets/js/config.js
const BACKEND_CONFIG = {
    host: 'http://localhost:8001',
    api: 'http://localhost:8001/api',
    timeout: 5000,
    retryAttempts: 3
};
```

### Environment Variables
```bash
# Server configuration
PORT=8001
DB_URL=memory://  # In-memory for demo
DEBUG=true
```

## 📚 Documentation

- **[AUTHENTICATION.md](AUTHENTICATION.md)**: Complete auth system guide
- **[QUICK_START.md](QUICK_START.md)**: Step-by-step setup guide
- **[API Reference](api-test.html)**: Interactive API testing

## 🚀 Production Deployment

### Database Upgrade
```go
// Replace in-memory with persistent database
// Example: PostgreSQL, MySQL, MongoDB
var db *sql.DB // or your preferred database
```

### Security Enhancements
- **Password hashing**: bcrypt implementation
- **JWT tokens**: Replace session-based auth
- **HTTPS**: SSL/TLS encryption
- **Rate limiting**: API protection
- **Input validation**: Server-side validation

### Performance Optimizations
- **Database indexing**: Query optimization
- **Caching**: Redis/Memcached
- **CDN**: Static asset delivery
- **Gzip compression**: Response compression

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Go**: Excellent HTTP server capabilities
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Typography

---

**Made with ❤️ for e-commerce businesses**
