<!-- src/components/common/Navbar.vue -->
<template>
  <nav 
    class="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar" 
    :class="{ 'navbar-scrolled': isScrolled }"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="container">
      <router-link 
        to="/" 
        class="navbar-brand d-flex align-items-center" 
        aria-label="Angels Voices Choir System - Home"
      >
        <!-- Choir Logo -->
        <img 
          src="@/assets/images/logo.png" 
          alt="Angels Voices Choir Logo" 
          class="choir-logo me-2"
        />
        <!-- Optional text next to logo -->
        <span class="brand-text fw-semibold">Angels Voices Choir</span>
      </router-link>


      <!-- Mobile Toggle -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        :aria-expanded="navbarExpanded"
        :aria-label="navbarExpanded ? 'Close main menu' : 'Open main menu'"
        @click="toggleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Content -->
      <div 
        id="navbarContent" 
        class="collapse navbar-collapse"
        :class="{ show: navbarExpanded }"
      >
        <!-- Public Navigation -->
        <ul class="navbar-nav me-auto" v-if="!isAuthenticated" role="menubar">
          <li class="nav-item" role="none" v-for="item in publicNavItems" :key="item.route">
            <router-link 
              :to="item.route" 
              class="nav-link"
              :class="{ active: isActiveRoute(item.route) }"
              role="menuitem"
              :aria-current="isActiveRoute(item.route) ? 'page' : null"
            >
              <i :class="item.icon" aria-hidden="true"></i>{{ item.name }}
            </router-link>
          </li>
        </ul>

        <!-- Authenticated User Navigation -->
        <ul class="navbar-nav me-auto" v-else role="menubar">
          <li class="nav-item" role="none">
            <router-link 
              to="/dashboard" 
              class="nav-link"
              :class="{ active: isActiveRoute('/dashboard') }"
              role="menuitem"
              :aria-current="isActiveRoute('/dashboard') ? 'page' : null"
            >
              <i class="fas fa-tachometer-alt me-1" aria-hidden="true"></i>Dashboard
            </router-link>
          </li>
          
          <!-- Choir Management -->
          <li class="nav-item dropdown" role="none">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              :aria-expanded="false"
              aria-haspopup="true"
              id="choirDropdown"
            >
              <i class="fas fa-users me-1" aria-hidden="true"></i>Choir
            </a>
            <ul class="dropdown-menu" aria-labelledby="choirDropdown" role="menu">
              <li role="none" v-for="item in choirMenuItems" :key="item.route">
                <router-link 
                  :to="item.route" 
                  class="dropdown-item" 
                  role="menuitem"
                  @click="closeDropdowns"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Resources Dropdown -->
          <li class="nav-item dropdown" role="none">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              :aria-expanded="false"
              aria-haspopup="true"
              id="resourcesDropdown"
            >
              <i class="fas fa-boxes me-1" aria-hidden="true"></i>Resources
            </a>
            <ul class="dropdown-menu" aria-labelledby="resourcesDropdown" role="menu">
              <li role="none" v-for="item in resourcesMenuItems" :key="item.route">
                <router-link 
                  :to="item.route" 
                  class="dropdown-item" 
                  role="menuitem"
                  @click="closeDropdowns"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Additional member links -->
          <li class="nav-item" role="none" v-for="item in memberNavItems" :key="item.route">
            <router-link 
              :to="item.route" 
              class="nav-link"
              :class="{ active: isActiveRoute(item.route) }"
              role="menuitem"
              :aria-current="isActiveRoute(item.route) ? 'page' : null"
            >
              <i :class="item.icon" aria-hidden="true"></i>{{ item.name }}
            </router-link>
          </li>
        </ul>

        <!-- User Menu -->
        <ul class="navbar-nav ms-auto">
          <template v-if="!isAuthenticated">
            <!-- Public User Actions -->
            <li class="nav-item" role="none">
              <router-link to="/auth/login" class="nav-link" role="menuitem">
                <i class="fas fa-sign-in-alt me-1" aria-hidden="true"></i>Login
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link to="/join" class="btn btn-outline-light btn-sm ms-2" role="button">
                <i class="fas fa-user-plus me-1" aria-hidden="true"></i>Join Choir
              </router-link>
            </li>
          </template>
          <template v-else>
            <!-- Notifications -->
            <li class="nav-item dropdown" role="none">
              <a 
                class="nav-link position-relative" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                :aria-expanded="false"
                aria-haspopup="true"
                :aria-label="`${unreadNotifications} unread notifications`"
                id="notificationsDropdown"
              >
                <i class="fas fa-bell" aria-hidden="true"></i>
                <span 
                  v-if="unreadNotifications > 0" 
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  aria-live="polite"
                >
                  {{ unreadNotifications }}
                </span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown" role="menu">
                <li><h6 class="dropdown-header">Notifications</h6></li>
                <li v-if="notifications.length === 0" role="none">
                  <span class="dropdown-item-text text-muted">No new notifications</span>
                </li>
                <li v-for="notification in visibleNotifications" :key="notification.id" role="none">
                  <a 
                    class="dropdown-item" 
                    href="#"
                    role="menuitem"
                    @click="handleNotificationClick(notification)"
                  >
                    <small class="d-block">{{ notification.message }}</small>
                    <small class="text-muted">{{ notification.time }}</small>
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li role="none">
                  <router-link to="/notifications" class="dropdown-item" role="menuitem">
                    View All Notifications
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- User Profile Dropdown -->
            <li class="nav-item dropdown" role="none">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                :aria-expanded="false"
                aria-haspopup="true"
                :aria-label="`User menu for ${currentUser?.username}`"
                id="userDropdown"
              >
                <div class="user-avatar me-2">
                  <i class="fas fa-user" aria-hidden="true"></i>
                </div>
                <div class="user-info">
                  <div class="user-name">{{ currentUser?.username }}</div>
                  <div class="user-role text-small">{{ userRole }}</div>
                </div>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" role="menu">
                <li role="none">
                  <router-link to="/profile" class="dropdown-item" role="menuitem">
                    <i class="fas fa-user me-2" aria-hidden="true"></i>My Profile
                  </router-link>
                </li>
                <li role="none">
                  <router-link to="/settings" class="dropdown-item" role="menuitem">
                    <i class="fas fa-cog me-2" aria-hidden="true"></i>Settings
                  </router-link>
                </li>
                
                <!-- Admin/Leader Links -->
                <template v-if="isAdmin || isChoirLeader">
                  <li role="none"><hr class="dropdown-divider"></li>
                  <li><h6 class="dropdown-header">Administration</h6></li>
                  <li role="none" v-if="isAdmin">
                    <router-link to="/admin/dashboard" class="dropdown-item" role="menuitem">
                      <i class="fas fa-shield-alt me-2" aria-hidden="true"></i>Admin Panel
                    </router-link>
                  </li>
                  <li role="none">
                    <router-link to="/transactions" class="dropdown-item" role="menuitem">
                      <i class="fas fa-receipt me-2" aria-hidden="true"></i>Transactions
                    </router-link>
                  </li>
                  <li role="none">
                    <router-link to="/reports" class="dropdown-item" role="menuitem">
                      <i class="fas fa-chart-bar me-2" aria-hidden="true"></i>Reports
                    </router-link>
                  </li>
                </template>

                <li role="none"><hr class="dropdown-divider"></li>
                <li role="none">
                  <button 
                    @click="handleLogout" 
                    class="dropdown-item text-danger" 
                    role="menuitem"
                    aria-label="Logout from system"
                  >
                    <i class="fas fa-sign-out-alt me-2" aria-hidden="true"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { authHelper } from '@/services/api'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isScrolled = ref(false)
    const navbarExpanded = ref(false)

    // Sample notifications data
    const notifications = ref([
      { id: 1, message: 'New practice session scheduled', time: '2 hours ago', read: false, action: '/events' },
      { id: 2, message: 'Your rental request was approved', time: '1 day ago', read: false, action: '/rentals' }
    ])

    // Navigation data
    const publicNavItems = Object.freeze([
      { name: 'Home', route: '/', icon: 'fas fa-home me-1' },
      { name: 'About', route: '/about', icon: 'fas fa-info-circle me-1' },
      { name: 'Gallery', route: '/gallery', icon: 'fas fa-images me-1' },
      { name: 'Events', route: '/events', icon: 'fas fa-calendar-alt me-1' },
      { name: 'Shop', route: '/shop', icon: 'fas fa-store me-1' },
      { name: 'Rentals', route: '/rentals/public', icon: 'fas fa-chair me-1' },
      { name: 'Support Us', route: '/donations', icon: 'fas fa-hand-holding-heart me-1' },
      {name: 'Contact Us', route: '/contact', icon: 'fas fa-envelope me-1'}
    ])

    const choirMenuItems = Object.freeze([
      { name: 'ChoirMembers', route: '/choir' },
      { name: 'Attendance', route: '/choir/' },
      { name: 'Voice Sections', route: '/choir/sections' },
      { name: 'Reports', route: '/choir/reports' }
    ])

    const resourcesMenuItems = Object.freeze([
      { name: 'Inventory', route: '/inventory' },
      { name: 'Rentals', route: '/rentals' },
      { name: 'Music Library', route: '/library' }
    ])

    const memberNavItems = Object.freeze([
      { name: 'Practice', route: '/virtual-practice', icon: 'fas fa-video me-1' },
      { name: 'Membership', route: '/membership', icon: 'fas fa-id-card me-1' },
      { name: 'Gallery', route: '/gallery', icon: 'fas fa-images me-1' },
      { name: 'Shop', route: '/shop', icon: 'fas fa-store me-1' },
      { name: 'Contact Us', route: '/contact', icon: 'fas fa-envelope me-1' }
    ])

    // Computed properties
    const isAuthenticated = computed(() => authHelper.isAuthenticated())
    const currentUser = computed(() => authHelper.getCurrentUser())
    const userRole = computed(() => {
      const user = currentUser.value
      if (user?.is_admin) return 'Administrator'
      if (user?.is_choir_leader) return 'Choir Leader'
      if (user?.is_choir_member) return 'Choir Member'
      return 'Guest'
    })
    const isAdmin = computed(() => currentUser.value?.is_admin)
    const isChoirLeader = computed(() => currentUser.value?.is_choir_leader)
    const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length)
    const visibleNotifications = computed(() => notifications.value.slice(0, 5))

    // Methods
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const toggleNavbar = () => {
      navbarExpanded.value = !navbarExpanded.value
    }

    const closeNavbar = () => {
      navbarExpanded.value = false
    }

    const closeDropdowns = () => {
      // Close Bootstrap dropdowns
      const dropdowns = document.querySelectorAll('.dropdown-menu.show')
      dropdowns.forEach(dropdown => {
        const parent = dropdown.closest('.dropdown')
        if (parent) {
          const toggle = parent.querySelector('.dropdown-toggle')
          if (toggle) {
            bootstrap.Dropdown.getInstance(toggle)?.hide()
          }
        }
      })
      closeNavbar()
    }

    const isActiveRoute = (routePath) => {
      return route.path === routePath || route.path.startsWith(routePath + '/')
    }

    const handleLogout = () => {
      authHelper.clearAuthData()
      closeNavbar()
      router.push('/')
    }

    const handleNotificationClick = (notification) => {
      notification.read = true
      if (notification.action) {
        router.push(notification.action)
      }
      closeDropdowns()
    }

    // Event listeners
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      // Close navbar when clicking outside
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar')) {
          closeNavbar()
        }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled,
      navbarExpanded,
      notifications,
      publicNavItems,
      choirMenuItems,
      resourcesMenuItems,
      memberNavItems,
      isAuthenticated,
      currentUser,
      userRole,
      isAdmin,
      isChoirLeader,
      unreadNotifications,
      visibleNotifications,
      toggleNavbar,
      closeNavbar,
      closeDropdowns,
      isActiveRoute,
      handleLogout,
      handleNotificationClick
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #764ba2 100%) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  padding: 0.4rem 0; /* reduced padding */
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.navbar-scrolled {
  background: rgba(var(--bs-primary-rgb), 0.95) !important;
  padding: 0.3rem 0;
  backdrop-filter: blur(15px);
}

.choir-logo {
  height: 32px; /* smaller logo */
  width: auto;
}

.brand-text {
  font-size: 1rem; /* smaller text */
  line-height: 1;
}

.navbar-nav .nav-link {
  font-weight: 500;
  padding: 0.3rem 0.8rem; /* compact padding */
  margin: 0 0.15rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  position: relative;
  font-size: 0.875rem; /* slightly smaller font */
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link:focus {
  background: rgba(255, 255, 255, 0.08);
}

.navbar-nav .nav-link.active {
  background: rgba(255, 255, 255, 0.12);
  font-weight: 600;
}

.navbar-nav .nav-link.active::after {
  width: 15px; /* smaller underline */
  height: 2px;
}

.user-avatar {
  width: 28px;
  height: 28px;
}

.user-info {
  line-height: 1;
}

.user-name {
  font-size: 0.8rem;
}

.user-role {
  font-size: 0.7rem;
}

.dropdown-menu {
  border-radius: 0.35rem;
  padding: 0.25rem 0;
}

.dropdown-item {
  padding: 0.35rem 1rem;
  font-size: 0.85rem;
}

.badge {
  font-size: 0.55rem;
  padding: 0.2em 0.35em;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    padding: 0.5rem 0;
  }
  
  .nav-link {
    margin: 0.1rem 0;
    padding: 0.25rem 0.75rem;
  }

  .user-info {
    display: none;
  }
}
</style>
