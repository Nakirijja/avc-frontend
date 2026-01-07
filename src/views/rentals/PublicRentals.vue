<template>
  <div class="rentals-page">
    <!-- Hero Section -->
    <section class="rentals-hero text-white py-5">
      <div class="hero-overlay"></div>
      <div class="container py-5">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4 hero-title">Support Our Choir</h1>
            <p class="lead hero-subtitle">
              Rent our equipment and help fund our musical journey. Every rental supports our choir activities.
            </p>
            
            <!-- Quick Stats -->
            <div class="hero-stats mt-4">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-music"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ totalItems }}</span>
                  <span class="stat-label">Items Available</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-hand-holding-usd"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ affordableItems }}</span>
                  <span class="stat-label">Under UGX 50,000/Day</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ popularCategories }}</span>
                  <span class="stat-label">Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <!-- Search Section -->
      <div class="search-section mb-5">
        <div class="search-card">
          <div class="search-header">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="search"
              @input="debouncedLoadItems"
              type="text"
              class="search-input"
              placeholder="Search instruments, equipment, or categories..."
            />
            <div class="search-stats">
              <span class="badge bg-primary">{{ items.length }}</span>
              <span class="text-muted">items found</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="row g-4">
        <div v-for="item in items" :key="item.id" class="col-xl-3 col-lg-4 col-md-6">
          <div class="rental-card" :class="{ 'out-of-stock': item.available_quantity === 0 }">
            <!-- Stock Badge -->
            <div class="stock-badge" :class="getStockClass(item.available_quantity)">
              {{ getStockText(item.available_quantity) }}
            </div>

            <!-- Item Image Placeholder -->
            <div class="item-image">
              <i class="fas fa-music"></i>
            </div>

            <div class="card-content">
              <h5 class="item-title">{{ item.name }}</h5>
              
              <div class="item-meta">
                <div class="meta-item">
                  <i class="fas fa-tag"></i>
                  <span>{{ item.category_name || "General" }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-box"></i>
                  <span>{{ item.available_quantity }} available</span>
                </div>
              </div>

              <p class="item-description" v-if="item.description">
                {{ truncateDescription(item.description) }}
              </p>

              <div class="pricing">
                <div class="price-main">{{ formatCurrency(item.price_per_day) }}</div>
                <div class="price-label">per day</div>
              </div>

              <button
                class="btn-rent"
                @click="openRentalModal(item)"
                :disabled="item.available_quantity === 0"
              >
                <span v-if="item.available_quantity === 0">Out of Stock</span>
                <span v-else>
                  <i class="fas fa-shopping-cart me-2"></i>
                  Rent Now
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="items.length === 0 && !loading" class="empty-state text-center py-5">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <h4 class="empty-title">No Items Found</h4>
        <p class="empty-text">
          {{ search ? 'Try adjusting your search terms' : 'No rental items available at the moment' }}
        </p>
        <button v-if="search" class="btn btn-outline-primary" @click="clearSearch">
          Clear Search
        </button>
      </div>
    </div>

    <!-- Rental Modal -->
    <div class="modal fade" id="rentalModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rental-modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <h5 class="modal-title">
                <i class="fas fa-shopping-cart me-2"></i>
                Rent: {{ selectedItem?.name }}
              </h5>
              <div class="modal-subtitle">{{ selectedItem?.category_name }}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <div class="modal-body">
            <div class="rental-process">
              <!-- Step 1: Rental Details -->
              <div class="process-step active">
                <div class="step-header">
                  <div class="step-number">1</div>
                  <h6 class="step-title">Rental Details</h6>
                </div>
                
                <div class="step-content">
                  <div class="row g-3">
                    <!-- Guest Info -->
                    <div class="col-md-6">
                      <label class="form-label">
                        <i class="fas fa-user me-2"></i>Your Full Name
                      </label>
                      <input 
                        v-model="rentalForm.guest_name" 
                        type="text" 
                        class="form-control" 
                        placeholder="Enter your name"
                        required 
                      />
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">
                        <i class="fas fa-phone me-2"></i>Phone Number
                      </label>
                      <input 
                        v-model="rentalForm.guest_contact" 
                        type="tel" 
                        class="form-control" 
                        placeholder="e.g., 0751234567"
                        pattern="[0-9]{10}"
                        required 
                      />
                      <small class="text-muted">Enter your 10-digit Uganda phone number</small>
                    </div>

                    <!-- Rental Details -->
                    <div class="col-md-6">
                      <label class="form-label">
                        <i class="fas fa-boxes me-2"></i>Quantity
                        <span class="text-muted">(Max: {{ selectedItem?.available_quantity }})</span>
                      </label>
                      <input
                        v-model.number="rentalForm.quantity"
                        type="number"
                        class="form-control"
                        min="1"
                        :max="selectedItem?.available_quantity"
                        required
                        @input="updateTotalCost"
                      />
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">
                        <i class="fas fa-calendar-day me-2"></i>Rental Days
                      </label>
                      <input
                        v-model.number="rentalForm.days"
                        type="number"
                        class="form-control"
                        min="1"
                        max="30"
                        required
                        @input="updateTotalCost"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Payment -->
              <div class="process-step">
                <div class="step-header">
                  <div class="step-number">2</div>
                  <h6 class="step-title">Payment Information</h6>
                </div>
                
                <div class="step-content">
                  <!-- Cost Summary -->
                  <div class="cost-summary">
                    <div class="cost-item">
                      <span>{{ rentalForm.quantity }} × {{ selectedItem?.name }}</span>
                      <span>{{ formatCurrency(selectedItem?.price_per_day) }}/day</span>
                    </div>
                    <div class="cost-item">
                      <span>× {{ rentalForm.days }} days</span>
                      <span>{{ formatCurrency(selectedItem?.price_per_day * rentalForm.days) }}</span>
                    </div>
                    <div class="cost-total">
                      <span>Total Cost</span>
                      <span class="total-amount">{{ formatCurrency(rentalForm.total_cost) }}</span>
                    </div>
                  </div>

                  <!-- Payment Method -->
                  <div class="payment-methods">
                    <label class="form-label">
                      <i class="fas fa-credit-card me-2"></i>Payment Method
                    </label>
                    <div class="payment-options">
                      <div 
                        v-for="method in paymentMethods" 
                        :key="method.id"
                        class="payment-option"
                        :class="{ active: rentalForm.payment_method === method.id }"
                        @click="rentalForm.payment_method = method.id"
                      >
                        <i :class="method.icon"></i>
                        <span>{{ method.name }}</span>
                      </div>
                    </div>
                    
                    <!-- Mobile Money Instructions -->
                    <div v-if="['airtel', 'mtn'].includes(rentalForm.payment_method)" class="momo-instructions mt-3">
                      <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Mobile Money Instructions:</strong>
                        <ul class="mb-0 mt-2">
                          <li>Go to your Mobile Money menu</li>
                          <li>Select "Send Money"</li>
                          <li>Enter our choir number: <strong>0753 123 456</strong></li>
                          <li>Amount: <strong>{{ formatCurrency(rentalForm.total_cost) }}</strong></li>
                          <li>Reference: <strong>RENTAL-{{ selectedItem?.name?.substring(0, 8).toUpperCase() }}</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              @click="submitRental"
              :disabled="!isFormValid"
            >
              <i class="fas fa-paper-plane me-2"></i>
              Submit Rental Request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from "@/services/api"
import { Modal } from "bootstrap"
import _ from "lodash"

export default {
  name: "PublicRentals",
  data() {
    return {
      items: [],
      categories: [],
      search: "",
      selectedItem: null,
      rentalForm: {
        guest_name: "",
        guest_contact: "",
        quantity: 1,
        days: 1,
        total_cost: 0,
        payment_method: "mtn",
      },
      paymentMethods: [
        { id: "airtel", name: "Airtel Money", icon: "fas fa-mobile-alt" },
        { id: "mtn", name: "MTN Mobile Money", icon: "fas fa-mobile-alt" },
        { id: "paypal", name: "PayPal", icon: "fab fa-paypal" },
        { id: "stripe", name: "Stripe", icon: "fas fa-credit-card" },
        { id: "cash", name: "Cash Payment", icon: "fas fa-money-bill" },
      ],
      loading: false,
      userOrders: []
    }
  },
  computed: {
    totalItems() {
      return this.items.length
    },
    affordableItems() {
      return this.items.filter(item => parseFloat(item.price_per_day) < 50000).length
    },
    popularCategories() {
      const categories = new Set(this.items.map(item => item.category_name).filter(Boolean))
      return categories.size
    },
    isFormValid() {
      return this.rentalForm.guest_name && 
             this.rentalForm.guest_contact && 
             this.rentalForm.quantity > 0 && 
             this.rentalForm.days > 0 && 
             this.rentalForm.payment_method
    }
  },
  created() {
    this.debouncedLoadItems = _.debounce(this.loadItems, 300)
  },
  methods: {
    formatCurrency(value) {
      if (!value && value !== 0) return "UGX 0"
      return `UGX ${parseFloat(value).toLocaleString('en-UG')}`
    },
    
    truncateDescription(description) {
      if (!description) return ''
      return description.length > 100 ? description.substring(0, 100) + '...' : description
    },
    
    getStockClass(quantity) {
      if (quantity === 0) return 'out-of-stock'
      if (quantity < 3) return 'low-stock'
      return 'in-stock'
    },
    
    getStockText(quantity) {
      if (quantity === 0) return 'Out of Stock'
      if (quantity < 3) return `Only ${quantity} Left`
      return 'In Stock'
    },
    
    async loadItems() {
      this.loading = true
      try {
        console.log('🔄 Loading rental items...')
        const params = {}
        if (this.search) {
          params.search = this.search
        }
        const res = await apiService.rentals.getItems(params)
        console.log('✅ Rental items loaded:', res.data)
        
        // Handle both array and paginated response
        if (Array.isArray(res.data)) {
          this.items = res.data
        } else if (res.data.results) {
          this.items = res.data.results
        } else {
          this.items = res.data
        }
        
        console.log('📦 Processed items:', this.items)
      } catch (err) {
        console.error("❌ Error loading rental items:", err)
        console.error("Error details:", err.response?.data)
        this.items = []
      } finally {
        this.loading = false
      }
    },
    
    openRentalModal(item) {
      this.selectedItem = item
      this.rentalForm = {
        guest_name: "",
        guest_contact: "",
        quantity: 1,
        days: 1,
        total_cost: parseFloat(item.price_per_day),
        payment_method: "mtn",
      }
      
      const modal = new Modal(document.getElementById("rentalModal"))
      modal.show()
      
      document.getElementById('rentalModal').addEventListener('shown.bs.modal', () => {
        this.updateTotalCost()
      })
    },
    
    updateTotalCost() {
      if (!this.selectedItem) return
      const quantity = this.rentalForm.quantity || 1
      const days = this.rentalForm.days || 1
      const price = parseFloat(this.selectedItem.price_per_day)
      
      this.rentalForm.total_cost = quantity * days * price
    },

    async submitRental() {
      if (!this.selectedItem || !this.isFormValid) {
        alert('Please fill in all required fields')
        return
      }

      if (this.rentalForm.quantity > this.selectedItem.available_quantity) {
        alert(`Only ${this.selectedItem.available_quantity} items available`)
        return
      }

      const payload = {
        items: [
          { 
            item: this.selectedItem.id, 
            quantity: this.rentalForm.quantity, 
            days: this.rentalForm.days 
          },
        ],
        guest_name: this.rentalForm.guest_name,
        guest_contact: this.rentalForm.guest_contact,
        payment_method: this.rentalForm.payment_method,
      }

      console.log('🔄 Submitting rental request...', payload)

      try {
        const response = await apiService.rentals.createOrder(payload)
        console.log('✅ Rental request successful:', response.data)
        
        this.showSuccessMessage()
        
        const modal = Modal.getInstance(document.getElementById("rentalModal"))
        if (modal) modal.hide()
        
        this.loadItems()
        
        this.rentalForm = {
          guest_name: "",
          guest_contact: "",
          quantity: 1,
          days: 1,
          total_cost: 0,
          payment_method: "mtn",
        }
      } catch (err) {
        console.error("❌ Error submitting rental:", err)
        this.handleRentalError(err)
      }
    },
    
    handleRentalError(err) {
      if (err.response?.status === 400) {
        const errorData = err.response.data
        let errorMessage = 'Validation error: '
        
        if (typeof errorData === 'object') {
          const errors = []
          for (const [key, value] of Object.entries(errorData)) {
            if (Array.isArray(value)) {
              errors.push(...value)
            } else if (typeof value === 'string') {
              errors.push(value)
            }
          }
          errorMessage += errors.join(', ')
        } else {
          errorMessage += err.response.data
        }
        alert(errorMessage)
      } else if (err.response?.status === 401) {
        alert('Please log in to submit a rental request.')
      } else if (err.response?.status === 403) {
        alert('You do not have permission to submit rental requests.')
      } else if (err.response?.status === 404) {
        alert('The rental item was not found. Please refresh the page and try again.')
      } else if (err.response?.status >= 500) {
        alert('Server error. Please try again later.')
      } else {
        alert('Failed to submit rental request. Please check your connection and try again.')
      }
    },
    
    showSuccessMessage() {
      let message = "🎉 Rental request submitted successfully! "
      message += "We will contact you shortly to confirm your order and provide payment instructions."
      
      alert(message)
    },
    
    clearSearch() {
      this.search = ""
      this.loadItems()
    },
    
    async loadUserOrders() {
      if (this.$store.state.auth.user) {
        try {
          const response = await apiService.rentals.getUserOrders()
          this.userOrders = response.data
        } catch (error) {
          console.error('Error loading user orders:', error)
        }
      }
    }
  },
  mounted() {
    this.loadItems()
  },
  watch: {
    'rentalForm.quantity': 'updateTotalCost',
    'rentalForm.days': 'updateTotalCost'
  }
}
</script>

<style scoped>
.rentals-page {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
}

/* Hero Section */
.rentals-hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
}

.hero-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  color: #e2e8f0;
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  min-width: 180px;
}

.stat-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  font-size: 1.5rem;
  color: #ffd700;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #e2e8f0;
  margin-top: 0.25rem;
}

/* Search Section */
.search-section {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-card {
  width: 100%;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-icon {
  font-size: 1.25rem;
  color: #667eea;
}

.search-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Rental Cards */
.rental-card {
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.rental-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(102, 126, 234, 0.3);
}

.rental-card.out-of-stock {
  opacity: 0.6;
}

.stock-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.stock-badge.in-stock {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.stock-badge.low-stock {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.stock-badge.out-of-stock {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.item-image {
  height: 120px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.card-content {
  padding: 1.5rem;
}

.item-title {
  color: #f1f5f9;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.meta-item i {
  width: 16px;
  color: #667eea;
}

.item-description {
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.pricing {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.price-main {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  line-height: 1;
}

.price-label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.btn-rent {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-rent:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-rent:disabled {
  background: #475569;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

/* Modal Styles */
.rental-modal-content {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1.5rem 2rem;
  border-radius: 20px 20px 0 0;
}

.modal-header-content {
  flex: 1;
}

.modal-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.25rem;
  color: #e2e8f0;
}

.modal-body {
  padding: 2rem;
}

/* Process Steps */
.process-step {
  margin-bottom: 2rem;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.step-title {
  color: #f1f5f9;
  margin: 0;
  font-weight: 600;
}

.step-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
}

/* Form Styles */
.form-label {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: #667eea;
  color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Cost Summary */
.cost-summary {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cost-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0 0 0;
  color: #f1f5f9;
  font-weight: 600;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.total-amount {
  color: #ffd700;
  font-size: 1.25rem;
}

/* Payment Methods */
.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.payment-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
}

.payment-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.payment-option.active {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  color: #667eea;
}

.payment-option i {
  font-size: 1.5rem;
}

/* Mobile Money Instructions */
.momo-instructions .alert {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #e2e8f0;
}

.momo-instructions ul {
  padding-left: 1.5rem;
  margin-bottom: 0;
}

.momo-instructions li {
  margin-bottom: 0.25rem;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #475569;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-title {
  color: #94a3b8;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty-text {
  color: #64748b;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-stats {
    gap: 1rem;
  }
  
  .stat-item {
    min-width: 140px;
    padding: 0.75rem 1rem;
  }
  
  .search-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-stats {
    justify-content: center;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .payment-options {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .rentals-hero {
    padding: 3rem 0;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-item {
    width: 100%;
    max-width: 250px;
  }
  
  .search-section {
    padding: 1.5rem;
    margin: 0 1rem;
  }
}
</style>