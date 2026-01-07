<template>
  <div class="container py-5">
    <h1 class="mb-4">Transactions</h1>

    <!-- Search & Add -->
    <div class="d-flex justify-content-between mb-3">
      <input
        v-model="search"
        @input="loadTransactions"
        type="text"
        class="form-control w-50"
        placeholder="Search by user, reference, or status..."
      />
      <button class="btn btn-success" @click="openTransactionModal()">New Transaction</button>
    </div>

    <!-- Transactions Table -->
    <table class="table table-hover table-bordered">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Payment Method</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Status</th>
          <th>Reference</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <td>{{ tx.id }}</td>
          <td>{{ tx.user ? tx.user.username : 'Guest' }}</td>
          <td>{{ tx.payment_method }}</td>
          <td>{{ formatCurrency(tx.amount) }}</td>
          <td>{{ tx.currency }}</td>
          <td>
            <span :class="statusClass(tx.status)">{{ tx.status }}</span>
          </td>
          <td>{{ tx.reference || '-' }}</td>
          <td>{{ formatDate(tx.created_at) }}</td>
          <td>
            <button class="btn btn-sm btn-info me-1" @click="viewTransaction(tx)">View</button>
            <button class="btn btn-sm btn-danger" @click="deleteTransaction(tx.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="9" class="text-center">No transactions found.</td>
        </tr>
      </tbody>
    </table>

    <!-- ---------------- MODAL ---------------- -->
    <div class="modal fade" id="transactionModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New Transaction</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTransaction">
              <div class="mb-3">
                <label class="form-label">Payment Method</label>
                <select v-model="transactionForm.payment_method" class="form-select" required>
                  <option value="" disabled>Select Payment</option>
                  <option value="AIRTEL">AirTel Money</option>
                  <option value="MTN">MTN Mobile Money</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="STRIPE">Stripe</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Amount</label>
                <input v-model.number="transactionForm.amount" type="number" class="form-control" min="0.01" step="0.01" required>
              </div>

              <div class="mb-3" v-if="requiresPhone">
                <label class="form-label">Phone Number</label>
                <input v-model="transactionForm.phone_number" type="text" class="form-control" placeholder="07XXXXXXXX" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Currency</label>
                <input v-model="transactionForm.currency" type="text" class="form-control" placeholder="UGX" required>
              </div>

              <button type="submit" class="btn btn-primary">Process Payment</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div class="modal fade" id="transactionDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Transaction Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <pre>{{ selectedTransaction }}</pre>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";

export default {
  name: "Transactions",
  data() {
    return {
      transactions: [],
      search: "",
      transactionForm: {
        payment_method: "",
        amount: 0,
        currency: "UGX",
        phone_number: "",
      },
      selectedTransaction: null,
    };
  },
  computed: {
    requiresPhone() {
      return ["AIRTEL", "MTN"].includes(this.transactionForm.payment_method);
    },
  },
  methods: {
    async loadTransactions() {
      try {
        const res = await axios.get("/api/v1/transactions/", { params: { search: this.search } });
        this.transactions = res.data.results || [];
      } catch (err) {
        console.error("Error loading transactions:", err);
      }
    },
    openTransactionModal() {
      this.transactionForm = { payment_method: "", amount: 0, currency: "UGX", phone_number: "" };
      new Modal(document.getElementById("transactionModal")).show();
    },
    async saveTransaction() {
      try {
        await axios.post("/api/v1/transactions/", this.transactionForm);
        alert("Transaction initiated!");
        this.loadTransactions();
        Modal.getInstance(document.getElementById("transactionModal")).hide();
      } catch (e) {
        alert("Error: " + (e.response?.data?.detail || e.message));
      }
    },
    viewTransaction(tx) {
      this.selectedTransaction = tx;
      new Modal(document.getElementById("transactionDetailsModal")).show();
    },
    async deleteTransaction(id) {
      if (!confirm("Delete this transaction?")) return;
      await axios.delete(`/api/v1/transactions/${id}/`);
      this.loadTransactions();
    },
    statusClass(status) {
      switch (status) {
        case "SUCCESS": return "badge bg-success";
        case "FAILED": return "badge bg-danger";
        case "PENDING": return "badge bg-warning text-dark";
        default: return "badge bg-secondary";
      }
    },
    // ----------- Replacements for Filters -----------
    formatCurrency(value) {
      if (value == null) return "$0.00";
      return `$${parseFloat(value).toFixed(2)}`;
    },
    formatDate(value) {
      if (!value) return "-";
      return new Date(value).toLocaleString();
    },
  },
  mounted() {
    this.loadTransactions();
  },
};
</script>

<style scoped>
.table th, .table td { vertical-align: middle; }
</style>
