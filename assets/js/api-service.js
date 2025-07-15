/* ========================================
   API Service untuk Backend Integration
   Dashboard Admin E-Commerce
======================================== */

class APIService {
    constructor() {
        // Use configuration from config.js
        this.baseURL = window.BackendConfig?.BACKEND_CONFIG?.API_BASE_URL || 'http://localhost:5000/api';
        this.config = window.BackendConfig?.BACKEND_CONFIG || {};
        this.endpoints = window.BackendConfig?.API_ENDPOINTS || {};
        this.messages = window.BackendConfig?.SUCCESS_MESSAGES || {};
        this.errors = window.BackendConfig?.ERROR_MESSAGES || {};
        
        this.isConnected = false;
        this.init();
    }

    /* ========================================
       INITIALIZATION & HEALTH CHECK
    ======================================== */
    
    async init() {
        // Add delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            await this.healthCheck();
            this.isConnected = true;
            console.log('✅ Backend connection established');
            this.showConnectionStatus(true);
        } catch (error) {
            this.isConnected = false;
            console.error('❌ Backend connection failed:', error.message);
            this.showConnectionStatus(false);
        }
    }

    async checkConnectionStatus() {
        try {
            await this.healthCheck();
            this.isConnected = true;
            this.showConnectionStatus(true);
            return true;
        } catch (error) {
            this.isConnected = false;
            console.error('Backend connection failed:', error.message);
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
    async getProducts() {
        try {
            const response = await fetch(`${this.baseURL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            console.log('📦 Products loaded:', products.length);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            this.showNotification(this.errors.NETWORK_ERROR || 'Error mengambil data produk', 'error');
            return [];
        }
    }

    // GET: Ambil satu produk berdasarkan ID
    async getProduct(productId) {
        try {
            console.log('📡 API call: GET', `${this.baseURL}/products/${productId}`);
            const response = await fetch(`${this.baseURL}/products/${productId}`);
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('❌ Product not found (404)');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const product = await response.json();
            console.log('✅ Product received:', product);
            return product;
        } catch (error) {
            console.error('❌ Error fetching product:', error);
            
            // Check if it's a network error (backend not running)
            if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
                console.error('🔌 Backend seems to be offline');
                this.showNotification('Backend tidak dapat dijangkau. Pastikan server berjalan di localhost:5000', 'error');
            } else {
                this.showNotification('Error mengambil data produk: ' + error.message, 'error');
            }
            return null;
        }
    }

    // POST: Tambah produk baru
    async createProduct(productData) {
        try {
            const response = await fetch(`${this.baseURL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newProduct = await response.json();
            console.log('✅ Product created:', newProduct);
            this.showNotification('Produk berhasil ditambahkan', 'success');
            return newProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            this.showNotification('Error menambahkan produk', 'error');
            return null;
        }
    }

    // PUT: Update produk
    async updateProduct(productId, productData) {
        try {
            const response = await fetch(`${this.baseURL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedProduct = await response.json();
            console.log('✅ Product updated:', updatedProduct);
            this.showNotification('Produk berhasil diperbarui', 'success');
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
            const response = await fetch(`${this.baseURL}/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Product deleted:', result);
            this.showNotification('Produk berhasil dihapus', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Error menghapus produk', 'error');
            return false;
        }
    }

    // POST: Upload gambar
    async uploadImage(formData) {
        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Image uploaded:', result);
            this.showNotification('Gambar berhasil diupload', 'success');
            return result;
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showNotification('Error mengupload gambar', 'error');
            return null;
        }
    }

    /* ========================================
       AUTHENTICATION API METHODS
    ======================================== */

    // POST: Login admin
    async loginAdmin(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login gagal');
            }

            console.log('✅ Login successful');
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: error.message };
        }
    }

    // POST: Register admin
    async registerAdmin(adminData) {
        try {
            // Backend only accepts username and password
            const requestBody = {
                username: adminData.email, // Use email as username
                password: adminData.password
            };

            const response = await fetch(`${this.baseURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                throw new Error(`Server error (HTTP ${response.status}). Pastikan backend berjalan dengan benar.`);
            }

            if (!response.ok) {
                throw new Error(data.error || data.message || `HTTP ${response.status}: Registrasi gagal`);
            }

            console.log('✅ Admin registration successful');
            return { 
                success: true, 
                message: data.message || 'Admin berhasil didaftarkan',
                data: data.data || null
            };
        } catch (error) {
            console.error('❌ Error during admin registration:', error.message);
            
            // Handle different types of errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return { 
                    success: false, 
                    message: 'Tidak dapat terhubung ke server. Pastikan backend berjalan di ' + this.baseURL
                };
            }
            
            return { 
                success: false, 
                message: error.message || 'Gagal mendaftarkan admin. Silakan coba lagi.'
            };
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
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

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
        tbody.innerHTML = products.map((product, index) => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="text-center font-medium">${index + 1}</td>
                <td>
                    <div class="flex items-center">
                        ${product.image_url ? 
                            `<img src="${this.baseURL.replace('/api', '')}${product.image_url}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg mr-3">` :
                            `<div class="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                <i class="fas fa-image text-gray-400"></i>
                            </div>`
                        }
                        <div>
                            <div class="font-medium text-gray-900">${product.name}</div>
                            <div class="text-sm text-gray-500 text-truncate max-w-48">${product.description}</div>
                        </div>
                    </div>
                </td>
                <td class="font-medium text-green-600">${this.formatPrice(product.price)}</td>
                <td>
                    <span class="badge badge-success">Aktif</span>
                </td>
                <td class="text-center">
                    <div class="flex justify-center space-x-2">
                        <button onclick="editProduct('${product._id}')" class="btn btn-sm bg-blue-500 text-white hover:bg-blue-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="confirmDeleteProduct('${product._id}', '${product.name}')" class="btn btn-sm bg-red-500 text-white hover:bg-red-600">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update dashboard stats
        this.updateDashboardStats(products);
    }

    // Update statistik di dashboard
    updateDashboardStats(products) {
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
        apiService.showNotification('ID produk tidak valid', 'error');
        return;
    }
    
    try {
        console.log('📡 Fetching product data from API...');
        const product = await apiService.getProduct(productId);
        
        if (product && product._id) {
            console.log('✅ Product data loaded:', product);
            
            // Populate form dengan data produk
            document.getElementById('product-id').value = product._id || '';
            document.getElementById('product-name').value = product.name || '';
            document.getElementById('product-price').value = product.price || '';
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-image-url').value = product.image_url || '';
            
            // Update modal title
            document.getElementById('modal-title').textContent = 'Edit Produk';
            
            // Show modal
            console.log('🎭 Opening edit modal...');
            showModal('productModal');
        } else {
            console.error('❌ Product not found or invalid data:', product);
            apiService.showNotification('Produk tidak ditemukan atau data tidak valid', 'error');
        }
    } catch (error) {
        console.error('❌ Error in editProduct:', error);
        apiService.showNotification('Error: ' + error.message, 'error');
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
            // Reload table
            await apiService.loadProductsTable();
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
            alert('Produk berhasil disimpan!');
            
            // Close modal and reset form
            hideModal('productModal');
            form.reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-image-url').value = '';
            
            // Reload products table if available
            if (typeof window.apiService !== 'undefined' && window.apiService) {
                console.log('🔄 Reloading products table...');
                try {
                    await window.apiService.loadProductsTable();
                } catch (error) {
                    console.error('Error reloading products:', error);
                }
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

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            console.error('❌ File too large:', file.size);
            if (typeof apiService !== 'undefined') {
                apiService.showNotification('Ukuran file terlalu besar. Maksimal 5MB', 'error');
            } else {
                alert('Ukuran file terlalu besar. Maksimal 5MB');
            }
            return false;
        }

        console.log('✅ File validation passed');
        console.log('📡 Attempting to upload...');

        if (typeof apiService !== 'undefined' && apiService) {
            const formData = new FormData();
            formData.append('image', file);

            const result = await apiService.uploadImage(formData);
            if (result && result.image_url) {
                document.getElementById('product-image-url').value = result.image_url;
                console.log('✅ Image uploaded successfully:', result.image_url);
                apiService.showNotification('Gambar berhasil diupload', 'success');
                return true;
            } else {
                console.error('❌ Upload failed - no image URL returned');
                return false;
            }
        } else {
            console.log('⚠️ API Service not available, using local preview fallback');
            // Fallback for offline mode - create local URL
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.getElementById('product-image-url').value = imageUrl;
                console.log('✅ Local image preview set');
                alert('Gambar berhasil dipilih (mode offline)');
            };
            reader.readAsDataURL(file);
            return true;
        }
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
