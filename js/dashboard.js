// Dashboard Main Script
// Menggunakan API Service untuk koneksi ke backend

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
    
    // Load initial data
    loadDashboardData();
    
    // Set up event listeners
    setupEventListeners();
});

// ========================================
// INITIALIZATION
// ========================================

function initializeDashboard() {
    // Set admin name
    const admin = api.getCurrentAdmin();
    if (admin) {
        document.getElementById('adminName').textContent = admin.username;
    }

    // Show dashboard section by default
    showSection('dashboard');
    
    // Set active sidebar link
    document.querySelector('[data-section="dashboard"]').classList.add('bg-gray-700', 'text-white');
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            setActiveSidebarLink(this);
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            api.logout();
        }
    });
    
    // Product management
    document.getElementById('addProductBtn').addEventListener('click', openProductModal);
    document.getElementById('cleanupBtn').addEventListener('click', cleanupEmptyProducts);
    document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
    document.getElementById('cancelProductBtn').addEventListener('click', closeProductModal);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    
    // Admin management
    document.getElementById('addAdminBtn').addEventListener('click', openAdminModal);
    document.getElementById('closeAdminModal').addEventListener('click', closeAdminModal);
    document.getElementById('cancelAdminBtn').addEventListener('click', closeAdminModal);
    document.getElementById('adminForm').addEventListener('submit', handleAdminSubmit);
    
    // Website settings
    document.getElementById('websiteForm').addEventListener('submit', handleWebsiteSubmit);
    
    // Modal background clicks
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) closeProductModal();
    });
    
    document.getElementById('adminModal').addEventListener('click', function(e) {
        if (e.target === this) closeAdminModal();
    });
}

// ========================================
// NAVIGATION
// ========================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-active');
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadStats();
            break;
        case 'products':
            loadProducts();
            break;
        case 'website':
            loadWebsiteSettings();
            break;
        case 'admins':
            loadAdmins();
            break;
    }
}

function setActiveSidebarLink(activeLink) {
    // Remove active class from all links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('bg-gray-700', 'text-white');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('bg-gray-700', 'text-white');
}

// ========================================
// DATA LOADING
// ========================================

async function loadDashboardData() {
    await loadStats();
}

async function loadStats() {
    try {
        const response = await api.getStats();
        const stats = response.stats;
        
        document.getElementById('totalProducts').textContent = stats.total_products || 0;
        document.getElementById('totalAdmins').textContent = stats.total_admins || 0;
        document.getElementById('totalValue').textContent = api.formatCurrency(stats.total_value || 0);
    } catch (error) {
        console.error('Error loading stats:', error);
        api.showNotification('Gagal memuat statistik', 'error');
    }
}

async function loadProducts() {
    try {
        const response = await api.getProducts();
        const products = response.products || [];
        
        renderProductsTable(products);
    } catch (error) {
        console.error('Error loading products:', error);
        api.showNotification('Gagal memuat produk', 'error');
    }
}

async function loadAdmins() {
    try {
        const response = await api.getAdmins();
        const admins = response.admins || [];
        
        renderAdminsTable(admins);
    } catch (error) {
        console.error('Error loading admins:', error);
        api.showNotification('Gagal memuat admin', 'error');
    }
}

function loadWebsiteSettings() {
    const settings = api.getWebsiteSettings();
    
    document.getElementById('websiteName').value = settings.name || '';
    document.getElementById('websiteDescription').value = settings.description || '';
}

// ========================================
// PRODUCTS MANAGEMENT
// ========================================

function renderProductsTable(products) {
    const tbody = document.getElementById('productsTable');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    Belum ada produk
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        // Prioritas: image_url (Cloudinary URL) untuk display
        const imageUrl = product.image_url;
        const productName = product.name || 'Produk Tanpa Nama';
        const productCategory = product.category || 'Tanpa Kategori';
        const productPrice = product.price || 0;
        const productStock = product.stock || 0;
        
        return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                ${imageUrl ? 
                    `<img src="${imageUrl}" alt="${productName}" class="w-12 h-12 object-cover rounded-md">` :
                    `<div class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                    </div>`
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${productName}</div>
                <div class="text-sm text-gray-500">${productCategory}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${api.formatCurrency(productPrice)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${productStock}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editProduct('${product.id}')" class="text-blue-600 hover:text-blue-900 mr-3" data-product-id="${product.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-900" data-product-id="${product.id}">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');
    
    // Force reset form - clear semua field
    form.reset();
    
    // Explicitly clear each field to prevent browser auto-fill
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productImage').value = '';
    
    // Hide image preview
    document.getElementById('currentImagePreview').classList.add('hidden');
    
    if (productId) {
        title.textContent = 'Edit Produk';
        // Wait a bit to ensure form is cleared first
        setTimeout(() => {
            loadProductData(productId);
        }, 100);
    } else {
        title.textContent = 'Tambah Produk';
    }
    
    modal.classList.add('modal-active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('modal-active');
}

async function loadProductData(productId) {
    try {
        const response = await api.getProduct(productId);
        const product = response.product;
        
        // Isi form dengan data produk
        document.getElementById('productId').value = product.id || '';
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productPrice').value = product.price || 0;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productCategory').value = product.category || '';
        
        // Show current image - gunakan image_url dari Cloudinary
        const imageUrl = product.image_url;
        if (imageUrl && imageUrl.trim() !== '' && imageUrl !== 'undefined' && imageUrl !== 'null') {
            document.getElementById('currentImage').src = imageUrl;
            document.getElementById('currentImagePreview').classList.remove('hidden');
        } else {
            document.getElementById('currentImagePreview').classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading product:', error);
        
        // Reset form jika terjadi error
        document.getElementById('productForm').reset();
        document.getElementById('currentImagePreview').classList.add('hidden');
        
        api.showNotification(`Gagal memuat data produk: ${error.message}`, 'error');
    }
}

async function cleanupEmptyProducts() {
    try {
        if (!confirm('Apakah Anda yakin ingin menghapus semua produk kosong (tanpa nama)?')) {
            return;
        }

        // Get all products
        const response = await api.getProducts();
        const products = response.products || [];
        
        // Find empty products (no name or empty name)
        const emptyProducts = products.filter(product => 
            !product.name || product.name.trim() === '' || product.name.trim() === 'undefined'
        );
        
        if (emptyProducts.length === 0) {
            api.showNotification('Tidak ada produk kosong yang ditemukan', 'info');
            return;
        }
        
        // Delete empty products
        let deletedCount = 0;
        for (const product of emptyProducts) {
            try {
                await api.deleteProduct(product.id);
                deletedCount++;
            } catch (error) {
                console.error('Error deleting product:', product.id, error);
            }
        }
        
        if (deletedCount > 0) {
            api.showNotification(`Berhasil menghapus ${deletedCount} produk kosong`, 'success');
            loadProducts(); // Reload the products table
        } else {
            api.showNotification('Gagal menghapus produk kosong', 'error');
        }
        
    } catch (error) {
        console.error('Error cleaning up products:', error);
        api.showNotification('Terjadi kesalahan saat membersihkan produk', 'error');
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const saveBtn = document.getElementById('saveProductBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const loading = saveBtn.querySelector('.loading');
    
    // Show loading
    btnText.textContent = 'Menyimpan...';
    loading.classList.remove('hidden');
    saveBtn.disabled = true;
    
    try {
        // Format data sesuai dengan backend requirements
        const productData = {
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            stock: parseInt(formData.get('stock')),
            category: formData.get('category')
        };
        
        // Handle image upload - kirim sebagai image_base64 untuk backend processing
        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            // Validasi ukuran file (max 2MB untuk menghindari timeout)
            if (imageFile.size > 2 * 1024 * 1024) {
                throw new Error('Ukuran file terlalu besar. Maksimal 2MB.');
            }
            
            // Validasi tipe file
            if (!imageFile.type.startsWith('image/')) {
                throw new Error('File harus berupa gambar.');
            }
            
            try {
                const imageBase64 = await api.fileToBase64(imageFile);
                // Pastikan format base64 benar
                if (imageBase64 && imageBase64.startsWith('data:image/')) {
                    productData.image_base64 = imageBase64;
                } else {
                    throw new Error('Format gambar tidak valid.');
                }
            } catch (error) {
                throw new Error('Gagal memproses gambar: ' + error.message);
            }
        }
        
        const productId = document.getElementById('productId').value;
        
        if (productId) {
            // Update existing product
            try {
                await api.updateProduct(productId, productData);
                api.showNotification('Produk berhasil diperbarui', 'success');
            } catch (error) {
                // Jika error karena gambar, coba simpan tanpa gambar
                if (error.message.includes('Cloudinary') || error.message.includes('image')) {
                    delete productData.image_base64;
                    await api.updateProduct(productId, productData);
                    api.showNotification('Produk diperbarui tanpa gambar (error upload foto)', 'warning');
                } else {
                    throw error;
                }
            }
        } else {
            // Create new product
            try {
                await api.createProduct(productData);
                api.showNotification('Produk berhasil ditambahkan', 'success');
            } catch (error) {
                // Jika error karena gambar, coba simpan tanpa gambar
                if (error.message.includes('Cloudinary') || error.message.includes('image')) {
                    delete productData.image_base64;
                    await api.createProduct(productData);
                    api.showNotification('Produk ditambahkan tanpa gambar (error upload foto)', 'warning');
                } else {
                    throw error;
                }
            }
        }
        
        closeProductModal();
        loadProducts();
        loadStats(); // Refresh stats
        
    } catch (error) {
        console.error('Error saving product:', error);
        
        // Berikan pesan error yang lebih spesifik
        let errorMessage = 'Gagal menyimpan produk';
        
        if (error.message.includes('Cloudinary')) {
            errorMessage = 'Gagal upload gambar. Periksa koneksi internet atau coba gambar lain.';
        } else if (error.message.includes('ukuran')) {
            errorMessage = error.message;
        } else if (error.message.includes('Format')) {
            errorMessage = error.message;
        } else if (error.message.includes('500')) {
            errorMessage = 'Server error. Periksa konfigurasi backend.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        api.showNotification(errorMessage, 'error');
    } finally {
        // Hide loading
        btnText.textContent = 'Simpan';
        loading.classList.add('hidden');
        saveBtn.disabled = false;
    }
}

async function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        return;
    }
    
    try {
        await api.deleteProduct(productId);
        api.showNotification('Produk berhasil dihapus', 'success');
        loadProducts();
        loadStats(); // Refresh stats
    } catch (error) {
        console.error('Error deleting product:', error);
        api.showNotification(error.message || 'Gagal menghapus produk', 'error');
    }
}

// ========================================
// ADMIN MANAGEMENT
// ========================================

function renderAdminsTable(admins) {
    const tbody = document.getElementById('adminsTable');
    
    if (admins.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    Belum ada admin
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = admins.map(admin => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${admin.username}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${admin.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${api.formatDate(admin.created_at)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteAdmin('${admin.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    const form = document.getElementById('adminForm');
    
    // Reset form
    form.reset();
    
    modal.classList.add('modal-active');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('modal-active');
}

async function handleAdminSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const saveBtn = document.getElementById('saveAdminBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const loading = saveBtn.querySelector('.loading');
    
    // Show loading
    btnText.textContent = 'Menyimpan...';
    loading.classList.remove('hidden');
    saveBtn.disabled = true;
    
    try {
        const adminData = {
            username: formData.get('adminUsername'),
            email: formData.get('adminEmail'),
            password: formData.get('adminPassword')
        };
        
        await api.createAdmin(adminData);
        api.showNotification('Admin berhasil ditambahkan', 'success');
        
        closeAdminModal();
        loadAdmins();
        loadStats(); // Refresh stats
        
    } catch (error) {
        console.error('Error saving admin:', error);
        api.showNotification(error.message || 'Gagal menyimpan admin', 'error');
    } finally {
        // Hide loading
        btnText.textContent = 'Simpan';
        loading.classList.add('hidden');
        saveBtn.disabled = false;
    }
}

async function deleteAdmin(adminId) {
    if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
        return;
    }
    
    try {
        await api.deleteAdmin(adminId);
        api.showNotification('Admin berhasil dihapus', 'success');
        loadAdmins();
        loadStats(); // Refresh stats
    } catch (error) {
        console.error('Error deleting admin:', error);
        api.showNotification(error.message || 'Gagal menghapus admin', 'error');
    }
}

// ========================================
// WEBSITE SETTINGS
// ========================================

async function handleWebsiteSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const settings = {
            name: formData.get('websiteName'),
            description: formData.get('websiteDescription')
        };
        
        // Handle logo upload
        const logoFile = document.getElementById('websiteLogo').files[0];
        if (logoFile) {
            settings.logo = await api.fileToBase64(logoFile);
        }
        
        await api.saveWebsiteSettings(settings);
        api.showNotification('Pengaturan website berhasil disimpan', 'success');
        
    } catch (error) {
        console.error('Error saving website settings:', error);
        api.showNotification('Gagal menyimpan pengaturan website', 'error');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Global functions for onclick handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.deleteAdmin = deleteAdmin;
