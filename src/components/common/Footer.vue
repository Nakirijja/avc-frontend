<!-- src/components/common/Footer.vue -->
<template>
  <footer 
    v-if="!hideFooter && !isErrorPage" 
    class="bg-dark text-light py-4 mt-auto"
    role="contentinfo"
    aria-label="Site footer"
  >
    <div class="container">
      <div class="row">
        
        <!-- Choir Brand Section -->
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="d-flex align-items-center mb-3">
            <i class="fas fa-music fa-2x text-primary me-3"></i>
            <div>
              <h2 class="h5 fw-bold mb-0">Angels Voices Choir</h2>
              <small class="text-muted">Kampala, Uganda</small>
            </div>
          </div>

          <p class="text-muted mb-3">
            Creating beautiful music together since 2010.
          </p>
          
          <!-- Social Links -->
          <h3 class="h6 text-primary fw-bold mb-2">Follow Us</h3>
          <div class="d-flex flex-wrap gap-2">

            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.comingSoon ? null : social.url"
              class="btn btn-outline-light btn-sm d-flex align-items-center justify-content-center rounded-circle position-relative"
              style="width: 45px; height: 45px;"
              :title="social.comingSoon ? `${social.name} (Coming Soon)` : social.name"
              :aria-label="social.comingSoon ? `${social.name} Coming Soon` : `Visit our ${social.name}`"
              :class="{ disabled: social.comingSoon }"
              :tabindex="social.comingSoon ? -1 : 0"
            >
              <i :class="social.icon"></i>

              <span 
                v-if="social.comingSoon" 
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
              >
                Soon
              </span>
            </a>

          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h3 class="h6 fw-bold text-primary mb-3">Quick Links</h3>
          <ul class="list-unstyled">
            <li v-for="link in publicLinks" :key="link.route" class="mb-2">
              <router-link 
                :to="link.route" 
                class="text-decoration-none link-light"
              >
                <i :class="`${link.icon} me-2`"></i>{{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Member Resources -->
        <div class="col-lg-3 col-md-6 mb-4" v-if="authStore.isAuthenticated">
          <h3 class="h6 fw-bold text-primary mb-3">Member Resources</h3>
          <ul class="list-unstyled">
            <li v-for="link in memberLinks" :key="link.route" class="mb-2">
              <router-link 
                :to="link.route" 
                class="text-decoration-none link-light"
              >
                <i :class="`${link.icon} me-2`"></i>{{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col-lg-3 col-md-6 mb-4">
          <h3 class="h6 fw-bold text-primary mb-3">Contact Info</h3>
          <address class="mb-0">
            <p class="mb-2">
              <i class="fas fa-map-marker-alt text-primary me-2"></i>
              Kampala, Uganda
            </p>
            <p class="mb-2">
              <i class="fas fa-phone text-primary me-2"></i>
              <a href="tel:+256700123456" class="link-light text-decoration-none">
                +256 700 123 456
              </a>
            </p>
            <p class="mb-2">
              <i class="fas fa-envelope text-primary me-2"></i>
              <a href="mailto:info@avcchoir.org" class="link-light text-decoration-none">
                info@avcchoir.org
              </a>
            </p>
            <p class="mb-2">
              <i class="fab fa-whatsapp text-primary me-2"></i>
              <a 
                href="https://wa.me/256700123456"
                target="_blank"
                class="link-light text-decoration-none"
              >
                WhatsApp Chat
              </a>
            </p>
            <p class="mb-2">
              <i class="fas fa-clock text-primary me-2"></i>
              Rehearsals: Wed 6–8PM
            </p>
          </address>
        </div>
      </div>

      <hr class="border-secondary">

      <!-- Footer Bottom -->
      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start">
          <p class="text-muted mb-0">
            &copy; {{ currentYear }} Angels Voices Choir. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-center text-md-end text-muted">
          v{{ appVersion }}
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

export default {
  name: 'AppFooter',
  props: {
    hideFooter: Boolean
  },
  setup() {
    const authStore = useAuthStore()
    const currentYear = computed(() => new Date().getFullYear())
    const appVersion = computed(() => import.meta.env.VITE_APP_VERSION || '1.0.0')

    return { authStore, currentYear, appVersion }
  },
  data() {
    return {
      socialLinks: [
        { name: 'TikTok', url: 'https://tiktok.com/@angelsvoiceschoir', icon: 'fab fa-tiktok', comingSoon: false },
        { name: 'WhatsApp', url: 'https://wa.me/256700123456', icon: 'fab fa-whatsapp', comingSoon: false },
        { name: 'Facebook', url: 'https://facebook.com/angelsvoiceschoir', icon: 'fab fa-facebook-f', comingSoon: false },
        { name: 'YouTube', url: 'https://youtube.com/c/angelsvoiceschoir', icon: 'fab fa-youtube', comingSoon: false },
        { name: 'Instagram', url: '#', icon: 'fab fa-instagram', comingSoon: true },
        { name: 'X (Twitter)', url: '#', icon: 'fab fa-x-twitter', comingSoon: true }
      ],
      publicLinks: [
        { name: 'Home', route: '/', icon: 'fas fa-home' },
        { name: 'About', route: '/about', icon: 'fas fa-info-circle' },
        { name: 'Events', route: '/events', icon: 'fas fa-calendar' },
        { name: 'Gallery', route: '/gallery', icon: 'fas fa-images' },
        { name: 'Contact', route: '/contact', icon: 'fas fa-envelope' }
      ]
    }
  },
  computed: {
    isErrorPage() {
      return this.$route.meta?.hideFooter || false
    },
    memberLinks() {
      const base = [
        { name: 'Dashboard', route: '/dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Choir Robes', route: '/inventory', icon: 'fas fa-tshirt' },
        { name: 'Music Library', route: '/music-library', icon: 'fas fa-music' },
        { name: 'Attendance', route: '/attendance', icon: 'fas fa-clipboard-check' }
      ]
      return this.authStore.user?.is_staff || this.authStore.user?.is_admin
        ? [...base, { name: 'Admin', route: '/admin', icon: 'fas fa-cog' }]
        : base
    }
  }
}
</script>

<style scoped>
/* Keep only what is necessary */
.badge {
  font-size: 0.65rem;
}
</style>
