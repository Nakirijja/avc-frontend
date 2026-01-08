// src/helpers/authHelper.js

// Simple authentication helper
const authHelper = {
  // Check if user is authenticated
  isAuthenticated: () => {
    // Check for token in localStorage
    const token = localStorage.getItem('auth_token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return !!(token && user)
  },
  
  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },
  
  // Get auth token
  getToken: () => {
    return localStorage.getItem('auth_token')
  },
  
  // Login helper
  login: (token, userData) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(userData))
  },
  
  // Logout helper
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },
  
  // Check if user has specific role
  hasRole: (role) => {
    const user = authHelper.getCurrentUser()
    return user && user.role === role
  },
  
  // Check if user is admin
  isAdmin: () => {
    return authHelper.hasRole('admin')
  },
  
  // Check if user is member
  isMember: () => {
    return authHelper.hasRole('member')
  }
}

export default authHelper