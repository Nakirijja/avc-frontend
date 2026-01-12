import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { authHelper } from '@/services/api'

const routes = [
  // Home
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },

  // About & Contact
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  },

  // Authentication
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue')
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPassword.vue')
  },

  // Profile
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },

  // Dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('../views/Join.vue') 
  },

  // Choir
  {
    path: '/choir',
    name: 'Choir',
    component: () => import('@/views/choir/Choir.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/choir-members',
    name: 'ChoirMembers',
    component: () => import('@/views/choir/ChoirMembers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('@/views/choir/Attendance.vue'),
    meta: { requiresAuth: true }
  },

  // Donations
  {
    path: '/donations',
    name: 'Donations',
    component: () => import('@/views/donations/Donate.vue')
  },

  // Events
{
  path: '/events',
  name: 'PublicEvents',
  component: () => import('@/views/events/PublicEvents.vue'),
  beforeEnter: (to, from, next) => {
    if (authHelper.isAuthenticated()) {
      // Redirect logged-in users to the dashboard events page
      next({ name: 'Events' })
    } else {
      next()
    }
  }
},

// Public Event Detail Page
{
  path: '/events/:id',
  name: 'EventDetail',
  component: () => import('@/views/events/EventDetail.vue'),
  props: true
},

{
  path: '/dashboard/events',
  name: 'Events',
  component: () => import('@/views/events/Events.vue'),
  meta: { requiresAuth: true }
},


  // Gallery
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/views/gallery/Gallery.vue')
  },

  // Inventory
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/inventory/Inventory.vue'),
    meta: { requiresAuth: true }
  },

  // Membership
  {
    path: '/membership',
    name: 'Membership',
    component: () => import('@/views/membership/Membership.vue'),
    meta: { requiresAuth: true }
  },

  // Notifications
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/notifications/Notifications.vue'),
    meta: { requiresAuth: true }
  },

 // Rentals
  {
    path: '/rentals',
    name: 'Rentals',
    component: () => import('@/views/rentals/Rentals.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rentals/public',
    name: 'PublicRentals',
    component: () => import('@/views/rentals/PublicRentals.vue'),
    beforeEnter: (to, from, next) => {
      if (authHelper.isAuthenticated()) next({ name: 'Rentals' }) 
      else next()
    }
  },

  // Shop
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/shop/Shop.vue')
  },

  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/shop/Checkout.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/shop/Orders.vue'),
    meta: { requiresAuth: true }
  },

  // Transactions
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/transactions/Transactions.vue'),
    meta: { requiresAuth: true }
  },

  // Virtual Practices
  {
    path: '/virtual-practice',
    name: 'VirtualPractice',
    component: () => import('@/views/virtual-practice/VirtualPractice.vue'),
    meta: { requiresAuth: true }
  },

  // Fallback route
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !authHelper.isAuthenticated()) {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
