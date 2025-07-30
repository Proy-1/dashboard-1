// API Service untuk Dashboard E-Commerce
// Menggunakan backend: https://github.com/Proy-1/back/tree/main/backend

class APIService {
    constructor() {
        this.baseURL = 'https://rifa.alwaysdata.net/api';
        this.token = localStorage.getItem('admin_token');
        this.isConnected = false;
        
        // Test connection on initialization
        this.checkConnection();
    }

    // Check backend connection
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            if (response.ok) {
                const data = await response.json();
                this.isConnected = data.status === 'ok';
                this.showConnectionStatus(this.isConnected);
                return this.isConnected;
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.isConnected = false;
            this.showConnectionStatus(false);
        }
        return false;
    }

    // Show connection status in UI
    showConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            if (connected) {
                statusElement.innerHTML = `
                    <i class="fas fa-circle text-green-500 mr-1"></i>
                    Connected
                `;
                statusElement.className = 'px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            } else {
                statusElement.innerHTML = `
                    <i class="fas fa-circle text-red-500 mr-1"></i>
                    Disconnected
                `;
                statusElement.className = 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
            }
        }
    }

    // Get headers with authorization
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Handle fetch with error handling
    async fetch(url, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.error || `HTTP ${response.status}`;
                
                // Handle specific errors
                if (response.status === 500 && errorMessage.includes('cloudinary')) {
                    errorMessage = 'Gagal upload gambar ke Cloudinary. Periksa konfigurasi atau coba gambar lain.';
                } else if (response.status === 413) {
                    errorMessage = 'File terlalu besar. Maksimal 5MB.';
                } else if (response.status === 400 && errorMessage.includes('image')) {
                    errorMessage = 'Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.';
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ========================================
    // AUTHENTICATION METHODS
    // ========================================

    async login(username, password) {
        const data = await this.fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_data', JSON.stringify(data.admin));
        }
        
        return data;
    }

    async register(username, email, password) {
        return await this.fetch('/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
    }

    logout() {
        this.token = null;
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        return !!this.token;
    }

    getCurrentAdmin() {
        const adminData = localStorage.getItem('admin_data');
        return adminData ? JSON.parse(adminData) : null;
    }

    // ========================================
    // PRODUCTS METHODS
    // ========================================

    async getProducts() {
        return await this.fetch('/products');
    }

    async getProduct(id) {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new Error('Product ID is required');
        }
        
        try {
            const response = await this.fetch(`/products/${id}`);
            if (!response || !response.product) {
                throw new Error('Product not found');
            }
            return response;
        } catch (error) {
            console.error(`Failed to get product ${id}:`, error);
            throw error;
        }
    }

    async createProduct(productData) {
        return await this.fetch('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(id, productData) {
        return await this.fetch(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(id) {
        return await this.fetch(`/products/${id}`, {
            method: 'DELETE'
        });
    }

    // ========================================
    // ADMIN METHODS
    // ========================================

    async getAdmins() {
        return await this.fetch('/admins');
    }

    async createAdmin(adminData) {
        return await this.fetch('/admins', {
            method: 'POST',
            body: JSON.stringify(adminData)
        });
    }

    async deleteAdmin(id) {
        return await this.fetch(`/admins/${id}`, {
            method: 'DELETE'
        });
    }

    // ========================================
    // STATISTICS METHODS
    // ========================================

    async getStats() {
        return await this.fetch('/stats');
    }

    // ========================================
    // FILE UPLOAD METHODS
    // ========================================

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }

    // Convert file to base64 for Cloudinary upload
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            // Resize image if too large
            if (file.size > 1024 * 1024) { // 1MB
                this.compressImage(file).then(compressedFile => {
                    const reader = new FileReader();
                    reader.readAsDataURL(compressedFile);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                }).catch(error => {
                    // Fallback to original file if compression fails
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            }
        });
    }

    // Compress image to reduce file size
    async compressImage(file, maxWidth = 600, quality = 0.7) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, file.type, quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const icon = document.getElementById('notificationIcon');
        const messageEl = document.getElementById('notificationMessage');
        
        if (!notification) return;

        // Set icon and color based on type
        const icons = {
            success: '<i class="fas fa-check-circle text-green-500"></i>',
            error: '<i class="fas fa-exclamation-circle text-red-500"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-500"></i>',
            info: '<i class="fas fa-info-circle text-blue-500"></i>'
        };

        const colors = {
            success: 'border-green-400',
            error: 'border-red-400',
            warning: 'border-yellow-400',
            info: 'border-blue-400'
        };

        icon.innerHTML = icons[type] || icons.info;
        messageEl.textContent = message;
        notification.className = `fixed top-20 right-4 z-50 ${colors[type] || colors.info}`;
        notification.classList.remove('hidden');

        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }

    // ========================================
    // WEBSITE SETTINGS METHODS
    // ========================================

    // Get website settings (using localStorage for now)
    getWebsiteSettings() {
        const settings = localStorage.getItem('website_settings');
        return settings ? JSON.parse(settings) : {
            name: 'E-Commerce Store',
            description: 'Toko online terpercaya dengan berbagai produk berkualitas',
            logo: null
        };
    }

    // Save website settings
    saveWebsiteSettings(settings) {
        localStorage.setItem('website_settings', JSON.stringify(settings));
        return Promise.resolve(settings);
    }
}

// Create global API instance
window.api = new APIService();
