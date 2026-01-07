import { defineStore } from 'pinia'
import axios from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken'),
    isAuthenticated: !!localStorage.getItem('authToken'),
    isLoading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.is_admin || false,
    userName: (state) => state.user?.username || state.user?.email || 'User'
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      try {
        const response = await axios.post('/api/auth/login/', credentials)
        const { token, user } = response.data
        
        this.setAuthData(token, user)
        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed'
        return { success: false, error: errorMessage }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      try {
        const response = await axios.post('/api/auth/register/', userData)
        const { token, user } = response.data
        
        this.setAuthData(token, user)
        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed'
        return { success: false, error: errorMessage }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await axios.post('/api/auth/logout/')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    async checkAuth() {
      if (!this.token) return

      try {
        const response = await axios.get('/api/auth/user/')
        this.user = response.data
        this.isAuthenticated = true
      } catch (error) {
        this.clearAuth()
      }
    },

    setAuthData(token, user) {
      this.token = token
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('authToken', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('authToken')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})