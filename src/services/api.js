// src/services/api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// -----------------------------
// Request interceptor
// -----------------------------
apiClient.interceptors.request.use(
  config => {
    const publicEndpoints = [
      '/users/login/',
      '/users/register/',
      '/users/password-reset/',
      '/users/password-reset/confirm/',
      '/donations/',
      '/donations/summary/',
      '/contact/submit/',
      '/events/',
      '/gallery/items/',
      '/rentals/items/',
      '/rentals/orders/',
      '/membership/join/',
      '/shop/'
    ]

    // Attach JWT only for protected endpoints
    if (!publicEndpoints.includes(config.url)) {
      const token = localStorage.getItem('access_token')
      if (token) config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// -----------------------------
// Response interceptor
// -----------------------------
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth helper

export const authHelper = {
  getCurrentUser() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
  storeAuthData(response) {
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user_data', JSON.stringify(response.data.user))
    }
  },
  clearAuthData() {
    localStorage.clear()
  },
}

// API Service

export const apiService = {
  auth: {
    login: data => apiClient.post('/users/login/', data),
    register: data => apiClient.post('/users/register/', data),
    logout: () => apiClient.post('/users/logout/'),
    profile: () => apiClient.get('/users/profile/'),

    forgotPassword: data => apiClient.post('/users/password-reset/', data),
    resetPassword: data => apiClient.post('/users/password-reset/confirm/', data),

    resetPasswordConfirm: data =>
      apiClient.post('/users/password-reset/confirm/', {
        uid: data.uid,
        token: data.token,
        password: data.password,
      }),

    getCurrentUser: () => authHelper.getCurrentUser(),
  },

  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats/'),
  },

  choir: {
    getMembers: () => apiClient.get('/choir/members/'),
    getMember: id => apiClient.get(`/choir/members/${id}/`),
    createMember: data => apiClient.post('/choir/members/', data),
    updateMember: (id, data) => apiClient.patch(`/choir/members/${id}/`, data),
    getAttendance: (params = {}) => apiClient.get('/choir/attendance/', { params }),
    markAttendance: data => apiClient.post('/choir/attendance/', data),
    updateAttendance: (id, data) => apiClient.patch(`/choir/attendance/${id}/`, data),
    getAttendanceStats: () => apiClient.get('/choir/attendance/stats/'),
  },

  membership: {
    submitApplication: (data) => apiClient.post('/membership/join/', data),
    getApplications: (params = {}) => apiClient.get('/membership/join/requests/', { params }),
    updateApplication: (id, data) => apiClient.patch(`/membership/join/requests/${id}/`, data),
  },

  virtualPractice: {
    getPractices: (params = {}) => apiClient.get('/virtual_practice/practices/', { params }),
    getPractice: id => apiClient.get(`/virtual_practice/practices/${id}/`),
    createPractice: data => apiClient.post('/virtual_practice/practices/', data),
    updatePractice: (id, data) => apiClient.patch(`/virtual_practice/practices/${id}/`, data),
    deletePractice: id => apiClient.delete(`/virtual_practice/practices/${id}/`),
    markAttendance: practiceId => apiClient.post(`/virtual_practice/practices/${practiceId}/mark_attendance/`),
    getAttendance: (params = { ordering: '-timestamp', page_size: 5 }) =>
      apiClient.get('/virtual_practice/attendance/', { params }),
    getRecentAttendance: (params = { ordering: '-timestamp', page_size: 5 }) =>
      apiClient.get('/virtual_practice/attendance/', { params }),
  },

  donations: {
    createDonation: data => apiClient.post('/donations/', data),
    getDonations: (params = {}) => apiClient.get('/donations/', { params }),
    getSummary: () => apiClient.get('/donations/summary/'),
    getLatest: () => apiClient.get('/donations/latest/'),
    getDonation: id => apiClient.get(`/donations/${id}/`),
    getTiers: () => apiClient.get('/donations/tiers/'),
  },

  gallery: {
    getItems: (params = {}) => apiClient.get('/gallery/items/', { params }),
    getItem: id => apiClient.get(`/gallery/items/${id}/`),
    createItem: data =>
      apiClient.post('/gallery/items/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateItem: (id, data) =>
      apiClient.patch(`/gallery/items/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteItem: id => apiClient.delete(`/gallery/items/${id}/`),
  },

rentals: {
  getItems: (params = {}) => apiClient.get('/rentals/items/', { params }),
  getItem: id => apiClient.get(`/rentals/items/${id}/`),
  getCategories: (params = {}) => apiClient.get('/rentals/categories/', { params }), // Add this
  createOrder: data => apiClient.post('/rentals/orders/', data),
},

events: {
  getAll: (params = {}) => apiClient.get('/events/', { params }),
  getItem: (id) => apiClient.get(`/events/${id}/`),
  createEvent: (data) => apiClient.post('/events/', data),
  updateEvent: (id, data) => apiClient.patch(`/events/${id}/`, data),
  deleteEvent: (id) => apiClient.delete(`/events/${id}/`),
  //Get upcoming events
  getUpcomingEvents: (params = {}) => {
    return apiClient.get('/events/upcoming/', { params })
  },

  //RSVP to an event
  rsvpToEvent: (eventId, data) => {
    return apiClient.post('/events/${eventId}/rsvp/', data)
  },

  //Get event details
  getEvent: (eventId) => {
    return apiClient.get('/events/${eventId}/')
  }
},

shop: {
  getProducts: (params = {}) => apiClient.get('/shop/products/', { params }),
  getCategories: () => apiClient.get('/shop/categories/'),
  createOrder: (data) => apiClient.post('/shop/orders/', data),
  getOrders: (params = {}) => apiClient.get('/shop/orders/', { params }),
  getOrder: (id) => apiClient.get(`/shop/orders/${id}/`),
  updateOrder: (id, data) => apiClient.patch(`/shop/orders/${id}/`, data),
},

contact: {
    submit: (data) => apiClient.post('/contact/submit/', data),
  },
}

export default apiClient
