<template>
  <div class="container py-5">
    <h1 class="mb-4">Rental Management</h1>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4" id="rentalTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="items-tab" data-bs-toggle="tab" data-bs-target="#items" type="button">
          Items
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button">
          Orders
        </button>
      </li>
    </ul>

    <div class="tab-content" id="rentalTabContent">
      <!-- ITEMS TAB -->
      <div class="tab-pane fade show active" id="items">
        <div class="d-flex justify-content-between mb-3">
          <input
            v-model="itemSearch"
            @input="debouncedLoadItems"
            type="text"
            class="form-control w-50"
            placeholder="Search items..."
          >
          <button class="btn btn-success" @click="openItemModal()">Add Item</button>
        </div>

        <table class="table table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price/Day</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ formatCurrency(item.price_per_day) }}</td>
              <td>{{ item.available_quantity }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-1" @click="openItemModal(item)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)">Delete</button>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="5" class="text-center">No items found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ORDERS TAB -->
      <div class="tab-pane fade" id="orders">
        <div class="d-flex justify-content-between mb-3">
          <input
            v-model="orderSearch"
            @input="debouncedLoadOrders"
            type="text"
            class="form-control w-50"
            placeholder="Search orders..."
          >
          <button class="btn btn-success" @click="openOrderModal()">New Order</button>
        </div>

        <table class="table table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Total Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ formatDate(order.order_date) }}</td>
              <td>{{ order.status }}</td>
              <td>{{ formatCurrency(order.total_cost) }}</td>
              <td>
                <button class="btn btn-sm btn-info me-1" @click="viewOrder(order)">View</button>
                <button class="btn btn-sm btn-warning me-1" @click="updateOrderStatus(order)">Update Status</button>
                <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)">Delete</button>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center">No orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ITEM MODAL -->
    <div class="modal fade" id="itemModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveItem">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="itemForm.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <input v-model="itemForm.category" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Price per Day</label>
                <input v-model.number="itemForm.price_per_day" type="number" class="form-control" min="0" step="0.01" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Available Quantity</label>
                <input v-model.number="itemForm.available_quantity" type="number" class="form-control" min="0" required>
              </div>
              <button type="submit" class="btn btn-primary">{{ editingItem ? 'Update' : 'Add' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- ORDER MODAL -->
    <div class="modal fade" id="orderModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New Order</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveOrder">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Select Item</label>
                  <select v-model="orderForm.item" @change="updateTotalCost" class="form-select" required>
                    <option value="" disabled>Select Item</option>
                    <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }} - {{ item.available_quantity }} available</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Quantity</label>
                  <input v-model.number="orderForm.quantity" @input="updateTotalCost" type="number" class="form-control" min="1" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Days</label>
                  <input v-model.number="orderForm.days" @input="updateTotalCost" type="number" class="form-control" min="1" required>
                </div>
              </div>

              <div class="mt-3">
                <label class="form-label">Payment Method</label>
                <select v-model="orderForm.payment_method" class="form-select" required>
                  <option value="" disabled>Select Payment</option>
                  <option value="airtel">AirTel Money</option>
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              <div class="mt-3">
                <strong>Total Cost:</strong> {{ formatCurrency(orderForm.total_cost) }}
              </div>

              <button type="submit" class="btn btn-primary mt-3">Place Order</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import _ from "lodash"; // for debounce

export default {
  name: "Rentals",
  data() {
    return {
      items: [],
      orders: [],
      itemSearch: "",
      orderSearch: "",
      editingItem: null,
      itemForm: { name: "", category: "", price_per_day: 0, available_quantity: 0 },
      orderForm: { item: null, quantity: 1, days: 1, total_cost: 0, payment_method: "" },
    };
  },
  created() {
    // debounce searches to reduce API calls
    this.debouncedLoadItems = _.debounce(this.loadItems, 300);
    this.debouncedLoadOrders = _.debounce(this.loadOrders, 300);
  },
  methods: {
    // ------------------ Format Helpers ------------------
    formatCurrency(value) {
      if (value == null) return "$0.00";
      return `$${parseFloat(value).toFixed(2)}`;
    },
    formatDate(value) {
      if (!value) return "-";
      return new Date(value).toLocaleString();
    },

    // ------------------ ITEMS ------------------
    async loadItems() {
      const res = await axios.get("/api/rentals/items/", { params: { search: this.itemSearch } });
      this.items = res.data.results || [];
    },
    openItemModal(item = null) {
      this.editingItem = item;
      this.itemForm = item ? { ...item } : { name: "", category: "", price_per_day: 0, available_quantity: 0 };
      new Modal(document.getElementById("itemModal")).show();
    },
    async saveItem() {
      if (this.editingItem) {
        await axios.put(`/api/rentals/items/${this.editingItem.id}/`, this.itemForm);
      } else {
        await axios.post("/api/rentals/items/", this.itemForm);
      }
      await this.loadItems();
      Modal.getInstance(document.getElementById("itemModal")).hide();
    },
    async deleteItem(id) {
      if (!confirm("Delete this item?")) return;
      await axios.delete(`/api/rentals/items/${id}/`);
      await this.loadItems();
    },

    // ------------------ ORDERS ------------------
    async loadOrders() {
      const res = await axios.get("/api/rentals/orders/", { params: { search: this.orderSearch } });
      this.orders = res.data.results || [];
    },
    openOrderModal() {
      this.orderForm = { item: null, quantity: 1, days: 1, total_cost: 0, payment_method: "" };
      new Modal(document.getElementById("orderModal")).show();
    },
    updateTotalCost() {
      const selectedItem = this.items.find(i => i.id === this.orderForm.item);
      this.orderForm.total_cost = selectedItem
        ? selectedItem.price_per_day * this.orderForm.quantity * this.orderForm.days
        : 0;
    },
    async saveOrder() {
      const payload = {
        items: [{ item: this.orderForm.item, quantity: this.orderForm.quantity, days: this.orderForm.days }],
        payment_method: this.orderForm.payment_method,
        amount: this.orderForm.total_cost,
      };
      await axios.post("/api/rentals/orders/", payload);
      alert("Order placed successfully!");
      await this.loadOrders();
      Modal.getInstance(document.getElementById("orderModal")).hide();
    },
    viewOrder(order) {
      alert(JSON.stringify(order.items, null, 2));
    },
    updateOrderStatus(order) {
      const newStatus = prompt("New status (pending, approved, returned, cancelled):", order.status);
      if (!newStatus) return;
      axios.patch(`/api/rentals/orders/${order.id}/`, { status: newStatus.toLowerCase() }).then(this.loadOrders);
    },
    async deleteOrder(id) {
      if (!confirm("Delete this order?")) return;
      await axios.delete(`/api/rentals/orders/${id}/`);
      await this.loadOrders();
    },
  },
  mounted() {
    this.loadItems();
    this.loadOrders();
  },
};
</script>

<style scoped>
.table th, .table td { vertical-align: middle; }
</style>
