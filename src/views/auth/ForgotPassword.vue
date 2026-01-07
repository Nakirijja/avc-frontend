<template>
  <div class="forgot-password-page d-flex align-items-center justify-content-center" style="min-height: calc(100vh - 80px);">
    <div class="card p-4 p-md-5 shadow-sm w-100" style="max-width: 400px;">
      <h2 class="text-center mb-4">Forgot Password</h2>

      <p v-if="message" class="text-success mb-3">{{ message }}</p>
      <p v-if="error" class="text-danger mb-3">{{ error }}</p>

      <form @submit.prevent="handleForgotPassword" v-if="!message">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" v-model="email" type="email" required autofocus class="form-control" placeholder="Enter your email" />
        </div>
        <button type="submit" :disabled="loading" class="btn btn-primary w-100">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/api'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      message: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleForgotPassword() {
      this.error = ''
      this.message = ''
      this.loading = true
      try {
        // Backend generates link with UID encoded, no frontend changes needed
        await apiService.auth.forgotPassword({ email: this.email })
        this.message = '✅ Reset link sent! Check your email.'
      } catch (err) {
        this.error = err.response?.data?.detail || '❌ Failed to send reset link.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}
.card { border-radius: 1rem; }
</style>
