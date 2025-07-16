/* ========================================
   Backend Configuration
   Dashboard Admin E-Commerce
======================================== */

// Backend configuration
const BACKEND_CONFIG = {
    // Base URL backend - sesuai dengan backend Go
    BASE_URL: 'http://localhost:5000',
    API_BASE_URL: 'http://localhost:5000/api',
    
    // Timeout settings
    REQUEST_TIMEOUT: 30000, // 30 seconds
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    
    // File upload settings
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    
    // Cache settings
    CACHE_ENABLED: true,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Environment detection
const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // Auto-detect backend URL based on environment
    getBackendURL() {
        if (this.isDevelopment) {
            return 'http://localhost:5000';
        } else {
            // Untuk production, sesuaikan dengan URL backend Anda
            return 'https://your-backend-domain.com';
        }
    }
};

// Update backend URL based on environment
BACKEND_CONFIG.BASE_URL = ENVIRONMENT.getBackendURL();
BACKEND_CONFIG.API_BASE_URL = ENVIRONMENT.getBackendURL() + '/api';

// API Endpoints
const API_ENDPOINTS = {
    // Health check
    HEALTH: '/health',
    // Produk
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    // Admin
    ADMINS: '/admins',
    ADMIN_BY_ID: (id) => `/admins/${id}`,
    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    // Upload
    UPLOAD: '/upload',
    // Statistik
    STATS: '/stats',
    // Static file (gambar upload)
    STATIC_UPLOAD: (filename) => `/static/uploads/${filename}`
};

// HTTP Headers
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

// Error messages
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
    UNAUTHORIZED: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
    NOT_FOUND: 'Data yang dicari tidak ditemukan.',
    TIMEOUT: 'Permintaan timeout. Silakan coba lagi.',
    FILE_TOO_LARGE: `Ukuran file terlalu besar. Maksimal ${BACKEND_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB.`,
    INVALID_FILE_TYPE: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau GIF.',
};

// Status messages
const SUCCESS_MESSAGES = {
    PRODUCT_CREATED: 'Produk berhasil ditambahkan',
    PRODUCT_UPDATED: 'Produk berhasil diperbarui',
    PRODUCT_DELETED: 'Produk berhasil dihapus',
    IMAGE_UPLOADED: 'Gambar berhasil diupload',
    DATA_REFRESHED: 'Data berhasil di-refresh',
    CONNECTION_ESTABLISHED: 'Koneksi ke backend berhasil',
};

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BACKEND_CONFIG,
        ENVIRONMENT,
        API_ENDPOINTS,
        DEFAULT_HEADERS,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES
    };
}

// Global configuration for browser
window.BackendConfig = {
    BACKEND_CONFIG,
    ENVIRONMENT,
    API_ENDPOINTS,
    DEFAULT_HEADERS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};

// Debug information
if (ENVIRONMENT.isDevelopment) {
    console.log('🔧 Backend Configuration:', {
        baseURL: BACKEND_CONFIG.BASE_URL,
        apiURL: BACKEND_CONFIG.API_BASE_URL,
        environment: ENVIRONMENT.isDevelopment ? 'Development' : 'Production'
    });
}
