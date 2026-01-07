<!-- src/views/auth/Register.vue -->
<template>
  <div class="auth-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">

              <!-- Header -->
              <div class="text-center mb-4">
                <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                <h2 class="h3 fw-bold">Join Angels Voices Choir</h2>
                <p class="text-muted">Create your account to get started</p>
              </div>

              <!-- Registration Form -->
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">First Name</label>
                      <input 
                        type="text" 
                        class="form-control"
                        v-model="form.first_name"
                        placeholder="Enter your first name"
                        required
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Last Name</label>
                      <input 
                        type="text" 
                        class="form-control"
                        v-model="form.last_name"
                        placeholder="Enter your last name"
                        required
                      >
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input 
                    type="text" 
                    class="form-control"
                    v-model="form.username"
                    placeholder="Choose a username"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    class="form-control"
                    v-model="form.email"
                    placeholder="your@email.com"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control"
                    v-model="form.password"
                    placeholder="Create a password"
                    required
                    minlength="8"
                  >
                  <div class="form-text">Password must be at least 8 characters long</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    v-model="form.phone_number"
                    placeholder="+256 XXX XXX XXX"
                  >
                </div>

                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" v-model="form.agree_terms" required>
                  <label class="form-check-label">
                    I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 py-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>

                <!-- Error Message -->
                <div v-if="error" class="alert alert-danger mt-3">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>
              </form>

              <div class="text-center mt-4">
                <p class="mb-0">
                  Already have an account? 
                  <router-link to="/auth/login" class="text-decoration-none fw-semibold">
                    Sign in here
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
import { apiService } from '@/services/api'

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        agree_terms: false
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = ''

      try {
        // Frontend validations
        if (!this.form.agree_terms) {
          this.error = 'Please agree to the terms and conditions.'
          this.loading = false
          return
        }

        if (this.form.password.length < 8) {
          this.error = 'Password must be at least 8 characters long.'
          this.loading = false
          return
        }

        // Build payload matching backend serializer
        const payload = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          password_confirm: this.form.password,
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          phone_number: this.form.phone_number || '',
          address: this.form.address || '',
          date_of_birth: this.form.date_of_birth || null
        }

        const response = await apiService.auth.register(payload)
        console.log('Registration successful:', response)

        // Redirect to login page with optional success message
        this.$router.push({ 
          path: '/auth/login', 
          query: { success: 'Registration successful! Please log in.' } 
        })

      } catch (error) {
        console.error('Registration error:', error)
        if (error.response && error.response.data) {
          const data = error.response.data
          this.error =
            data.password?.[0] ||
            data.password_confirm?.[0] ||
            data.email?.[0] ||
            data.username?.[0] ||
            data.detail ||
            'Registration failed. Please check your input.'
        } else {
          this.error = 'Registration failed. Please try again later.'
        }
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
