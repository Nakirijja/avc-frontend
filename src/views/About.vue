<template>
  <div class="about-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <i class="fas fa-music me-2"></i>AVC Choir
        </router-link>
        <div class="navbar-nav ms-auto">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link to="/events" class="nav-link">Events</router-link>
          <router-link to="/auth/login" class="nav-link">Login</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="about-hero bg-primary text-white py-5">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4">About Angels Voices Choir</h1>
            <p class="lead mb-4">
              A vibrant community of passionate singers dedicated to creating beautiful music and making a difference through the power of song.
            </p>
          </div>
          <div class="col-lg-4 text-center">
            <img
              :src="heroImage"
              alt="Choir Hero"
              class="img-fluid rounded shadow"
              style="max-height: 300px;"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-bullseye fa-3x text-primary mb-3"></i>
                <h3 class="h4">Our Mission</h3>
                <p class="text-muted">
                  To inspire and uplift our community through exceptional choral music, while providing a supportive environment for musical growth and personal development.
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-eye fa-3x text-primary mb-3"></i>
                <h3 class="h4">Our Vision</h3>
                <p class="text-muted">
                  To be the leading community choir in the region, recognized for musical excellence, community engagement, and the transformative power of our performances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- History -->
    <section class="bg-light py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4">Our Story</h2>
            <p class="lead">
              Founded in 2010, Angels Voices Choir began as a small group of music enthusiasts who shared a common passion for choral singing.
            </p>
            <p>
              Over the years, we've grown into a diverse community of over 150 members, representing various backgrounds and professions, all united by our love for music.
            </p>
            <p>
              We've performed at numerous community events, charity functions, and cultural festivals, touching thousands of lives through our music.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="row text-center">
              <div class="col-6 mb-4">
                <div class="display-4 fw-bold text-primary">14+</div>
                <p class="text-muted">Years of Excellence</p>
              </div>
              <div class="col-6 mb-4">
                <div class="display-4 fw-bold text-primary">150+</div>
                <p class="text-muted">Active Members</p>
              </div>
              <div class="col-6 mb-4">
                <div class="display-4 fw-bold text-primary">500+</div>
                <p class="text-muted">Performances</p>
              </div>
              <div class="col-6 mb-4">
                <div class="display-4 fw-bold text-primary">25+</div>
                <p class="text-muted">Musical Productions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center display-5 fw-bold mb-5">Meet Our Leadership</h2>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="leader in leadership" :key="leader.name">
            <div class="card border-0 shadow-sm text-center">
              <div class="card-body p-4">
                <img
                  :src="leader.avatar"
                  alt="Leader Avatar"
                  class="leader-avatar mx-auto mb-3 rounded-circle"
                  style="width: 80px; height: 80px; object-fit: cover;"
                />
                <h5 class="card-title">{{ leader.name }}</h5>
                <p class="text-primary fw-semibold">{{ leader.position }}</p>
                <p class="text-muted small">{{ leader.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4">
      <div class="container text-center">
        <p class="mb-0">&copy; 2025 Angels Voices Choir. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      heroImage: '/images/about/choir-hero.jpeg', // Replace with API URL if dynamic
      leadership: [
        {
          name: 'Hebert Muyomba',
          position: 'Music Director',
          avatar: '/images/leadership/hebert.png', // Local image or API URL
          description: 'Professional conductor with 20+ years of experience in choral music.'
        },
        {
          name: 'Jennifer Mateega',
          position: 'Choir President',
          avatar: '/images/leadership/jenni.png',
          description: 'Dedicated leader passionate about community engagement through music.'
        },
        {
          name: 'Counsel Zziwa',
          position: 'Vice President',
          avatar: '/images/leadership/zziwa.png',
          description: 'Organizes events and coordinates member activities.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.about-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.leader-avatar {
  font-weight: bold;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
