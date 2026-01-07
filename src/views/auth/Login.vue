<!-- src/views/auth/Login.vue -->
<template>
  <div class="auth-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <i class="fas fa-music fa-3x text-primary mb-3"></i>
                <h2 class="h3 fw-bold">Welcome to AVC Choir</h2>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    class="form-control form-control-lg"
                    v-model="form.email"
                    placeholder="your@email.com"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control form-control-lg"
                    v-model="form.password"
                    placeholder="Enter your password"
                    required
                  >
                </div>

                <!-- Forgot Password link -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" v-model="form.remember">
                    <label class="form-check-label">Remember me</label>
                  </div>
                  <router-link 
                    to="/auth/forgot-password" 
                    class="text-decoration-none small text-primary fw-semibold"
                  >
                    Forgot Password?
                  </router-link>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 py-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>

                <!-- Error Message -->
                <div v-if="error" class="alert alert-danger mt-3">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>
              </form>

              <!-- Register redirect -->
              <div class="text-center mt-4">
                <p class="mb-0">
                  Don't have an account? 
                  <router-link to="/auth/register" class="text-decoration-none fw-semibold">
                    Sign up here
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService, authHelper } from '@/services/api'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''

      try {
        console.log('Attempting login...')
        const response = await apiService.auth.login(this.form)
        console.log('Login response:', response)
        
        authHelper.storeAuthData(response)
        this.$router.push('/dashboard')
        
      } catch (error) {
        console.error('Login error:', error)
        this.error = error.response?.data?.detail || 'Login failed. Please check your credentials.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border-radius: 15px;
  border: none;
}
</style>
