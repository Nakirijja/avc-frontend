<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Full navbar for non-auth pages -->
    <Navbar v-if="!isAuthPage" />

    <!-- Minimal top bar for auth pages -->
    <div v-else class="auth-topbar d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <img src="@/assets/images/logo.png" alt="AVC Choir Logo" class="auth-logo" />
        <span class="brand-name fw-bold">Angels' Voices Choir</span>
      </div>
      <router-link to="/" class="home-link btn btn-outline-primary btn-sm">
        Home
      </router-link>
    </div>

    <main class="['main-content', { 'auth-page': isAuthPage }]">
      <router-view />
    </main>

    <!-- Footer only for non-auth pages -->
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  name: 'App',
  components: { Navbar, Footer },
  computed: {
    isAuthPage() {
      // Returns true if the current route starts with /auth
      return this.$route.path.startsWith('/auth')
    }
  }
}
</script>

<style>
@import "@/assets/styles/avcss.css";

/* Body styling */
body {
  background-color: var(--angelic-cream);
  color: var(--text-dark-brown);
  font-family: "Nunito", sans-serif;
  padding-top: 80px;
}

/* Minimal auth topbar */
.auth-topbar {
  background-color: var(--bs-light);
  height: 50px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.auth-logo {
  height: 32px;
}

.brand-name {
  font-size: 1rem;
}

.home-link {
  font-size: 0.875rem;
}

</style>
