<!-- src/components/shop/CartSidebar.vue -->
<template>
  <div class="cart-sidebar" :class="{ 'cart-sidebar--visible': isVisible }">
    <div class="cart-overlay" @click="$emit('close')"></div>
    
    <div class="cart-content">
      <div class="cart-header">
        <h5 class="cart-title">
          <i class="fas fa-shopping-cart me-2"></i>
          Your Cart ({{ totalItems }})
        </h5>
        <button class="btn-close" @click="$emit('close')" aria-label="Close cart"></button>
      </div>
      
      <div class="cart-body">
        <div v-if="cartItems.length === 0" class="empty-cart text-center py-5">
          <i class="fas fa-cart-arrow-down fa-3x text-muted mb-3"></i>
          <p class="text-muted">Your cart is empty</p>
          <button @click="$emit('close')" class="btn btn-outline-primary mt-2">
            Continue Shopping
          </button>
        </div>
        
        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="getProductImage(item.image)" :alt="item.name" class="cart-item-image">
            
            <div class="cart-item-details">
              <h6 class="cart-item-title">{{ item.name }}</h6>
              <p class="cart-item-price text-primary">UGX {{ formatPrice(item.price) }}</p>
              
              <div class="cart-item-controls">
                <div class="quantity-controls">
                  <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="increaseQuantity(item)"
                    :disabled="item.quantity >= (item.max_stock || 10)"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('remove-item', item.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-summary mb-3">
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Subtotal:</span>
            <span>UGX {{ formatPrice(subtotal) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Shipping:</span>
            <span>UGX {{ formatPrice(shipping) }}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between mb-3">
            <strong>Total:</strong>
            <strong class="text-primary">UGX {{ formatPrice(total) }}</strong>
          </div>
        </div>
        
        <button class="btn btn-primary w-100 mb-2" @click="$emit('checkout')">
          <i class="fas fa-lock me-2"></i>
          Proceed to Checkout
        </button>
        
        <button @click="$emit('close')" class="btn btn-outline-secondary w-100">
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartSidebar',
  props: {
    isVisible: Boolean,
    cartItems: Array
  },
  computed: {
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0)
    },
    shipping() {
      return this.subtotal > 0 ? 5000 : 0
    },
    total() {
      return this.subtotal + this.shipping
    }
  },
  methods: {
    getProductImage(imageUrl) {
      if (!imageUrl) return '/images/placeholder-product.png'
      return imageUrl
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString('en-US')
    },
    increaseQuantity(item) {
      if (item.quantity < (item.max_stock || 10)) {
        this.$emit('update-quantity', item.id, item.quantity + 1)
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.$emit('update-quantity', item.id, item.quantity - 1)
      }
    }
  }
}
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  z-index: 1050;
  transition: right 0.3s ease-in-out;
}

.cart-sidebar--visible {
  right: 0;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1049;
}

.cart-content {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.cart-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.cart-title {
  margin: 0;
  flex: 1;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
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
  border-radius: 0.375rem;
  background: #f8f9fa;
}

.cart-item-details {
  flex: 1;
}

.cart-item-title {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.2;
}

.cart-item-price {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.cart-item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
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

.cart-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
}

.cart-summary {
  background: white;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

@media (max-width: 576px) {
  .cart-sidebar {
    width: 100vw;
    right: -100vw;
  }
}
</style>