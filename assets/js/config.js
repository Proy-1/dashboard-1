/* ========================================
   Backend Configuration
   Dashboard Admin E-Commerce
======================================== */

// Detect backend configuration

// Always use backend at http://localhost:5000
function detectBackendConfig() {
    return {
        port: '5000',
        host: `http://localhost:5000`,
        api: `http://localhost:5000/api`
    };
}

// Backend configuration
const BACKEND_CONFIG = {
    ...detectBackendConfig(),
    timeout: 5000,
    retryAttempts: 3,
    retryDelay: 1000
};

// API Endpoints
const API_ENDPOINTS = {
    // Health check
    HEALTH: '/api/health',
    // Products
    PRODUCTS: '/api/products',
    PRODUCT_BY_ID: (id) => `/api/products/${id}`,
    // Orders
    ORDERS: '/api/orders',
    ORDER_BY_ID: (id) => `/api/orders/${id}`,
    // Customers
    CUSTOMERS: '/api/customers',
    CUSTOMER_BY_ID: (id) => `/api/customers/${id}`,
    // Auth
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    // Users
    USERS: '/api/users',
    // Upload
    UPLOAD: '/api/upload',
    // Stats
    STATS: '/api/stats'
};

// HTTP Headers
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Error messages
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
    UNAUTHORIZED: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
    NOT_FOUND: 'Data yang dicari tidak ditemukan.',
    TIMEOUT: 'Permintaan timeout. Silakan coba lagi.'
};

// Success messages
const SUCCESS_MESSAGES = {
    PRODUCT_CREATED: 'Produk berhasil ditambahkan',
    PRODUCT_UPDATED: 'Produk berhasil diperbarui',
    PRODUCT_DELETED: 'Produk berhasil dihapus',
    ORDER_UPDATED: 'Pesanan berhasil diperbarui',
    CUSTOMER_UPDATED: 'Data pelanggan berhasil diperbarui',
    UPLOAD_SUCCESS: 'File berhasil diunggah',
    LOGIN_SUCCESS: 'Login berhasil',
    REGISTER_SUCCESS: 'Registrasi berhasil'
};

// Make configurations globally available
window.BACKEND_CONFIG = BACKEND_CONFIG;
window.API_ENDPOINTS = API_ENDPOINTS;
window.DEFAULT_HEADERS = DEFAULT_HEADERS;
window.ERROR_MESSAGES = ERROR_MESSAGES;
window.SUCCESS_MESSAGES = SUCCESS_MESSAGES;

console.log('📝 Configuration loaded:', BACKEND_CONFIG);
