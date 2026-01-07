<!-- src/views/Home.vue -->
<template>
  <div class="home-page">

    <!-- Hero Section with Background Slideshow -->
    <section class="hero-section" aria-labelledby="main-heading">
      <!-- Background Slideshow -->
      <div class="hero-bg-slideshow">
        <div
          v-for="(image, index) in heroImages"
          :key="index"
          class="hero-bg-slide"
          :style="{ backgroundImage: `url(${image})` }"
          :class="{ active: currentSlide === index }"
        ></div>
        <div class="hero-bg-overlay"></div> <!-- optional overlay for text readability -->
      </div>

      <div class="container">
        <div class="row align-items-center min-vh-100">
          
          <!-- Hero Content -->
          <div class="col-lg-6">
            <div class="hero-content">
              <div class="trust-badge mb-4">
                <span class="badge trust-tag">
                  <i class="fas fa-star me-2"></i>Trusted Since 2005
                </span>
              </div>

              <h1 id="main-heading" class="hero-title">
                Welcome to <span class="text-highlight">Angels' Voices Choir</span>
              </h1>

              <p class="hero-subtitle">
                Join Uganda's premier choir community at St. Gyaviira Catholic Parish. 
                Experience the joy of musical excellence in a vibrant, supportive environment 
                where voices unite to create heavenly harmonies.
              </p>

              <!-- Quick Stats -->
              <div class="stats-grid mb-4">
                <div class="stat-item">
                  <div class="stat-number">20</div>
                  <div class="stat-label">Years of Excellence</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">60+</div>
                  <div class="stat-label">Active Members</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">4</div>
                  <div class="stat-label">Voice Sections</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">50+</div>
                  <div class="stat-label">Annual Performances</div>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="cta-group">
                <router-link to="/join" class="btn btn-primary btn-lg cta-button">
                  <i class="fas fa-user-plus me-2"></i>Join Our Choir
                </router-link>
                <router-link to="/about" class="btn btn-outline-light btn-lg cta-button">
                  <i class="fas fa-play-circle me-2"></i>Watch Demo
                </router-link>
                <router-link to="/events" class="btn btn-outline-light btn-lg cta-button">
                  <i class="fas fa-calendar-alt me-2"></i>View Events
                </router-link>
              </div>

              <!-- Quick Features -->
              <div class="quick-features mt-4">
                <div class="feature-list">
                  <span class="feature-item">
                    <i class="fas fa-check-circle text-success me-2"></i>Professional Vocal Training
                  </span>
                  <span class="feature-item">
                    <i class="fas fa-check-circle text-success me-2"></i>Regular Live Performances
                  </span>
                  <span class="feature-item">
                    <i class="fas fa-check-circle text-success me-2"></i>Inclusive Community
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Visual -->
          <div class="col-lg-6">
            <div class="hero-visual">
              <div class="visual-container">
                <div class="main-visual">
                  <div class="visual-icon-wrapper">
                    <i class="fas fa-music visual-icon"></i>
                  </div>
                  <div class="visual-text">
                    <span class="choir-motto">"Where Faith Meets Harmony"</span>
                  </div>
                  <div class="visual-backdrop"></div>
                </div>

                <!-- Floating Elements -->
                <div class="floating-elements">
                  <div class="floating-note note-1">♪</div>
                  <div class="floating-note note-2">♫</div>
                  <div class="floating-note note-3">🎵</div>
                  <div class="floating-note note-4">🎶</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator">
        <button 
          class="scroll-button" 
          @click="scrollToSection('features')"
        >
          <div class="scroll-arrow">
            <i class="fas fa-chevron-down"></i>
          </div>
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section section-padding">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Why Join Angels Voices Choir?</h2>
          <p class="section-subtitle">Discover the unique benefits of being part of our musical family</p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4 col-md-6" v-for="feature in features" :key="feature.id">
            <div class="feature-card">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <ul class="feature-benefits">
                <li v-for="benefit in feature.benefits" :key="benefit">
                  <i class="fas fa-check me-2"></i>{{ benefit }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Voice Sections -->
    <section class="sections-section section-padding bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Our Voice Sections</h2>
          <p class="section-subtitle">Find your perfect vocal range and join like-minded singers</p>
        </div>

        <div class="row g-4">
          <div class="col-lg-3 col-md-6" v-for="section in voiceSections" :key="section.name">
            <div class="section-card">
              <div class="section-icon" :style="{ backgroundColor: section.color }">
                <i :class="section.icon"></i>
              </div>
              <h3 class="section-name">{{ section.name }}</h3>
              <p class="section-range">{{ section.range }}</p>
              <p class="section-description">{{ section.description }}</p>
              <div class="section-stats">
                <span class="section-members">
                  <i class="fas fa-users me-1"></i>{{ section.members }} Members
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="events-section section-padding">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Upcoming Events</h2>
          <p class="section-subtitle">Join us for our next musical celebrations</p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4 col-md-6" v-for="event in upcomingEvents" :key="event.id">
            <div class="event-card">
              <div class="event-date">
                <div class="date-day">{{ event.date.split(' ')[0] }}</div>
                <div class="date-month">{{ event.date.split(' ')[1] }}</div>
              </div>
              <div class="event-content">
                <h3 class="event-title">{{ event.title }}</h3>
                <p class="event-location"><i class="fas fa-map-marker-alt me-2"></i>{{ event.location }}</p>
                <p class="event-time"><i class="fas fa-clock me-2"></i>{{ event.time }}</p>
                <p class="event-description">{{ event.description }}</p>
                <div class="event-actions">
                  <button class="btn btn-outline-primary btn-sm" @click="rsvpToEvent(event)">
                    <i class="fas fa-calendar-plus me-2"></i>RSVP
                  </button>
                  <router-link :to="`/events/${event.id}`" class="btn btn-link btn-sm">
                    Learn More
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <router-link to="/events" class="btn btn-primary btn-lg">
            View All Events <i class="fas fa-arrow-right ms-2"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <TestimonialsCarousel />

    <!-- Leadership Section -->
    <section class="leadership-section section-padding bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Meet Our Leadership</h2>
          <p class="section-subtitle">Dedicated professionals guiding our musical journey</p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4 col-md-6" v-for="leader in leadershipTeam" :key="leader.id">
            <LeadershipCard :leader="leader" @social-click="handleSocialClick" />
          </div>
        </div>
      </div>
    </section>

    <!-- Join CTA Section -->
    <section class="join-section section-padding">
      <div class="container">
        <div class="join-cta">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h2 class="cta-title">Ready to Find Your Voice?</h2>
              <p class="cta-description">
                Join our community of passionate singers and experience the joy of creating 
                beautiful music together. No auditions required - just bring your enthusiasm!
              </p>
              <div class="cta-features">
                <div class="cta-feature"><i class="fas fa-check-circle text-success me-2"></i>Free trial session available</div>
                <div class="cta-feature"><i class="fas fa-check-circle text-success me-2"></i>All skill levels welcome</div>
                <div class="cta-feature"><i class="fas fa-check-circle text-success me-2"></i>Flexible rehearsal schedules</div>
              </div>
            </div>
            <div class="col-lg-4 text-center">
              <div class="cta-buttons">
                <router-link to="/join" class="btn btn-primary btn-lg cta-button mb-3">
                  <i class="fas fa-user-plus me-2"></i>Join Now
                </router-link>
                <router-link to="/contact" class="btn btn-outline-dark btn-lg cta-button">
                  <i class="fas fa-info-circle me-2"></i>Learn More
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import LeadershipCard from '@/components/common/LeadershipCard.vue'
import TestimonialsCarousel from '@/components/common/TestimonialsCarousel.vue'

export default {
  name: 'HomeView',
  components: {
    Navbar,
    Footer,
    LeadershipCard,
    TestimonialsCarousel
  },
  setup() {
    // Hero Background Slideshow
    const heroImages = ref([
      '/images/avc/hero-2.jpg',
      '/images/avc/hero-3.jpg',
      '/images/avc/hero-1.jpg',
    ])
    const currentSlide = ref(0)

    onMounted(() => {
      const interval = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % heroImages.value.length
    }, 5000)

    onUnmounted(() => clearInterval(interval))
  })
      

    // Features data
    const features = ref([
      {
        id: 1,
        icon: 'fas fa-users',
        title: 'Community & Fellowship',
        description: 'Join a supportive family of music lovers who share your passion for singing.',
        benefits: [
          'Weekly social gatherings',
          'Mentorship programs',
          'Lifelong friendships',
          'Supportive environment'
        ]
      },
      {
        id: 2,
        icon: 'fas fa-music',
        title: 'Musical Excellence',
        description: 'Develop your vocal skills under expert guidance with diverse repertoire.',
        benefits: [
          'Professional vocal coaching',
          'Diverse music genres',
          'Performance opportunities',
          'Skill development'
        ]
      },
      {
        id: 3,
        icon: 'fas fa-calendar-star',
        title: 'Performance Opportunities',
        description: 'Showcase your talent in various events from local gatherings to major concerts.',
        benefits: [
          'Regular concerts',
          'Community events',
          'Special celebrations',
          'International tours'
        ]
      }
    ])

    // Voice sections data
    const voiceSections = ref([
      {
        name: 'Soprano',
        range: 'C4 - C6',
        description: 'The highest female voice, carrying melodies with clarity and brightness.',
        members: 18,
        icon: 'fas fa-arrow-up',
        color: '#e91e63'
      },
      {
        name: 'Alto',
        range: 'G3 - F5',
        description: 'Rich, warm lower female voice providing harmonic foundation and depth.',
        members: 16,
        icon: 'fas fa-arrows-alt-h',
        color: '#9c27b0'
      },
      {
        name: 'Tenor',
        range: 'C3 - C5',
        description: 'Higher male voice adding brilliance and carrying important melodic lines.',
        members: 14,
        icon: 'fas fa-arrow-up',
        color: '#2196f3'
      },
      {
        name: 'Bass',
        range: 'E2 - E4',
        description: 'Deep, resonant male voice providing the foundation for all harmonies.',
        members: 12,
        icon: 'fas fa-arrow-down',
        color: '#3f51b5'
      }
    ])

    // Upcoming events data
    const upcomingEvents = ref([
      {
        id: 1,
        title: '20th Anniversy',
        date: '21 Dec',
        location: 'St. Gyaviira Main Church',
        time: '8:30 PM - 1:00 PM',
        description: 'Celebration of twenty years of service .'
      },
      {
        id: 2,
        title: 'Voice Workshop',
        date: '22 Jan',
        location: 'Choir Practice Hall',
        time: '10:00 AM - 2:00 PM',
        description: 'Special workshop focusing on vocal techniques and harmony development.'
      },
      {
        id: 3,
        title: 'Community Outreach',
        date: '5 Feb',
        location: 'Local Community Center',
        time: '3:00 PM - 5:00 PM',
        description: 'Bringing music to the community with uplifting performances and interactions.'
      }
    ])

    // Leadership team data
    const leadershipTeam = ref([
      {
        id: 1,
        name: 'Mr.Muyomba Hebert',
        position: 'Choir Director',
        bio: 'With over 20+ years of experience in choral direction, Mr.Muyomba brings exceptional musical expertise and passion.',
        avatar: '/images/leadership/hebert.png',
        stats: {
          years: 15,
          concerts: 200,
          members: 60
        },
        social: {
          email: 'muyomba.hebert@avcchoir.org',
          phone: '+256-700-123-456',
          linkedin: 'https://linkedin.com/in/hebertmuyomba'
        }
      },
      {
        id: 2,
        name: 'Matovu Peter Kammer',
        position: 'Assistant Director',
        bio: 'Specializing in vocal training and section development, Michael ensures every voice reaches its potential.',
        avatar: '/images/leadership/krammer.png',
        stats: {
          years: 8,
          projects: 45,
          concerts: 120
        },
        social: {
          email: 'peter.krammer@avcchoir.org',
          phone: '+256-700-123-457'
        }
      },
      {
        id: 3,
        name: 'Nakirijja Angela',
        position: 'Music Coordinator',
        bio: 'Angela manages our extensive music library and coordinates all musical arrangements and performances.',
        avatar: '/images/leadership/angelaa.jpg',
        stats: {
          years: 6,
          pieces: 300,
          events: 80
        },
        social: {
          email: 'nakirijja.angela@avcchoir.org',
          linkedin: 'https://linkedin.com/in/nakirijja'
        }
      }
    ])

    // Methods
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    const rsvpToEvent = (event) => {
      // Implement RSVP functionality
      console.log('RSVP to event:', event.title)
      // Show success message or redirect to RSVP page
    }

    const handleSocialClick = (data) => {
      console.log('Social click:', data)
      // Track social interactions if needed
    }

    // Animation observers
    const setupAnimations = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      }, observerOptions)

      // Observe all feature cards and section cards
      document.querySelectorAll('.feature-card, .section-card, .event-card').forEach(card => {
        observer.observe(card)
      })

      return observer
    }

    // Lifecycle
    onMounted(() => {
      console.log('AVC Choir Homepage loaded')
      const observer = setupAnimations()

      // Cleanup
      onUnmounted(() => {
        observer.disconnect()
      })
    })

    return {
      heroImages,
      currentSlide,
      features,
      voiceSections,
      upcomingEvents,
      leadershipTeam,
      scrollToSection,
      rsvpToEvent,
      handleSocialClick
    }
  }
}
</script>

<style scoped>
/* ===== CSS Variables ===== */
:root {
  --primary-color: #4361ee;
  --primary-dark: #3a56d4;
  --secondary-color: #7209b7;
  --accent-color: #f72585;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --text-light: #ffffff;
  --text-dark: #2d3748;
  --text-muted: #6b7280;
  --border-radius: 12px;
  --border-radius-lg: 20px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.15);
  --transition: all 0.3s ease;
  --section-padding: 5rem 0;
}

/* ===== Hero Section ===== */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

/* Hero Slideshow */
.hero-bg-slideshow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
}

.hero-bg-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.hero-bg-slide.active {
  opacity: 1;
}

/* Optional overlay to improve readability */
.hero-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.35);
  z-index: 2;
}

/* ===== Hero Content ===== */
.hero-content {
  position: relative;
  z-index: 3;
}

.trust-badge {
  animation: fadeInDown 0.8s ease;
}

.trust-tag {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--text-light);
  animation: fadeInUp 0.8s ease 0.2s both;
}

.text-highlight {
  background: linear-gradient(45deg, #f72585, #4361ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease 0.4s both;
}

/* ===== Stats Grid ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  animation: fadeInUp 0.8s ease 0.6s both;
}

.stat-item {
  text-align: center;
  padding: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-light);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* ===== CTA Buttons ===== */
.cta-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease 0.8s both;
}

.cta-button {
  padding: 0.875rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(45deg, var(--accent-color), #f72585);
  box-shadow: var(--shadow);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(247, 37, 133, 0.3);
}

.btn-outline-light {
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: var(--text-light);
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* ===== Quick Features ===== */
.quick-features {
  animation: fadeInUp 0.8s ease 1s both;
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.feature-item {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

/* ===== Hero Visual ===== */
.hero-visual {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.main-visual {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 
    var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.visual-icon-wrapper {
  margin-bottom: 1.5rem;
}

.visual-icon {
  font-size: 4rem;
  color: var(--text-light);
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.choir-motto {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  font-weight: 500;
}

.visual-backdrop {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  border-radius: calc(var(--border-radius-lg) + 10px);
  z-index: -1;
}

/* ===== Floating Elements ===== */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-note {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.6);
  animation: float 6s ease-in-out infinite;
}

.note-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.note-2 {
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.note-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.note-4 {
  top: 30%;
  right: 30%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* ===== Scroll Indicator ===== */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeIn 1s ease 1.2s both;
}

.scroll-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
}

.scroll-button:hover {
  color: var(--text-light);
  background: rgba(255, 255, 255, 0.1);
}

.scroll-arrow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* ===== Section Styles ===== */
.section-padding {
  padding: var(--section-padding);
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.bg-light {
  background-color: #f8f9fa;
}

/* ===== Feature Cards ===== */
.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  transition: var(--transition);
  height: 100%;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon i {
  font-size: 1.75rem;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.feature-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-benefits li {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.feature-benefits i {
  color: var(--success-color);
}

/* ===== Section Cards ===== */
.section-card {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  transition: var(--transition);
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.2s;
}

.section-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.section-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.section-icon i {
  font-size: 2rem;
  color: white;
}

.section-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.section-range {
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
}

.section-description {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.section-stats {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.section-members {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* ===== Event Cards ===== */
.event-card {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.4s;
}

.event-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.event-date {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.date-day {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
}

.event-content {
  padding: 1.5rem;
  flex: 1;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.event-location,
.event-time {
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.event-description {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.9rem;
}

.event-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* ===== Join CTA Section ===== */
.join-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
}

.join-cta {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-lg);
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.cta-feature {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== Animations ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ===== Responsive Design ===== */
@media (max-width: 1199.98px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 991.98px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-group {
    justify-content: center;
  }
  
  .feature-list {
    justify-content: center;
  }
  
  .main-visual {
    padding: 2rem 1.5rem;
  }
  
  .visual-icon {
    font-size: 3rem;
  }
  
  .join-cta {
    padding: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .hero-title {
    font-size: 2rem;
    text-align: center;
  }
  
  .hero-subtitle {
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .cta-group {
    flex-direction: column;
  }
  
  .cta-group .btn {
    width: 100%;
    text-align: center;
  }
  
  .main-visual {
    margin: 2rem auto;
    max-width: 300px;
  }
  
  .section-padding {
    padding: 3rem 0;
  }
  
  .feature-card,
  .section-card,
  .event-card {
    padding: 1.5rem;
  }
  
  .event-card {
    flex-direction: column;
  }
  
  .event-date {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    min-width: auto;
    padding: 1rem;
  }
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    gap: 1rem;
  }
  
  .feature-list {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .join-cta {
    padding: 1.5rem;
  }
  
  .cta-title {
    font-size: 1.75rem;
  }
}

/* ===== Performance Optimizations ===== */
.hero-section {
  will-change: transform;
}

.floating-note, .cta-button, .feature-card, .section-card, .event-card {
  will-change: transform;
}

/* ===== Reduced Motion Support ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .floating-note {
    animation: none;
  }
  
  .scroll-arrow {
    animation: none;
  }
  
  .feature-card,
  .section-card,
  .event-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ===== Print Styles ===== */
@media print {
  .hero-section {
    background: white !important;
    color: black !important;
    min-height: auto;
  }
  
  .btn {
    display: none !important;
  }
  
  .floating-elements {
    display: none;
  }
  
  .scroll-indicator {
    display: none;
  }
}
</style>
