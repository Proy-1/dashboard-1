// Frontend User - Products API Service
// File: js/products-api.js

class ProductsAPI {
    constructor() {
        // Ganti dengan URL backend yang sesuai
        this.baseURL = 'http://localhost:5000/api';
        // Untuk production: this.baseURL = 'https://your-backend-domain.com/api';
    }

    async fetchProducts() {
        try {
            const response = await fetch(`${this.baseURL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.products || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const response = await fetch(`${this.baseURL}/products/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.product;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    // Format currency untuk display
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
}

// Export untuk digunakan
const productsAPI = new ProductsAPI();
