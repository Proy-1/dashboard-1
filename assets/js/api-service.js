/* ========================================
   API Service untuk Backend Integration
   Dashboard Admin E-Commerce
======================================== */

class APIService {
    // Helper: Ambil token Paseto dari localStorage
    getPasetoToken() {
        return localStorage.getItem('paseto_token');
    }

    // Helper: Hapus token Paseto dari localStorage
    removePasetoToken() {
        localStorage.removeItem('paseto_token');
    }
    constructor() {
        // Use configuration from config.js
        this.baseURL = window.BACKEND_CONFIG?.host || `http://localhost:5000`;
        this.config = window.BACKEND_CONFIG || {};
        this.endpoints = window.API_ENDPOINTS || {};
        
        this.isConnected = false;
        this.initialized = false;
        
        // Add simple cache for products
        this.productsCache = null;
        this.cacheTimestamp = null;
        this.cacheTimeout = 30000; // 30 seconds
        
        // Prevent multiple initialization
        if (window.apiServiceInstance) {
            return window.apiServiceInstance;
        }
        
        window.apiServiceInstance = this;
        this.init();
    }

    /* ========================================
       INITIALIZATION & HEALTH CHECK
    ======================================== */
    
    async init() {
        if (this.initialized) return;
        
        try {
            await this.healthCheck();
            this.isConnected = true;
            console.log('✅ Backend connection established');
            this.showConnectionStatus(true);
        } catch (error) {
            this.isConnected = false;
            console.log('⚠️ Backend connection failed:', error.message);
            this.showConnectionStatus(false);
        }
        
        this.initialized = true;
    }

    async checkConnectionStatus() {
        try {
            await this.healthCheck();
            this.isConnected = true;
            this.showConnectionStatus(true);
            return true;
        } catch (error) {
            this.isConnected = false;
            // Only log error occasionally to avoid console spam
            if (Math.random() < 0.1) { // 10% chance to log
                console.warn('Backend connection check failed (normal for standalone mode):', error.message);
            }
            this.showConnectionStatus(false);
            return false;
        }
    }

    async healthCheck() {
        const url = `${this.baseURL}${this.endpoints.HEALTH || '/health'}`;
        
        try {
            // Use simple fetch with timeout fallback
            const fetchWithTimeout = (url, options, timeout = 5000) => {
                return Promise.race([
                    fetch(url, options),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Request timeout')), timeout)
                    )
                ]);
            };
            
            const response = await fetchWithTimeout(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Health check failed with status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            throw error;
        }
    }

    showConnectionStatus(connected) {
        const statusElement = document.getElementById('backend-status');
        
        if (statusElement) {
            if (connected) {
                statusElement.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i class="fas fa-check-circle mr-1"></i> Backend Connected
                    </span>
                `;
            } else {
                statusElement.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <i class="fas fa-exclamation-circle mr-1"></i> Backend Offline
                    </span>
                `;
            }
        }
    }

    /* ========================================
       PRODUCT API METHODS
    ======================================== */

    // GET: Ambil semua produk
    async getProducts(forceRefresh = false) {
        // Check cache first (unless force refresh is requested)
        if (!forceRefresh && this.productsCache && this.cacheTimestamp) {
            const now = Date.now();
            if (now - this.cacheTimestamp < this.cacheTimeout) {
                console.log('📦 Products loaded from cache:', this.productsCache.length);
                return this.productsCache;
            }
        }
        
        try {
            const token = this.getPasetoToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.PRODUCTS}`, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Handle different response formats from backend
            let products = [];
            if (Array.isArray(data)) {
                products = data;
            } else if (data && Array.isArray(data.products)) {
                products = data.products;
            } else if (data && Array.isArray(data.data)) {
                products = data.data;
            } else {
                console.warn('Unexpected response format:', data);
                products = [];
            }
            
            // Update cache
            this.productsCache = products;
            this.cacheTimestamp = Date.now();
            
            console.log('📦 Products loaded from backend:', products.length);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            this.showNotification(this.errors?.NETWORK_ERROR || 'Error mengambil data produk', 'error');
            
            // Return cached data if available, otherwise empty array
            if (this.productsCache) {
                console.log('📦 Returning cached products due to error');
                return this.productsCache;
            }
            return [];
        }
    }
    
    // Helper: Clear products cache
    clearProductsCache() {
        this.productsCache = null;
        this.cacheTimestamp = null;
        console.log('🗑️ Products cache cleared');
    }

    // GET: Ambil satu produk berdasarkan ID
    async getProduct(productId) {
        try {
            const token = this.getPasetoToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.PRODUCT_BY_ID(productId)}`, { headers });
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product = await response.json();
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            this.showNotification('Error mengambil data produk: ' + error.message, 'error');
            return null;
        }
    }

    // POST: Tambah produk baru
    async createProduct(productData) {
        try {
            const token = this.getPasetoToken();
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.PRODUCTS}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle Golang backend error format
                const errorMessage = result.error || 'Gagal menambahkan produk';
                throw new Error(errorMessage);
            }

            this.showNotification('Produk berhasil ditambahkan', 'success');
            
            // Clear cache after creating product
            this.clearProductsCache();
            
            return result;
        } catch (error) {
            console.error('Error creating product:', error);
            this.showNotification(error.message || 'Error menambahkan produk', 'error');
            return null;
        }
    }

    // PUT: Update produk
    async updateProduct(productId, productData) {
        try {
            const token = this.getPasetoToken();
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.PRODUCT_BY_ID(productId)}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedProduct = await response.json();
            this.showNotification('Produk berhasil diperbarui', 'success');
            
            // Clear cache after updating product
            this.clearProductsCache();
            
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            this.showNotification('Error memperbarui produk', 'error');
            return null;
        }
    }

    // DELETE: Hapus produk
    async deleteProduct(productId) {
        try {
            const token = this.getPasetoToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.PRODUCT_BY_ID(productId)}`, {
                method: 'DELETE',
                headers
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle Golang backend error format
                const errorMessage = result.error || 'Gagal menghapus produk';
                throw new Error(errorMessage);
            }

            this.showNotification(result.message || 'Produk berhasil dihapus', 'success');
            
            // Clear cache after deleting product
            this.clearProductsCache();
            
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification(error.message || 'Error menghapus produk', 'error');
            return false;
        }
    }

    // POST: Upload gambar
    async uploadImage(formData) {
        try {
            const token = this.getPasetoToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.UPLOAD}`, {
                method: 'POST',
                headers,
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle Golang backend error format
                const errorMessage = result.error || 'Upload gagal';
                throw new Error(errorMessage);
            }

            console.log('✅ Image uploaded:', result);
            this.showNotification('Gambar berhasil diupload', 'success');
            return {
                success: true,
                image_url: result.image_url,
                file_size: result.file_size,
                message: 'Upload berhasil'
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showNotification(error.message || 'Error mengupload gambar', 'error');
            return { success: false, message: error.message };
        }
    }

    /* ========================================
       AUTHENTICATION API METHODS
    ======================================== */

    // POST: Login admin
    async loginAdmin(username, password) {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle Golang backend error format
                const errorMessage = data.error || 'Login gagal';
                throw new Error(errorMessage);
            }

            // Simpan token Paseto jika ada
            if (data.token) {
                localStorage.setItem('paseto_token', data.token);
            }

            // Success response from Golang backend
            console.log('✅ Login successful');
            return { 
                success: true, 
                message: data.message || 'Login berhasil',
                admin: data.admin || null 
            };
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: error.message };
        }
    }

    // POST: Register admin
    async registerAdmin(adminData) {
        try {
            const token = this.getPasetoToken();
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.REGISTER}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(adminData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle Golang backend error format
                const errorMessage = data.error || 'Registrasi gagal';
                throw new Error(errorMessage);
            }

            this.showNotification(data.message || 'Registrasi admin berhasil', 'success');
            return {
                success: true,
                admin: {
                    _id: data._id,
                    username: data.username
                },
                message: data.message
            };
        } catch (error) {
            console.error('Error registering admin:', error);
            this.showNotification(error.message || 'Error registrasi admin', 'error');
            return { success: false, message: error.message };
        }
    }

    // ADMIN: GET semua admin
    async getAdmins() {
        try {
            const token = this.getPasetoToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.ADMINS}`, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const admins = await response.json();
            return admins;
        } catch (error) {
            console.error('Error fetching admins:', error);
            this.showNotification('Error mengambil data admin', 'error');
            return [];
        }
    }

    // ADMIN: Tambah admin baru
    async createAdmin(adminData) {
        try {
            const token = this.getPasetoToken();
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.ADMINS}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(adminData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newAdmin = await response.json();
            this.showNotification('Admin berhasil ditambahkan', 'success');
            return newAdmin;
        } catch (error) {
            console.error('Error creating admin:', error);
            this.showNotification('Error menambahkan admin', 'error');
            return null;
        }
    }

    // ADMIN: Hapus admin
    async deleteAdmin(adminId) {
        try {
            const token = this.getPasetoToken();
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${this.baseURL}${this.endpoints.ADMIN_BY_ID(adminId)}`, {
                method: 'DELETE',
                headers
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.showNotification('Admin berhasil dihapus', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting admin:', error);
            this.showNotification('Error menghapus admin', 'error');
            return false;
        }
    }

    /* ========================================
       UTILITY METHODS
    ======================================== */

    // Format harga untuk tampilan
    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    }

    // Format tanggal
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Validasi data produk
    validateProduct(productData) {
        const errors = [];
        
        if (!productData.name || productData.name.trim() === '') {
            errors.push('Nama produk harus diisi');
        }
        
        if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
            errors.push('Harga produk harus berupa angka positif');
        }
        
        if (!productData.description || productData.description.trim() === '') {
            errors.push('Deskripsi produk harus diisi');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Tampilkan notifikasi
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} fixed top-4 right-4 z-50 min-w-64 max-w-sm fade-in`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="fas ${this.getNotificationIcon(type)} mr-2"></i>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Loading state management
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        }
    }

    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    /* ========================================
       DASHBOARD INTEGRATION METHODS
    ======================================== */

    // Load dan tampilkan produk di tabel
    async loadProductsTable() {
        const tbody = document.getElementById('productsTableBody') || document.getElementById('products-table-body');
        if (!tbody) {
            console.warn('Table body not found. Looking for productsTableBody or products-table-body');
            return;
        }

        // Show loading
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p class="mt-2 text-gray-500">Memuat data produk...</p>
                </td>
            </tr>
        `;

        const products = await this.getProducts();
        
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-8">
                        <i class="fas fa-box-open text-4xl text-gray-300 mb-2"></i>
                        <p class="text-gray-500">Belum ada produk</p>
                        <button onclick="showAddProductModal()" class="btn btn-primary btn-sm mt-2">
                            <i class="fas fa-plus mr-1"></i> Tambah Produk Pertama
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        // Render products
        tbody.innerHTML = products.map((product, index) => {
            // Hanya tampilkan gambar jika image_base64 ada, jangan gunakan file lokal
            let imageHTML = '';
            if (product.image_base64 && product.image_base64.trim() !== '') {
                imageHTML = `<img src="${product.image_base64}" alt="${product.name || 'Product'}" class="w-12 h-12 object-cover rounded">`;
            } else {
                imageHTML = `<div class="w-12 h-12 flex items-center justify-center bg-gray-200 rounded border text-gray-500"><i class="fas fa-image"></i></div>`;
            }
            // Escape single quotes in product name for JS string
            const safeName = (product.name || 'Produk').replace(/'/g, "\\'");
            return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="py-3 px-4 text-sm text-center font-medium">${index + 1}</td>
                <td class="py-3 px-4">
                    ${imageHTML}
                </td>
                <td class="py-3 px-4 text-sm font-medium">${product.name || '-'}</td>
                <td class="py-3 px-4 text-sm">${product.category || '-'}</td>
                <td class="py-3 px-4 text-sm font-medium text-green-600">Rp ${product.price ? parseInt(product.price).toLocaleString('id-ID') : '-'}</td>
                <td class="py-3 px-4 text-sm">${product.stock !== undefined ? product.stock : '-'}</td>
                <td class="py-3 px-4">
                    <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Aktif</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <button onclick="editProduct('${product._id || product.id}')" class="text-blue-600 hover:text-blue-800 mr-2" title="Edit Produk">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmDeleteProduct('${product._id || product.id}', '${safeName}')" class="text-red-600 hover:text-red-800" title="Hapus Produk">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');

        // Update dashboard stats
        this.updateDashboardStats(products);
    }

    // Update statistik di dashboard
    async updateDashboardStats(products) {
        // Total produk
        const totalProductsElement = document.getElementById('total-products');
        if (totalProductsElement) {
            totalProductsElement.textContent = products.length;
        }

        // Total revenue (simulasi)
        const totalRevenue = products.reduce((sum, product) => sum + (product.price * Math.floor(Math.random() * 10)), 0);
        const totalRevenueElement = document.getElementById('total-revenue');
        if (totalRevenueElement) {
            totalRevenueElement.textContent = this.formatPrice(totalRevenue);
        }

        // Update grafik jika ada
        this.updateCharts(products);
    }

    // Update charts (placeholder)
    updateCharts(products) {
        // Implementasi chart akan ditambahkan nanti jika diperlukan
        console.log('Charts updated with', products.length, 'products');
    }

    // STATS: Statistik produk & admin
    async getStats() {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.STATS}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const stats = await response.json();
            return stats;
        } catch (error) {
            console.error('Error fetching stats:', error);
            this.showNotification('Error mengambil statistik', 'error');
            return null;
        }
    }

    // STATIC: Ambil gambar upload
    getImageUrl(filename) {
        return `${this.baseURL}${this.endpoints.STATIC_UPLOAD(filename)}`;
    }
}

/* ========================================
   GLOBAL FUNCTIONS FOR UI INTEGRATION
======================================== */

// Function untuk edit produk
async function editProduct(productId) {
    console.log('🔧 Edit product clicked:', productId);
    
    // Validasi input
    if (!productId) {
        console.error('❌ Product ID is required');
        if (typeof apiService !== 'undefined' && apiService.showNotification) {
            apiService.showNotification('ID produk tidak valid', 'error');
        }
        return;
    }
    
    try {
        console.log('📡 Fetching product data from API...');
        const product = await apiService.getProduct(productId);
        
        if (product && (product._id || product.id)) {
            console.log('✅ Product data loaded:', product);
            
            // Populate form dengan data produk
            const productIdField = document.getElementById('product-id');
            const productNameField = document.getElementById('product-name');
            const productPriceField = document.getElementById('product-price');
            const productDescriptionField = document.getElementById('product-description');
            const productImageUrlField = document.getElementById('product-image-url');
            const modalTitle = document.getElementById('modal-title');
            
            if (productIdField) productIdField.value = product._id || product.id || '';
            if (productNameField) productNameField.value = product.name || '';
            if (productPriceField) productPriceField.value = product.price || '';
            if (productDescriptionField) productDescriptionField.value = product.description || '';
            if (productImageUrlField) productImageUrlField.value = product.image_url || '';
            if (modalTitle) modalTitle.textContent = 'Edit Produk';
            
            // Show modal - try multiple ways to ensure it opens
            console.log('🎭 Opening edit modal...');
            if (typeof showModal === 'function') {
                showModal('productModal');
            } else if (typeof window.showModal === 'function') {
                window.showModal('productModal');
            } else {
                // Fallback - manually show modal
                const modal = document.getElementById('productModal');
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            }
        } else {
            console.error('❌ Product not found or invalid data:', product);
            if (typeof apiService !== 'undefined' && apiService.showNotification) {
                apiService.showNotification('Produk tidak ditemukan atau data tidak valid', 'error');
            }
        }
    } catch (error) {
        console.error('❌ Error in editProduct:', error);
        if (typeof apiService !== 'undefined' && apiService.showNotification) {
            apiService.showNotification('Error: ' + error.message, 'error');
        }
    }
}

// Function untuk konfirmasi hapus produk
function confirmDeleteProduct(productId, productName) {
    console.log('🗑️ Delete product clicked:', productId, productName);
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
        deleteProduct(productId);
    }
}

// Function untuk hapus produk
async function deleteProduct(productId) {
    console.log('🗑️ Deleting product:', productId);
    try {
        const success = await apiService.deleteProduct(productId);
        if (success) {
            console.log('✅ Product deleted successfully');
            // Reload table - use multiple methods to ensure refresh
            if (typeof loadDashboardData === 'function') {
                await loadDashboardData();
            } else if (typeof window.loadDashboardData === 'function') {
                await window.loadDashboardData();
            } else if (typeof apiService !== 'undefined' && apiService.loadProductsTable) {
                await apiService.loadProductsTable();
            }
        }
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        apiService.showNotification('Error menghapus produk: ' + error.message, 'error');
    }
}

// Function untuk save produk (create/update)
async function saveProduct() {
    console.log('🚀 saveProduct function called from api-service.js');
    
    try {
        const form = document.getElementById('productForm');
        if (!form) {
            console.error('❌ Form not found');
            alert('Error: Form tidak ditemukan');
            return false;
        }

        console.log('✅ Form found:', form);

        // Get form data
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const description = document.getElementById('product-description').value;
        const imageUrl = document.getElementById('product-image-url').value;
        
        const productData = {
            name: name,
            price: parseFloat(price),
            description: description,
            image_url: imageUrl || ''
        };

        console.log('📦 Product data to save:', productData);

        // Simple validation
        if (!productData.name || !productData.price || !productData.description) {
            const errorMsg = 'Harap isi semua field yang diperlukan (Nama, Harga, Deskripsi)';
            console.error('❌ Validation failed:', errorMsg);
            alert(errorMsg);
            return false;
        }

        console.log('✅ Validation passed');

        const productId = document.getElementById('product-id').value;
        let success = false;

        console.log('🔧 Product ID:', productId);
        console.log('🔧 API Service available:', typeof window.apiService !== 'undefined');

        if (typeof window.apiService !== 'undefined' && window.apiService) {
            try {
                if (productId) {
                    console.log('📝 Updating existing product...');
                    const result = await window.apiService.updateProduct(productId, productData);
                    success = result !== null;
                } else {
                    console.log('➕ Creating new product...');
                    const result = await window.apiService.createProduct(productData);
                    success = result !== null;
                }
            } catch (apiError) {
                console.error('❌ API Error:', apiError);
                success = false;
            }
        } else {
            console.log('⚠️ API Service not available, using localStorage fallback');
            // Fallback for offline mode
            productData.id = Date.now(); // Simple ID generation
            productData._id = productData.id.toString();
            let products = JSON.parse(localStorage.getItem('products') || '[]');
            
            if (productId) {
                // Update existing product
                const index = products.findIndex(p => p._id === productId);
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                } else {
                    products.push(productData);
                }
            } else {
                // Add new product
                products.push(productData);
            }
            
            localStorage.setItem('products', JSON.stringify(products));
            success = true;
        }

        console.log('💾 Save result:', success);

        if (success) {
            console.log('✅ Product saved successfully');
            
            // Show success notification
            if (typeof apiService !== 'undefined' && apiService.showNotification) {
                apiService.showNotification('Produk berhasil disimpan!', 'success');
            } else {
                alert('Produk berhasil disimpan!');
            }
            
            // Close modal and reset form
            if (typeof hideModal === 'function') {
                hideModal('productModal');
            } else if (typeof window.hideModal === 'function') {
                window.hideModal('productModal');
            } else {
                // Fallback - manually hide modal
                const modal = document.getElementById('productModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            }
            
            form.reset();
            const productIdField = document.getElementById('product-id');
            const productImageUrlField = document.getElementById('product-image-url');
            if (productIdField) productIdField.value = '';
            if (productImageUrlField) productImageUrlField.value = '';
            
            // Reload products table - use multiple methods to ensure refresh
            console.log('🔄 Reloading products table...');
            try {
                if (typeof loadDashboardData === 'function') {
                    await loadDashboardData();
                } else if (typeof window.loadDashboardData === 'function') {
                    await window.loadDashboardData();
                } else if (typeof window.apiService !== 'undefined' && window.apiService.loadProductsTable) {
                    await window.apiService.loadProductsTable();
                }
            } catch (error) {
                console.error('Error reloading products:', error);
            }
            return true;
        } else {
            console.error('❌ Failed to save product');
            alert('Gagal menyimpan produk. Silakan coba lagi.');
            return false;
        }
    } catch (error) {
        console.error('💥 Error saving product:', error);
        alert('Terjadi error: ' + error.message);
        return false;
    }
}

// Function untuk upload gambar
async function uploadProductImage() {
    console.log('🚀 uploadProductImage function called from api-service.js');
    
    try {
        const fileInput = document.getElementById('product-image');
        if (!fileInput) {
            console.error('❌ File input not found');
            alert('File input tidak ditemukan');
            return false;
        }

        const file = fileInput.files[0];
        
        if (!file) {
            console.error('❌ No file selected');
            if (typeof apiService !== 'undefined') {
                apiService.showNotification('Pilih file gambar terlebih dahulu', 'warning');
            } else {
                alert('Pilih file gambar terlebih dahulu');
            }
            return false;
        }

        console.log('📁 File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            console.error('❌ Invalid file type:', file.type);
            if (typeof apiService !== 'undefined') {
                apiService.showNotification('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP', 'error');
            } else {
                alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP');
            }
            return false;
        }

        // Validate file size (10MB - sesuai backend Go)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            console.error('❌ File too large:', file.size);
            if (typeof apiService !== 'undefined') {
                apiService.showNotification('Ukuran file terlalu besar. Maksimal 10MB', 'error');
            } else {
                alert('Ukuran file terlalu besar. Maksimal 10MB');
            }
            return false;
        }

        console.log('✅ File validation passed');
        console.log('📡 Attempting to upload...');

        // Selalu gunakan FileReader untuk base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            document.getElementById('product-image-url').value = '';
            document.getElementById('product-image-base64').value = base64;
            // Tampilkan preview
            const previewImg = document.getElementById('product-image-preview');
            if (previewImg) previewImg.src = base64;
            // Notifikasi
            if (typeof apiService !== 'undefined' && apiService.showNotification) {
                apiService.showNotification('Gambar produk siap disimpan!', 'success');
            }
        };
        reader.readAsDataURL(file);
        return true;
    } catch (error) {
        console.error('💥 Error uploading image:', error);
        if (typeof apiService !== 'undefined') {
            apiService.showNotification('Error mengupload gambar: ' + error.message, 'error');
        } else {
            alert('Error mengupload gambar: ' + error.message);
        }
        return false;
    }
}

// showModal dan hideModal sudah didefinisikan di admin-script-tailwind.js
// Tidak perlu duplikasi di sini

// Create global instance of APIService immediately
let apiService;

// Initialize APIService as soon as script loads
(function() {
    try {
        apiService = new APIService();
        window.apiService = apiService;
        console.log('✅ APIService initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing APIService:', error);
    }
})();

// Auto-load products when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add delay to ensure everything is loaded
    setTimeout(() => {
        // Load products table if we're on the products page
        if (document.getElementById('products-table-body') && window.apiService) {
            window.apiService.loadProductsTable();
        }
    }, 1000);
});

// Export functions to window object for global access
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.confirmDeleteProduct = confirmDeleteProduct;
window.saveProductFromAPI = saveProduct;
window.uploadProductImageFromAPI = uploadProductImage;
