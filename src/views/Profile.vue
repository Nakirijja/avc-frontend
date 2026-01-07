<!-- src/views/Profile.vue -->
<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="bg-primary text-white py-4 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-0">
              <i class="fas fa-user me-2"></i>My Profile
            </h1>
            <p class="mb-0">Manage your account information</p>
          </div>
          <div class="col-auto">
            <button class="btn btn-light" @click="$router.push('/dashboard')">
              <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <!-- Profile Info -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Personal Information</h5>
            </div>
            <div class="card-body">
              <div v-if="user" class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Username</label>
                  <p class="form-control-plaintext">{{ user.username }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <p class="form-control-plaintext">{{ user.email }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Member Since</label>
                  <p class="form-control-plaintext">{{ formatDate(user.created_at) }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Role</label>
                  <p class="form-control-plaintext">
                    <span class="badge bg-primary">
                      {{ getUserRole() }}
                    </span>
                  </p>
                </div>
              </div>
              
              <div v-else class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary text-start">
                  <i class="fas fa-edit me-2"></i>Edit Profile
                </button>
                <button class="btn btn-outline-primary text-start">
                  <i class="fas fa-lock me-2"></i>Change Password
                </button>
                <button class="btn btn-outline-primary text-start">
                  <i class="fas fa-bell me-2"></i>Notification Settings
                </button>
                <button @click="handleLogout" class="btn btn-outline-danger text-start mt-3">
                  <i class="fas fa-sign-out-alt me-2"></i>Logout
                </button>
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
  name: 'ProfileView',
  data() {
    return {
      user: null,
      loading: false
    }
  },
  mounted() {
    this.loadUserProfile()
  },
  methods: {
    loadUserProfile() {
      this.user = authHelper.getCurrentUser()
      if (!this.user) {
        this.$router.push('/auth/login')
      }
    },
    
    getUserRole() {
      if (this.user?.is_admin) return 'Administrator'
      if (this.user?.is_choir_leader) return 'Choir Leader'
      if (this.user?.is_choir_member) return 'Choir Member'
      return 'Member'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      return new Date(dateString).toLocaleDateString()
    },
    
    handleLogout() {
      authHelper.clearAuthData()
      this.$router.push('/auth/login')
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.form-control-plaintext {
  padding: 0.375rem 0;
  margin-bottom: 0;
  line-height: 1.5;
  background-color: transparent;
  border: solid transparent;
  border-width: 1px 0;
}
</style>