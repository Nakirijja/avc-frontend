<template>
  <div class="orders-container">
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 mb-0">My Orders</h1>
            <router-link to="/shop" class="btn btn-outline-primary">
              <i class="fas fa-arrow-left me-2"></i>Back to Shop
            </router-link>
          </div>

          <div v-if="orders.length === 0" class="text-center py-5">
            <i class="fas fa-box-open fa-4x text-muted mb-4"></i>
            <h3 class="text-muted">No Orders Yet</h3>
            <p class="text-muted mb-4">You haven't placed any orders yet.</p>
            <router-link to="/shop" class="btn btn-primary btn-lg">
              Start Shopping
            </router-link>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="card mb-4">
              <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title mb-0">Order #{{ order.id }}</h5>
                  <small class="text-muted">{{ formatDate(order.timestamp) }}</small>
                </div>
                <span :class="`badge bg-${getStatusColor(order.status)}`">
                  {{ order.status }}
                </span>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-8">
                    <h6>Items:</h6>
                    <div v-for="item in order.items" :key="item.id" class="d-flex align-items-center mb-2">
                      <img :src="item.image" :alt="item.name" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                      <div>
                        <p class="mb-0 fw-bold">{{ item.name }}</p>
                        <p class="mb-0 text-muted">Qty: {{ item.quantity }} × UGX {{ formatPrice(item.price) }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="order-summary">
                      <h6>Order Summary</h6>
                      <div class="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span>UGX {{ formatPrice(getOrderSubtotal(order)) }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Shipping:</span>
                        <span>UGX {{ formatPrice(order.shipping || 5000) }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Tax:</span>
                        <span>UGX {{ formatPrice(order.tax || 0) }}</span>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span class="text-primary">UGX {{ formatPrice(order.payment.amount) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-white">
                <div class="row">
                  <div class="col-md-6">
                    <small class="text-muted">
                      Payment Method: {{ order.payment.method.toUpperCase() }}
                    </small>
                  </div>
                  <div class="col-md-6 text-end">
                    <button class="btn btn-outline-primary btn-sm me-2">
                      <i class="fas fa-eye me-1"></i>View Details
                    </button>
                    <button v-if="order.status === 'pending'" class="btn btn-primary btn-sm">
                      <i class="fas fa-credit-card me-1"></i>Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authHelper } from '@/services/api'

export default {
  name: 'OrdersPage',
  data() {
    return {
      orders: []
    }
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString('en-US')
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatusColor(status) {
      const colors = {
        'pending': 'warning',
        'paid': 'info',
        'shipped': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
      }
      return colors[status] || 'secondary'
    },
    getOrderSubtotal(order) {
      return order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    loadOrders() {
      // Load orders from localStorage
      const savedOrders = localStorage.getItem('avc_shop_orders')
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders)
      }
    }
  },
  mounted() {
    // Check authentication
    if (!authHelper.isAuthenticated()) {
      this.$router.push('/auth/login')
      return
    }
    
    this.loadOrders()
  }
}
</script>

<style scoped>
.orders-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
}
</style>