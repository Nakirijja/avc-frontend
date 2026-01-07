<!-- src/components/common/Sidebar.vue -->
<template>
  <aside 
    class="sidebar" 
    :class="{ 
      collapsed: !sidebarOpen,
      'sidebar-mobile-open': mobileSidebarOpen
    }"
    role="complementary"
    aria-label="Main navigation sidebar"
  >
    <div class="sidebar-header">
      <div class="logo" v-if="sidebarOpen">
        <img 
          src="@/assets/images/logo.png" 
          alt="AVC Choir Logo" 
          class="logo-img"
          @error="handleImageError"
        >
        <span class="logo-text">AVC Dashboard</span>
      </div>
      <button 
        class="toggle-btn" 
        @click="toggleSidebar"
        :aria-label="sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        :aria-expanded="sidebarOpen"
      >
        <i 
          class="fas" 
          :class="sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'" 
          aria-hidden="true"
        ></i>
      </button>
    </div>

    <nav class="sidebar-nav" role="navigation" aria-label="Sidebar navigation">
      <div class="nav-section">
        <div class="nav-title" v-if="sidebarOpen">Main</div>
        <ul class="nav-links" role="menubar">
          <li role="none">
            <router-link 
              to="/dashboard" 
              class="nav-link" 
              :class="{ active: isActiveRoute('Dashboard') }"
              role="menuitem"
              :aria-current="isActiveRoute('Dashboard') ? 'page' : null"
              @click="closeMobileSidebar"
            >
              <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
              <span v-if="sidebarOpen">Dashboard</span>
            </router-link>
          </li>
          <li v-if="isAdmin" role="none">
            <router-link 
              to="/dashboard/admin" 
              class="nav-link" 
              :class="{ active: isActiveRoute('AdminDashboard') }"
              role="menuitem"
              :aria-current="isActiveRoute('AdminDashboard') ? 'page' : null"
              @click="closeMobileSidebar"
            >
              <i class="fas fa-cog" aria-hidden="true"></i>
              <span v-if="sidebarOpen">Admin Panel</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-title" v-if="sidebarOpen">Choir</div>
        <ul class="nav-links" role="menubar">
          <li v-for="item in choirNavItems" :key="item.route" role="none">
            <router-link 
              :to="item.route" 
              class="nav-link" 
              :class="{ active: isActiveRoute(item.name) }"
              role="menuitem"
              :aria-current="isActiveRoute(item.name) ? 'page' : null"
              @click="closeMobileSidebar"
            >
              <i :class="item.icon" aria-hidden="true"></i>
              <span v-if="sidebarOpen">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-title" v-if="sidebarOpen">Events</div>
        <ul class="nav-links" role="menubar">
          <li role="none">
            <router-link 
              to="/events" 
              class="nav-link"
              role="menuitem"
              @click="closeMobileSidebar"
            >
              <i class="fas fa-calendar" aria-hidden="true"></i>
              <span v-if="sidebarOpen">View Events</span>
            </router-link>
          </li>
          <li v-if="isAdmin" role="none">
            <button 
              class="nav-link create-event-btn" 
              @click="createEvent"
              role="menuitem"
              aria-label="Create new event"
            >
              <i class="fas fa-plus" aria-hidden="true"></i>
              <span v-if="sidebarOpen">Create Event</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-title" v-if="sidebarOpen">Account</div>
        <ul class="nav-links" role="menubar">
          <li role="none">
            <button 
              class="nav-link logout-btn" 
              @click="logout"
              role="menuitem"
              aria-label="Logout from system"
            >
              <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
              <span v-if="sidebarOpen">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <div class="sidebar-footer" v-if="sidebarOpen && currentUser">
      <div class="user-info">
        <img 
          :src="userAvatar" 
          :alt="`Profile picture of ${userName}`" 
          class="user-avatar"
          @error="handleAvatarError"
        >
        <div class="user-details">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </div>
    </div>

    <!-- Mobile overlay -->
    <div 
      v-if="mobileSidebarOpen" 
      class="sidebar-overlay"
      @click="closeMobileSidebar"
      aria-hidden="true"
    ></div>
  </aside>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

export default {
  name: 'Sidebar',
  setup() {
    const authStore = useAuthStore()
    const uiStore = useUIStore()
    const router = useRouter()
    const route = useRoute()
    
    const mobileSidebarOpen = ref(false)
    const defaultAvatar = '/assets/images/avatars/default-avatar.jpg'

    // Navigation items
    const choirNavItems = Object.freeze([
      { route: '/dashboard/choir-members', name: 'ChoirMembers', icon: 'fas fa-users', label: 'Members' },
      { route: '/dashboard/attendance', name: 'Attendance', icon: 'fas fa-clipboard-check', label: 'Attendance' },
      { route: '/dashboard/recent-donations', name: 'RecentDonations', icon: 'fas fa-donate', label: 'Donations' }
    ])

    // Computed properties
    const sidebarOpen = computed(() => uiStore.sidebarOpen)
    const isAdmin = computed(() => authStore.isAdmin)
    const currentUser = computed(() => authStore.user)
    const userName = computed(() => authStore.userName || 'User')
    const userRole = computed(() => authStore.user?.is_admin ? 'Administrator' : 'Choir Member')
    const userAvatar = computed(() => authStore.user?.avatar || defaultAvatar)

    // Methods
    const toggleSidebar = () => {
      uiStore.toggleSidebar()
    }

    const closeMobileSidebar = () => {
      if (window.innerWidth <= 768) {
        mobileSidebarOpen.value = false
      }
    }

    const isActiveRoute = (routeName) => {
      return route.name === routeName
    }

    const logout = async () => {
      try {
        await authStore.logout()
        closeMobileSidebar()
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    const createEvent = () => {
      // Implement event creation logic
      console.log('Create event clicked')
      closeMobileSidebar()
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const handleAvatarError = (event) => {
      event.target.src = defaultAvatar
    }

    const handleResize = () => {
      if (window.innerWidth > 768) {
        mobileSidebarOpen.value = false
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && mobileSidebarOpen.value) {
        mobileSidebarOpen.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      window.addEventListener('resize', handleResize)
      document.addEventListener('keydown', handleEscapeKey)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleEscapeKey)
    })

    return {
      sidebarOpen,
      mobileSidebarOpen,
      isAdmin,
      currentUser,
      userName,
      userRole,
      userAvatar,
      choirNavItems,
      toggleSidebar,
      closeMobileSidebar,
      isActiveRoute,
      logout,
      createEvent,
      handleImageError,
      handleAvatarError
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  transition: transform 0.3s ease, width 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #34495e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-weight: bold;
  font-size: 1.1rem;
  color: #3498db;
}

.toggle-btn {
  background: none;
  border: none;
  color: #bdc3c7;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover,
.toggle-btn:focus {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-title {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #95a5a6;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: inherit;
  text-align: left;
}

.nav-link:hover,
.nav-link:focus {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: #3498db;
  outline: none;
}

.nav-link.active {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border-left-color: #3498db;
}

.nav-link i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.sidebar.collapsed .nav-link span {
  display: none;
}

.sidebar.collapsed .nav-title {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #34495e;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.8rem;
  color: #95a5a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .user-details {
  display: none;
}

.sidebar.collapsed .user-avatar {
  width: 32px;
  height: 32px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
  }

  .sidebar.sidebar-mobile-open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar.collapsed.sidebar-mobile-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .nav-link,
  .toggle-btn {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .sidebar {
    border-right: 2px solid #3498db;
  }
  
  .nav-link.active {
    outline: 2px solid #3498db;
  }
}

/* Print styles */
@media print {
  .sidebar {
    display: none;
  }
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: #34495e;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}
</style>