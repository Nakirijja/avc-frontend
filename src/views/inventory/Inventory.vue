<template>
  <div class="container py-5">
    <!-- Page Header -->
    <h1 class="mb-4">Inventory Management</h1>

    <!-- Add / Edit Form -->
    <div class="card mb-5">
      <div class="card-header">
        <h5 class="mb-0">{{ editMode ? "Edit Item" : "Add New Item" }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitItem" enctype="multipart/form-data">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Name</label>
              <input v-model="itemForm.name" type="text" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Category</label>
              <select v-model="itemForm.category" class="form-select" required>
                <option value="sheet_music">Sheet Music</option>
                <option value="uniform">Uniform</option>
                <option value="instrument">Instrument</option>
                <option value="hymn_book">Hymn Book</option>
                <option value="file">File</option>
              </select>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Quantity</label>
              <input v-model.number="itemForm.quantity" type="number" min="1" class="form-control" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">Condition</label>
              <select v-model="itemForm.condition" class="form-select" required>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Location (Optional)</label>
              <input v-model="itemForm.location" type="text" class="form-control">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Description (Optional)</label>
            <textarea v-model="itemForm.description" class="form-control" rows="3"></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Image (Optional)</label>
            <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update Item" : "Add Item") }}
            </button>
            <button v-if="editMode" type="button" class="btn btn-secondary" @click="resetForm">Cancel</button>
          </div>

          <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </form>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-md-4 mb-2">
        <input v-model="search" @input="loadItems" type="text" class="form-control" placeholder="Search by name, SKU, description...">
      </div>
      <div class="col-md-4 mb-2">
        <select v-model="filterCategory" @change="loadItems" class="form-select">
          <option value="">All Categories</option>
          <option value="sheet_music">Sheet Music</option>
          <option value="uniform">Uniform</option>
          <option value="instrument">Instrument</option>
          <option value="hymn_book">Hymn Book</option>
          <option value="file">File</option>
        </select>
      </div>
      <div class="col-md-4 mb-2">
        <select v-model="filterCondition" @change="loadItems" class="form-select">
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Condition</th>
            <th>Location</th>
            <th>Added By</th>
            <th>Added On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.sku }}</td>
            <td>{{ item.name }}</td>
            <td class="text-capitalize">{{ item.category }}</td>
            <td>{{ item.quantity }}</td>
            <td class="text-capitalize">{{ item.condition }}</td>
            <td>{{ item.location || '-' }}</td>
            <td>{{ item.added_by_name || '-' }}</td>
            <td>{{ formatDate(item.added_on) }}</td>
            <td>
              <button @click="editItem(item)" class="btn btn-sm btn-warning me-1">Edit</button>
              <button @click="deleteItem(item.id)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="9" class="text-center py-3">No items found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav aria-label="Page navigation" class="mt-3 d-flex justify-content-between align-items-center">
      <button class="btn btn-outline-secondary" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-outline-secondary" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Inventory",
  data() {
    return {
      items: [],
      itemForm: {
        name: "",
        category: "sheet_music",
        quantity: 1,
        condition: "good",
        location: "",
        description: "",
        image: null,
      },
      editMode: false,
      editingId: null,
      submitting: false,
      successMessage: "",
      errorMessage: "",
      search: "",
      filterCategory: "",
      filterCondition: "",
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    };
  },
  methods: {
    async loadItems(page = 1) {
      try {
        const params = { page, page_size: this.pageSize };
        if (this.search) params.search = this.search;
        if (this.filterCategory) params.category = this.filterCategory;
        if (this.filterCondition) params.condition = this.filterCondition;

        const res = await axios.get("/api/v1/inventory/items/", { params });
        this.items = res.data.results;
        this.totalPages = Math.ceil(res.data.count / this.pageSize);
        this.currentPage = page;
      } catch (err) {
        console.error(err);
      }
    },
    handleFileUpload(event) {
      this.itemForm.image = event.target.files[0];
    },
    async submitItem() {
      this.submitting = true;
      this.successMessage = "";
      this.errorMessage = "";
      const formData = new FormData();
      for (const key in this.itemForm) {
        if (this.itemForm[key] !== null) formData.append(key, this.itemForm[key]);
      }

      try {
        if (this.editMode) {
          await axios.put(`/api/v1/inventory/items/${this.editingId}/`, formData, { headers: { "Content-Type": "multipart/form-data" }});
          this.successMessage = "Item updated successfully!";
        } else {
          await axios.post("/api/v1/inventory/items/", formData, { headers: { "Content-Type": "multipart/form-data" }});
          this.successMessage = "Item added successfully!";
        }
        this.resetForm();
        this.loadItems(this.currentPage);
      } catch (err) {
        this.errorMessage = err.response?.data?.detail || "Failed to submit item.";
      } finally {
        this.submitting = false;
      }
    },
    editItem(item) {
      this.editMode = true;
      this.editingId = item.id;
      this.itemForm = {
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        condition: item.condition,
        location: item.location,
        description: item.description,
        image: null,
      };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    resetForm() {
      this.editMode = false;
      this.editingId = null;
      this.itemForm = { name: "", category: "sheet_music", quantity: 1, condition: "good", location: "", description: "", image: null };
      this.successMessage = "";
      this.errorMessage = "";
    },
    async deleteItem(id) {
      if (!confirm("Are you sure you want to delete this item?")) return;
      try {
        await axios.delete(`/api/v1/inventory/items/${id}/`);
        this.successMessage = "Item deleted successfully!";
        this.loadItems(this.currentPage);
      } catch {
        this.errorMessage = "Failed to delete item.";
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.loadItems(page);
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
    },
  },
  mounted() {
    this.loadItems();
  },
};
</script>

<style scoped>
table th, table td { vertical-align: middle; }
</style>
