<template>
  <div class="membership-page">
    <!-- Public Submission Form -->
    <section class="submission-section">
      <div class="section-header">
        <h2>Join the Choir</h2>
        <p class="section-subtitle">Become part of our worship ministry</p>
      </div>
      
      <form @submit.prevent="submitJoinRequest" class="join-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input
              v-model="joinForm.full_name"
              type="text"
              required
              class="form-input"
              placeholder="Enter your full name"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input
              v-model="joinForm.email"
              type="email"
              required
              class="form-input"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Phone *</label>
            <input
              v-model="joinForm.phone"
              type="text"
              required
              class="form-input"
              placeholder="+256 XXX XXX XXX"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Role *</label>
            <select v-model="joinForm.role" required class="form-input">
              <option value="chorister">Chorister</option>
              <option value="instrumentalist">Instrumentalist</option>
              <option value="supporter">Supporter</option>
            </select>
          </div>
          
          <div class="form-group full-width">
            <label class="form-label">Experience (Optional)</label>
            <textarea 
              v-model="joinForm.experience" 
              rows="4" 
              class="form-input form-textarea"
              placeholder="Tell us about your musical background or why you want to join..."
            ></textarea>
          </div>
        </div>
        
        <button
          type="submit"
          class="submit-button"
          :disabled="submitting"
          :class="{ 'button-loading': submitting }"
        >
          <span v-if="!submitting">Submit Request</span>
          <span v-else class="loading-text">
            <span class="spinner"></span>
            Submitting...
          </span>
        </button>
        
        <div v-if="successMessage" class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="alert alert-error">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>
      </form>
    </section>

    <!-- Admin Section: Requests List -->
    <section v-if="isAdmin" class="admin-section">
      <div class="section-header">
        <h2>Membership Requests</h2>
        <p class="section-subtitle">Manage choir membership applications</p>
      </div>

      <!-- Filters -->
      <div class="filters-container">
        <div class="filter-group">
          <label class="filter-label">Status:</label>
          <select v-model="filters.status" @change="loadRequests" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Role:</label>
          <select v-model="filters.role" @change="loadRequests" class="filter-select">
            <option value="">All Roles</option>
            <option value="chorister">Chorister</option>
            <option value="instrumentalist">Instrumentalist</option>
            <option value="supporter">Supporter</option>
          </select>
        </div>
        
        <button @click="loadRequests" class="refresh-button">
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      <!-- Requests Table -->
      <div class="table-container">
        <div v-if="loading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Loading requests...</p>
        </div>
        
        <div v-else-if="requests.length === 0" class="empty-state">
          <i class="fas fa-inbox fa-3x"></i>
          <h3>No requests found</h3>
          <p>There are no membership requests matching your criteria.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="requests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Processed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="request.id" class="request-row">
                <td class="name-cell">
                  <strong>{{ request.full_name }}</strong>
                </td>
                <td class="contact-cell">
                  <div class="contact-info">
                    <div class="email">{{ request.email }}</div>
                    <div class="phone">{{ request.phone }}</div>
                  </div>
                </td>
                <td class="role-cell">
                  <span class="role-badge" :class="request.role">
                    {{ request.role }}
                  </span>
                </td>
                <td class="status-cell">
                  <span class="status-badge" :class="request.status">
                    {{ request.status }}
                  </span>
                </td>
                <td class="date-cell">
                  {{ formatDate(request.submitted_at) }}
                </td>
                <td class="processor-cell">
                  {{ request.processed_by?.username || '—' }}
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button
                      v-if="request.status === 'pending'"
                      @click="updateStatus(request.id, 'approved')"
                      class="btn-approve"
                      title="Approve Request"
                    >
                      <i class="fas fa-check"></i>
                      Approve
                    </button>
                    <button
                      v-if="request.status === 'pending'"
                      @click="updateStatus(request.id, 'rejected')"
                      class="btn-reject"
                      title="Reject Request"
                    >
                      <i class="fas fa-times"></i>
                      Reject
                    </button>
                    <span v-if="request.status !== 'pending'" class="no-actions">
                      Processed
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export default {
  name: "Membership",
  data() {
    return {
      joinForm: {
        full_name: "",
        email: "",
        phone: "",
        role: "chorister",
        experience: "",
      },
      submitting: false,
      successMessage: "",
      errorMessage: "",
      requests: [],
      loading: false,
      filters: {
        status: "",
        role: "",
      },
      isAdmin: false, // Set based on auth
    };
  },
  methods: {
    async submitJoinRequest() {
      this.submitting = true;
      this.successMessage = "";
      this.errorMessage = "";
      try {
        await axios.post(`${API_BASE_URL}/membership/join/`, this.joinForm);
        this.successMessage = "Your request has been submitted successfully! We'll contact you soon.";
        this.joinForm = {
          full_name: "",
          email: "",
          phone: "",
          role: "chorister",
          experience: "",
        };
        setTimeout(() => { this.successMessage = ""; }, 5000);
      } catch (err) {
        this.errorMessage = err.response?.data?.detail || "Failed to submit request. Please try again.";
      } finally {
        this.submitting = false;
      }
    },

    async loadRequests() {
      if (!this.isAdmin) return;
      this.loading = true;
      try {
        const params = {};
        if (this.filters.status) params.status = this.filters.status;
        if (this.filters.role) params.role = this.filters.role;
        const res = await axios.get(`${API_BASE_URL}/membership/join/requests/`, { params });
        this.requests = res.data;
      } catch (err) {
        console.error("Failed to load requests:", err);
        this.errorMessage = "Failed to load membership requests.";
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(id, status) {
      try {
        await axios.patch(`${API_BASE_URL}/membership/join/requests/${id}/`, { status });
        this.requests = this.requests.map((r) =>
          r.id === id ? { ...r, status, processed_by: { username: "You" } } : r
        );
      } catch (err) {
        console.error("Failed to update status:", err);
        this.errorMessage = "Failed to update request status.";
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  mounted() {
    if (this.isAdmin) this.loadRequests();
  },
};
</script>

<style scoped>
.membership-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
 
}

/* Section Styles */
.submission-section,
.admin-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #718096;
  font-size: 1.1rem;
}

/* Form Styles */
.join-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Button Styles */
.submit-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-loading {
  background: #a0aec0;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Filters */
.filters-container {
  display: flex;
  gap: 1rem;
  align-items: end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.refresh-button {
  padding: 0.5rem 1rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.refresh-button:hover {
  background: #38a169;
}

/* Table Styles */
.table-container {
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.requests-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.requests-table th {
  background: #f7fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.requests-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.request-row:hover {
  background: #f7fafc;
}

/* Badge Styles */
.role-badge,
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.chorister { background: #bee3f8; color: #2c5282; }
.role-badge.instrumentalist { background: #c6f6d5; color: #276749; }
.role-badge.supporter { background: #faf089; color: #744210; }

.status-badge.pending { background: #fefcbf; color: #744210; }
.status-badge.approved { background: #c6f6d5; color: #276749; }
.status-badge.rejected { background: #fed7d7; color: #c53030; }

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-approve,
.btn-reject {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
}

.btn-approve {
  background: #48bb78;
  color: white;
}

.btn-approve:hover {
  background: #38a169;
  transform: translateY(-1px);
}

.btn-reject {
  background: #f56565;
  color: white;
}

.btn-reject:hover {
  background: #e53e3e;
  transform: translateY(-1px);
}

.no-actions {
  color: #a0aec0;
  font-style: italic;
}

/* Alert Styles */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-success {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  color: #276749;
}

.alert-error {
  background: #fff5f5;
  border: 1px solid #fc8181;
  color: #c53030;
}

/* State Styles */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-state i {
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #4a5568;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .membership-page {
    padding: 1rem 0.5rem;
  }
  
  .submission-section,
  .admin-section {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .requests-table {
    font-size: 0.875rem;
  }
  
  .requests-table th,
  .requests-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact-cell .contact-info {
    font-size: 0.8rem;
  }
  
  .role-badge,
  .status-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>