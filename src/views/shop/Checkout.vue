<template>
  <div class="checkout-container">
    <!-- Header -->
    <section class="checkout-header bg-primary text-white py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-0">Checkout</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="/shop" class="text-white-50">Shop</a></li>
                <li class="breadcrumb-item"><a href="#" class="text-white-50">Cart</a></li>
                <li class="breadcrumb-item active text-white">Checkout</li>
              </ol>
            </nav>
          </div>
          <div class="col-auto">
            <button @click="$router.back()" class="btn btn-outline-light">
              <i class="fas fa-arrow-left"></i> Back to Shop
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <div class="row">
        <!-- Checkout Form -->
        <div class="col-lg-8">
          <div v-if="cart.length === 0" class="empty-cart text-center py-5">
            <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
            <h3 class="text-muted">Your cart is empty</h3>
            <p class="text-muted mb-4">Add some items to your cart before checking out</p>
            <button @click="$router.push('/shop')" class="btn btn-primary btn-lg">
              Continue Shopping
            </button>
          </div>

          <div v-else>
            <!-- Customer Information -->
            <div class="card mb-4">
              <div class="card-header bg-light">
                <h5 class="card-title mb-0">
                  <i class="fas fa-user me-2"></i>Customer Information
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input 
                      v-model="customerInfo.firstName"
                      type="text" 
                      class="form-control" 
                      id="firstName"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input 
                      v-model="customerInfo.lastName"
                      type="text" 
                      class="form-control" 
                      id="lastName"
                      required
                    >
                  </div>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address *</label>
                  <input 
                    v-model="customerInfo.email"
                    type="email" 
                    class="form-control" 
                    id="email"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone Number *</label>
                  <input 
                    v-model="customerInfo.phone"
                    type="tel" 
                    class="form-control" 
                    id="phone"
                    required
                  >
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="card mb-4">
              <div class="card-header bg-light">
                <h5 class="card-title mb-0">
                  <i class="fas fa-truck me-2"></i>Shipping Address
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label for="address" class="form-label">Street Address *</label>
                  <input 
                    v-model="customerInfo.address"
                    type="text" 
                    class="form-control" 
                    id="address"
                    required
                  >
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="city" class="form-label">City *</label>
                    <input 
                      v-model="customerInfo.city"
                      type="text" 
                      class="form-control" 
                      id="city"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="postalCode" class="form-label">Postal Code</label>
                    <input 
                      v-model="customerInfo.postalCode"
                      type="text" 
                      class="form-control" 
                      id="postalCode"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="card">
              <div class="card-header bg-light">
                <h5 class="card-title mb-0">
                  <i class="fas fa-credit-card me-2"></i>Payment Method
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <div class="form-check mb-3">
                    <input 
                      v-model="paymentMethod" 
                      value="mtn" 
                      class="form-check-input" 
                      type="radio" 
                      id="mtn"
                    >
                    <label class="form-check-label d-flex align-items-center" for="mtn">
                      <!-- Fixed: Replaced /api/placeholder with colored badge -->
                      <span class="payment-badge mtn-badge me-2">MTN</span>
                      MTN Mobile Money
                    </label>
                  </div>
                  
                  <div class="form-check mb-3">
                    <input 
                      v-model="paymentMethod" 
                      value="airtel" 
                      class="form-check-input" 
                      type="radio" 
                      id="airtel"
                    >
                    <label class="form-check-label d-flex align-items-center" for="airtel">
                      <!-- Fixed: Replaced /api/placeholder with colored badge -->
                      <span class="payment-badge airtel-badge me-2">Airtel</span>
                      Airtel Money
                    </label>
                  </div>
                  
                  <div class="form-check">
                    <input 
                      v-model="paymentMethod" 
                      value="card" 
                      class="form-check-input" 
                      type="radio" 
                      id="card"
                    >
                    <label class="form-check-label d-flex align-items-center" for="card">
                      <i class="fas fa-credit-card me-2"></i>
                      Credit/Debit Card
                    </label>
                  </div>
                </div>

                <!-- Mobile Money Fields -->
                <div v-if="paymentMethod === 'mtn' || paymentMethod === 'airtel'" class="payment-details">
                  <div class="mb-3">
                    <label :for="paymentMethod + 'Phone'" class="form-label">
                      {{ paymentMethod === 'mtn' ? 'MTN' : 'Airtel' }} Phone Number *
                    </label>
                    <input 
                      v-model="mobileMoneyPhone"
                      type="tel" 
                      class="form-control" 
                      :id="paymentMethod + 'Phone'"
                      :placeholder="paymentMethod === 'mtn' ? '256 XXX XXX XXX' : '256 XXX XXX XXX'"
                      required
                    >
                    <div class="form-text">
                      You will receive a prompt on your phone to complete the payment
                    </div>
                  </div>
                </div>

                <!-- Card Fields -->
                <div v-if="paymentMethod === 'card'" class="payment-details">
                  <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number *</label>
                    <input 
                      v-model="cardInfo.number"
                      type="text" 
                      class="form-control" 
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                    >
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="expiry" class="form-label">Expiry Date *</label>
                      <input 
                        v-model="cardInfo.expiry"
                        type="text" 
                        class="form-control" 
                        id="expiry"
                        placeholder="MM/YY"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="cvv" class="form-label">CVV *</label>
                      <input 
                        v-model="cardInfo.cvv"
                        type="text" 
                        class="form-control" 
                        id="cvv"
                        placeholder="123"
                        required
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4">
          <div class="card sticky-top" style="top: 20px;">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">Order Summary</h5>
            </div>
            <div class="card-body">
              <!-- Order Items -->
              <div v-for="item in cart" :key="item.id" class="order-item d-flex mb-3 pb-3 border-bottom">
                <!-- Fixed: Using fallback image instead of localhost URL -->
                <img 
                  :src="getProductImage(item.image)" 
                  :alt="item.name"
                  class="order-item-image me-3"
                  @error="handleImageError"
                >
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ item.name }}</h6>
                  <p class="text-muted small mb-1">Qty: {{ item.quantity }}</p>
                  <p class="text-primary fw-bold mb-0">UGX {{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>

              <!-- Order Totals -->
              <div class="order-totals">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Subtotal:</span>
                  <span>UGX {{ formatPrice(subtotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Shipping:</span>
                  <span>UGX {{ formatPrice(shipping) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Tax:</span>
                  <span>UGX {{ formatPrice(tax) }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong class="text-primary">UGX {{ formatPrice(total) }}</strong>
                </div>
              </div>

              <!-- Checkout Button -->
              <button 
                @click="processOrder" 
                :disabled="!canCheckout || processing"
                class="btn btn-primary w-100 btn-lg"
              >
                <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-lock me-2"></i>
                {{ processing ? 'Processing...' : `Pay UGX ${formatPrice(total)}` }}
              </button>

              <!-- Security Notice -->
              <div class="text-center mt-3">
                <small class="text-muted">
                  <i class="fas fa-shield-alt me-1"></i>
                  Your payment is secure and encrypted
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">Order Confirmed! 🎉</h5>
          </div>
          <div class="modal-body text-center py-4">
            <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
            <h4 class="text-success mb-3">Thank You for Your Order!</h4>
            <p class="mb-2">Order #{{ orderId }}</p>
            <p class="text-muted">A confirmation email has been sent to {{ customerInfo.email }}</p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button @click="continueShopping" class="btn btn-primary">
              Continue Shopping
            </button>
            <button @click="viewOrder" class="btn btn-outline-primary">
              View Order Details
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutPage',
  data() {
    return {
      cart: [],
      customerInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
      },
      paymentMethod: 'mtn',
      mobileMoneyPhone: '',
      cardInfo: {
        number: '',
        expiry: '',
        cvv: ''
      },
      processing: false,
      showSuccessModal: false,
      orderId: this.generateOrderId(),
      shipping: 5000, // Fixed shipping cost for demo
      taxRate: 0.18 // 18% VAT for demo
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0)
    },
    tax() {
      return this.subtotal * this.taxRate
    },
    total() {
      return this.subtotal + this.shipping + this.tax
    },
    canCheckout() {
      return (
        this.cart.length > 0 &&
        this.customerInfo.firstName &&
        this.customerInfo.lastName &&
        this.customerInfo.email &&
        this.customerInfo.phone &&
        this.customerInfo.address &&
        this.customerInfo.city &&
        this.validatePaymentInfo()
      )
    }
  },
  methods: {
    getProductImage(imageUrl) {
      // Fixed: Remove localhost reference for production build
      if (imageUrl) {
        // Use environment variable for API base URL or fallback
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
      }
      return 'https://via.placeholder.com/60x60?text=Product'
    },
    handleImageError(event) {
      // Fallback if image fails to load
      event.target.src = 'https://via.placeholder.com/60x60?text=Product'
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString('en-US')
    },
    validatePaymentInfo() {
      if (this.paymentMethod === 'mtn' || this.paymentMethod === 'airtel') {
        return this.mobileMoneyPhone.length >= 10
      } else if (this.paymentMethod === 'card') {
        return this.cardInfo.number && this.cardInfo.expiry && this.cardInfo.cvv
      }
      return false
    },
    async processOrder() {
      if (!this.canCheckout) return
      
      this.processing = true
      
      try {
        // In production, this would call your API
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Create order object
        const order = {
          id: this.orderId,
          customer: this.customerInfo,
          items: this.cart,
          payment: {
            method: this.paymentMethod,
            amount: this.total
          },
          timestamp: new Date().toISOString()
        }
        
        // Save order to localStorage (in production, send to API)
        this.saveOrder(order)
        
        // Clear cart
        localStorage.removeItem('avc_shop_cart')
        
        // Show success modal
        this.showSuccessModal = true
        
      } catch (error) {
        console.error('Order processing error:', error)
        alert('There was an error processing your order. Please try again.')
      } finally {
        this.processing = false
      }
    },
    saveOrder(order) {
      const orders = JSON.parse(localStorage.getItem('avc_shop_orders') || '[]')
      orders.push(order)
      localStorage.setItem('avc_shop_orders', JSON.stringify(orders))
    },
    generateOrderId() {
      return 'AVC' + Date.now().toString().slice(-8)
    },
    continueShopping() {
      this.showSuccessModal = false
      this.$router.push('/shop')
    },
    viewOrder() {
      this.showSuccessModal = false
      // In a real app, navigate to order details page
      alert(`Order details for ${this.orderId} would be shown here.`)
    }
  },
  mounted() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('avc_shop_cart')
    if (savedCart) {
      this.cart = JSON.parse(savedCart)
    }
    
    // Redirect if cart is empty
    if (this.cart.length === 0) {
      this.$router.push('/shop')
    }
    
    // Pre-fill demo data for testing (only in development)
    if (import.meta.env.DEV) {
      this.customerInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '256712345678',
        address: '123 Main Street',
        city: 'Kampala',
        postalCode: '00256'
      }
      this.mobileMoneyPhone = '256712345678'
    }
  }
}
</script>

<style scoped>
.checkout-header {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
}

.order-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sticky-top {
  position: sticky;
  z-index: 10;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.modal-backdrop {
  opacity: 0.5;
}

/* Payment badge styles */
.payment-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 25px;
  font-size: 10px;
  font-weight: bold;
  border-radius: 3px;
  color: white;
}

.mtn-badge {
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%);
}

.airtel-badge {
  background: linear-gradient(135deg, #E21836 0%, #FF4D6A 100%);
}

/* Form validation styles */
.form-control:invalid {
  border-color: #dc3545;
}

.form-control:valid {
  border-color: #198754;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sticky-top {
    position: static;
  }
  
  .payment-badge {
    width: 35px;
    height: 22px;
    font-size: 9px;
  }
}
</style>