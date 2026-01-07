<template>
  <div class="reset-password-page d-flex align-items-center justify-content-center" style="min-height: calc(100vh - 80px);">
    <div class="card p-4 p-md-5 shadow-sm w-100" style="max-width: 400px;">
      <h2 class="text-center mb-4">Reset Password</h2>

      <p v-if="message" class="text-success mb-3">{{ message }}</p>
      <p v-if="error" class="text-danger mb-3">{{ error }}</p>

      <form @submit.prevent="handleResetPassword" v-if="!message">
        <div class="mb-3">
          <label for="password" class="form-label">New Password</label>
          <input id="password" v-model="password" type="password" required class="form-control" placeholder="Enter new password" />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" required class="form-control" placeholder="Confirm new password" />
        </div>
        <button type="submit" :disabled="loading" class="btn btn-primary w-100">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div v-if="message" class="mt-3">
        <button @click="goToLogin" class="btn btn-secondary w-100">Go to Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/api'

export default {
  name: 'ResetPassword',
  data() {
    return {
      uid: this.$route.query.uid || '',
      token: this.$route.query.token || '',
      password: '',
      confirmPassword: '',
      message: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleResetPassword() {
      this.error = ''
      this.message = ''

      if (!this.uid || !this.token) {
        this.error = '❌ Invalid or expired password reset link.'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.error = '❌ Passwords do not match.'
        return
      }

      this.loading = true
      try {
        await apiService.auth.resetPasswordConfirm({
          uid: this.uid,
          token: this.token,
          password: this.password,
        
        })

        this.message = '✅ Password reset successful!'
      } catch (err) {
        console.error(err)
        this.error =
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          '❌ Failed to reset password. The link may have expired.'
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      this.$router.push('/auth/login')
    }
  }
}
</script>

<style scoped>
.reset-password-page {
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  padding: 1rem;
}
.card { border-radius: 1rem; }
</style>
