<template>
  <div class="shop-container">
    <!-- Header Section -->
    <section class="shop-header bg-light py-5">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-10">
            <div class="header-icon mb-4">
              <i class="fas fa-hands-helping fa-3x"></i>
            </div>
            <h1 class="display-5 fw-bold text-primary mb-3">🎵 AVC Choir Shop</h1>
            <p class="lead mb-0 mx-auto" style="max-width: 600px;">
              Support our ministry and spread the joy of worship through our official merchandise. 
              Every purchase helps us continue our mission.
            </p>
            <div class="d-flex justify-content-center flex-wrap gap-2">
              <span class="badge bg-primary">Official Merchandise</span>
              <span class="badge bg-success">Quality Guaranteed</span>
              <span class="badge bg-info">Ministry Support</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- Main Shop Section -->
    <section class="container py-5">
      <!-- Cart & User Actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <div class="d-flex gap-2">
          <button 
            v-if="!isAuthenticated" 
            @click="goToLogin" 
            class="btn btn-outline-primary"
          >
            <i class="fas fa-sign-in-alt"></i> Login
          </button>
          <button @click="toggleCart" class="btn btn-outline-primary position-relative">
            <i class="fas fa-shopping-cart"></i> Cart
            <span v-if="cart.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ cartTotalItems }}
            </span>
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Search products by name or description..."
              @input="handleSearch"
            >
          </div>
        </div>
        <div class="col-md-3">
          <select v-model="selectedCategory" class="form-select" @change="fetchProducts">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="sortBy" class="form-select" @change="fetchProducts">
            <option value="">Sort by</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading products from database...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-warning text-center">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Unable to load products</strong>
        <p class="mb-0">Please check your connection and try again.</p>
        <button @click="fetchProducts" class="btn btn-sm btn-warning mt-2">
          <i class="fas fa-redo me-1"></i> Retry
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="row">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-xl-3 col-lg-4 col-md-6 mb-4"
        >
          <div class="card product-card h-100 shadow-sm border-0">
            <div class="card-img-container position-relative">
              <img
                :src="getProductImage(product.image)"
                :alt="product.name"
                class="card-img-top product-image"
                style="height: 200px; object-fit: cover;"
                loading="lazy"
                @error="handleImageError"
              />
              <div v-if="!product.is_in_stock" class="position-absolute top-0 start-0 m-2">
                <span class="badge bg-danger">Out of Stock</span>
              </div>
              <div v-else-if="product.stock < 10" class="position-absolute top-0 start-0 m-2">
                <span class="badge bg-warning text-dark">Low Stock</span>
              </div>
            </div>
            
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold text-dark mb-2">{{ product.name }}</h5>
              <p class="card-text text-muted small flex-grow-1">
                {{ truncateDescription(product.description) }}
              </p>
              
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="h5 text-primary mb-0">UGX {{ formatPrice(product.price) }}</span>
                  <span class="badge bg-secondary">{{ getCategoryName(product.category) }}</span>
                </div>
                
                <div class="stock-info mb-2">
                  <small class="text-muted">
                    <i class="fas fa-box me-1"></i>
                    {{ product.stock }} in stock
                  </small>
                </div>
                
                <button
                  class="btn btn-primary w-100"
                  @click="addToCart(product)"
                  :disabled="!product.is_in_stock || product.stock === 0"
                >
                  <i class="fas fa-cart-plus"></i>
                  {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <div class="empty-state">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">No products found</h4>
          <p class="text-muted mb-3" v-if="searchQuery || selectedCategory">
            Try adjusting your search or filter criteria
          </p>
          <button class="btn btn-outline-primary" @click="clearFilters">
            <i class="fas fa-times me-1"></i> Clear Filters
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="d-flex justify-content-center mt-5">
        <nav aria-label="Products pagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i> Previous
              </button>
            </li>
            
            <li 
              v-for="page in visiblePages" 
              :key="page" 
              class="page-item" 
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">
                Next <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="ms-3 d-flex align-items-center">
          <small class="text-muted">
            Page {{ currentPage }} of {{ totalPages }} ({{ totalProducts }} products)
          </small>
        </div>
      </div>
    </section>

    <!-- Cart Sidebar -->
    <div v-if="showCart" class="cart-overlay" @click="showCart = false"></div>
    <div v-if="showCart" class="cart-sidebar">
      <div class="cart-header">
        <h4>
          <i class="fas fa-shopping-cart me-2"></i>
          Your Cart ({{ cartTotalItems }})
        </h4>
        <button @click="showCart = false" class="btn-close"></button>
      </div>
      
      <div class="cart-body">
        <div v-if="cart.length === 0" class="empty-cart text-center py-4">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <p class="text-muted">Your cart is empty</p>
          <button @click="showCart = false" class="btn btn-outline-primary">
            Continue Shopping
          </button>
        </div>
        
        <div v-else class="cart-items">
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="cart-item-image">
            <div class="cart-item-details">
              <h6>{{ item.name }}</h6>
              <p class="text-primary mb-1">UGX {{ formatPrice(item.price) }}</p>
              <div class="cart-item-controls">
                <div class="quantity-controls">
                  <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity mx-2">{{ item.quantity }}</span>
                  <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.max_stock"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <button @click="removeFromCart(item.id)" class="btn btn-sm btn-outline-danger ms-2">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="cart.length > 0" class="cart-footer">
        <div class="cart-total mb-3 p-3 bg-light rounded">
          <div class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>UGX {{ formatPrice(cartSubtotal) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Shipping:</span>
            <span>UGX {{ formatPrice(shipping) }}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <strong>Total:</strong>
            <strong class="text-primary">UGX {{ formatPrice(cartTotal) }}</strong>
          </div>
        </div>
        
        <button @click="proceedToCheckout" class="btn btn-primary w-100 mb-2">
          <i class="fas fa-lock me-2"></i>
          Proceed to Checkout
        </button>
        <button @click="showCart = false" class="btn btn-outline-secondary w-100">
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService, authHelper } from '@/services/api'

export default {
  name: 'ShopPage',
  data() {
    return {
      products: [],
      categories: [],
      loading: true,
      error: false,
      searchQuery: '',
      selectedCategory: '',
      sortBy: '-created_at',
      cart: [],
      showCart: false,
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      pageSize: 12,
      searchTimeout: null
    }
  },
  computed: {
    isAuthenticated() {
      return authHelper.isAuthenticated()
    },
    cartTotalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0)
    },
    cartSubtotal() {
      return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    shipping() {
      return this.cart.length > 0 ? 5000 : 0
    },
    cartTotal() {
      return this.cartSubtotal + this.shipping
    },
    visiblePages() {
      const pages = []
      const startPage = Math.max(1, this.currentPage - 2)
      const endPage = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      this.error = false
      
      try {
        const params = {
          page: this.currentPage,
          page_size: this.pageSize
        }
        
        // Add filters if specified
        if (this.selectedCategory) {
          params.category = this.selectedCategory
        }
        
        if (this.searchQuery) {
          params.search = this.searchQuery
        }
        
        if (this.sortBy) {
          params.ordering = this.sortBy
        }
        
        console.log('Fetching products with params:', params)
        
        const response = await apiService.shop.getProducts(params)
        console.log('API Response:', response.data)
        
        this.products = response.data.results || response.data
        this.totalProducts = response.data.count || this.products.length
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize) || 1
        
      } catch (err) {
        console.error('Products fetch error:', err)
        this.error = true
        this.products = this.getFallbackProducts()
      } finally {
        this.loading = false
      }
    },
    
    async fetchCategories() {
      try {
        const response = await apiService.shop.getCategories()
        this.categories = response.data.results || response.data
      } catch (err) {
        console.error('Categories fetch error:', err)
        this.categories = this.getFallbackCategories()
      }
    },
    
    getProductImage(imageUrl) {
      if (!imageUrl) {
        return 'https://picsum.photos/300/200?random=99'
      }
      
      if (imageUrl.startsWith('http')) {
        return imageUrl
      }
      
      // Handle Django media files
      if (imageUrl.startsWith('/media/')) {
        return `${process.env.VUE_APP_API_URL || 'http://localhost:8000'}${imageUrl}`
      }
      
      return `${process.env.VUE_APP_API_URL || 'http://localhost:8000'}/media/${imageUrl}`
    },
    
    handleImageError(event) {
      console.log('Image failed to load, using placeholder')
      event.target.src = 'https://picsum.photos/300/200?random=99'
    },
    
    truncateDescription(desc) {
      if (!desc) return 'No description available'
      return desc.length > 100 ? desc.substring(0, 100) + '...' : desc
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-US').format(price)
    },
    
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : 'Uncategorized'
    },
    
    addToCart(product) {
      if (!product.is_in_stock || product.stock === 0) {
        this.showMessage('This product is out of stock')
        return
      }
      
      const existingItem = this.cart.find(item => item.id === product.id)
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          this.showMessage(`Only ${product.stock} items available in stock`)
          return
        }
        existingItem.quantity += 1
      } else {
        this.cart.push({
          ...product,
          quantity: 1,
          max_stock: product.stock
        })
      }
      
      this.showCart = true
      this.showMessage(`${product.name} added to cart!`)
    },
    
    updateQuantity(productId, newQuantity) {
      if (newQuantity < 1) {
        this.removeFromCart(productId)
        return
      }
      
      const item = this.cart.find(item => item.id === productId)
      if (item) {
        if (newQuantity > item.max_stock) {
          this.showMessage(`Only ${item.max_stock} items available`)
          return
        }
        item.quantity = newQuantity
      }
    },
    
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId)
      this.showMessage('Item removed from cart')
    },
    
    toggleCart() {
      this.showCart = !this.showCart
    },
    
    goToLogin() {
      this.$router.push('/auth/login')
    },
    
    proceedToCheckout() {
      if (this.cart.length === 0) {
        this.showMessage('Your cart is empty')
        return
      }
      
      if (!this.isAuthenticated) {
        this.showMessage('Please log in to proceed with checkout')
        this.$router.push('/auth/login')
        return
      }
      
      // For now, show alert. Uncomment when checkout is ready
      alert(`Checkout functionality coming soon!\n\nItems: ${this.cartTotalItems}\nTotal: UGX ${this.formatPrice(this.cartTotal)}`)
      // this.$router.push('/checkout')
    },
    
    handleSearch() {
      // Debounce search to avoid too many API calls
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.fetchProducts()
      }, 500)
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page
        this.fetchProducts()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.sortBy = '-created_at'
      this.currentPage = 1
      this.fetchProducts()
    },
    
    showMessage(message) {
      // Simple alert for now - you can replace with a toast notification
      console.log(message)
    },
    
    getFallbackProducts() {
      // Fallback products if API fails
      return [
        {
          id: 1,
          name: 'Choir T-Shirt',
          price: 25000,
          description: 'Official AVC Choir T-Shirt with logo',
          image: 'https://picsum.photos/300/200?random=1',
          stock: 10,
          is_in_stock: true,
          category: 1
        },
        {
          id: 2,
          name: 'Worship CD',
          price: 15000,
          description: 'Latest worship album from AVC Choir',
          image: 'https://picsum.photos/300/200?random=2',
          stock: 5,
          is_in_stock: true,
          category: 2
        }
      ]
    },
    
    getFallbackCategories() {
      return [
        { id: 1, name: 'Clothing' },
        { id: 2, name: 'Music' },
        { id: 3, name: 'Accessories' }
      ]
    }
  },
  
  mounted() {
    console.log('Shop component mounted - fetching from database')
    this.fetchProducts()
    this.fetchCategories()
    
    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('avc_shop_cart')
      if (savedCart) {
        this.cart = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error)
    }
  },
  
  watch: {
    cart: {
      handler(newCart) {
        try {
          localStorage.setItem('avc_shop_cart', JSON.stringify(newCart))
        } catch (error) {
          console.error('Error saving cart to storage:', error)
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
/* Your existing styles remain the same */
.shop-container {
  min-height: 100vh;
  position: relative;
}

.shop-header { 
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
  padding-top: 80px; 
  text-align: center;
}

.header-icon {
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 1rem;
}

.d-flex.flex-wrap.gap-2 {
  justify-content: center;
}
.product-card { 
  transition: all 0.3s ease;
  cursor: default;
}

.product-card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card-img-container {
  overflow: hidden;
}

.product-image {
  transition: transform 0.3s ease;
  background-color: #f8f9fa;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.btn {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.stock-info {
  font-size: 0.8rem;
}

/* Cart styles remain the same */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  cursor: pointer;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  z-index: 1050;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  background: #f8f9fa;
}

.cart-item-details {
  flex: 1;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

.empty-cart {
  padding: 2rem 1rem;
}

/* Pagination */
.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .shop-header .display-5 { 
    font-size: 2rem; 
  }
  
  .cart-sidebar {
    width: 100vw;
  }
  
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  
  .cart-item-image {
    width: 100%;
    height: 120px;
  }
}
</style>