<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>AVC Choir</h3>
          <p>Making beautiful music together since 2010. Join our community of music lovers.</p>
          <div class="social-links">
            <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/events">Events</router-link></li>
            <li><router-link to="/gallery">Gallery</router-link></li>
            <li><router-link to="/donate">Donate</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Contact Info</h4>
          <div class="contact-info">
            <p><i class="fas fa-map-marker-alt"></i> 123 Music Street, Kampala, Uganda</p>
            <p><i class="fas fa-phone"></i> +256 712 345 678</p>
            <p><i class="fas fa-envelope"></i> info@avcchoir.org</p>
          </div>
        </div>

        <div class="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter for updates</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input type="email" v-model="email" placeholder="Your email" required class="form-input">
            <button type="submit" class="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 AVC Choir. All rights reserved.</p>
        <div class="footer-bottom-links">
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue'
import { useUIStore } from '@/stores/uiStore'

export default {
  name: 'Footer',
  setup() {
    const email = ref('')
    const uiStore = useUIStore()

    const subscribeNewsletter = async () => {
      try {
        // Implement newsletter subscription
        uiStore.showNotification({
          type: 'success',
          message: 'Successfully subscribed to newsletter!'
        })
        email.value = ''
      } catch (error) {
        uiStore.showNotification({
          type: 'error',
          message: 'Subscription failed. Please try again.'
        })
      }
    }

    return {
      email,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: #3498db;
}

.footer-section p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: white;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #3498db;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3498db;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-form .form-input {
  flex: 1;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1rem;
}

.footer-bottom-links a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-bottom-links a:hover {
  color: #3498db;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .newsletter-form {
    flex-direction: column;
  }
}
</style>