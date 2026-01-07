<template>
  <div class="contact-page">
    <!-- Header Section -->
    <section class="contact-header bg-primary text-white py-5">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-10">
            <div class="header-icon mb-4">
              <i class="fas fa-hands-helping fa-3x"></i>
            </div>
            <h1 class="display-5 fw-bold mb-3">Contact Angels Voices Choir</h1>
            <p class="lead mb-0 mx-auto" style="max-width: 600px;">Get in touch with our ministry team. We're here to help you join our community or answer any questions.</p>
          </div>
          
        </div>
      </div>
    </section>

    <!-- Main Contact Section -->
    <section class="contact-main py-5">
      <div class="container">
        <div class="row g-5">
          <!-- Contact Information -->
          <div class="col-lg-4">
            <div class="contact-info-card">
              <h3 class="h4 mb-4 text-primary">Contact Information</h3>
              
              <div class="contact-method mb-4">
                <div class="method-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="method-details">
                  <h5>Visit Us</h5>
                  <p>St. Gyaviira Catholic Parish<br>Kampala, Uganda</p>
                </div>
              </div>

              <div class="contact-method mb-4">
                <div class="method-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="method-details">
                  <h5>Call Us</h5>
                  <p>
                    <a href="tel:+256700123456" class="text-decoration-none">+256 700 123 456</a><br>
                    <small class="text-muted">Mon-Fri, 9AM-5PM</small>
                  </p>
                </div>
              </div>

              <div class="contact-method mb-4">
                <div class="method-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="method-details">
                  <h5>Email Us</h5>
                  <p>
                    <a href="mailto:info@avcchoir.org" class="text-decoration-none">info@avcchoir.org</a><br>
                    <small class="text-muted">We'll respond within 24 hours</small>
                  </p>
                </div>
              </div>

              <div class="contact-method mb-4">
                <div class="method-icon">
                  <i class="fab fa-whatsapp"></i>
                </div>
                <div class="method-details">
                  <h5>WhatsApp</h5>
                  <p>
                    <a href="https://wa.me/256700123456" target="_blank" rel="noopener" class="text-decoration-none">
                      Chat with us
                    </a><br>
                    <small class="text-muted">Quick responses</small>
                  </p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="quick-actions mt-4 p-4 bg-light rounded">
                <h6 class="mb-3">Quick Actions</h6>
                <div class="d-grid gap-2">
                  <router-link to="/join" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-user-plus me-2"></i>Join Our Choir
                  </router-link>
                  <router-link to="/events" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-calendar-alt me-2"></i>View Events
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="col-lg-8">
            <div class="contact-form-card">
              <div class="card-header bg-transparent border-0 pb-3">
                <h3 class="h4 mb-2">Send us a Message</h3>
                <p class="text-muted mb-0">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form @submit.prevent="handleSubmit" novalidate class="needs-validation" :class="{ 'was-validated': formTouched }">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="name" class="form-label">Full Name *</label>
                    <input
                      v-model="form.name"
                      type="text"
                      id="name"
                      class="form-control"
                      :class="{ 'is-invalid': errors.name }"
                      required
                      @blur="validateField('name')"
                    >
                    <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
                    <div class="form-text">Your full name as you'd like us to address you</div>
                  </div>

                  <div class="col-md-6">
                    <label for="email" class="form-label">Email Address *</label>
                    <input
                      v-model="form.email"
                      type="email"
                      id="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      required
                      @blur="validateField('email')"
                    >
                    <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                    <div class="form-text">We'll never share your email with anyone else</div>
                  </div>

                  <div class="col-12">
                    <label for="subject" class="form-label">Subject *</label>
                    <input
                      v-model="form.subject"
                      type="text"
                      id="subject"
                      class="form-control"
                      :class="{ 'is-invalid': errors.subject }"
                      required
                      @blur="validateField('subject')"
                      placeholder="What is this regarding?"
                    >
                    <div class="invalid-feedback" v-if="errors.subject">{{ errors.subject }}</div>
                  </div>

                  <div class="col-12">
                    <label for="message" class="form-label">Message *</label>
                    <textarea
                      v-model="form.message"
                      id="message"
                      rows="6"
                      class="form-control"
                      :class="{ 'is-invalid': errors.message }"
                      required
                      @blur="validateField('message')"
                      placeholder="Please share your questions, comments, or how we can help you..."
                    ></textarea>
                    <div class="invalid-feedback" v-if="errors.message">{{ errors.message }}</div>
                    <div class="form-text">
                      <span :class="{'text-danger': messageLength > 2000}">
                        {{ messageLength }}/2000 characters
                      </span>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg px-4"
                        :disabled="loading || !isFormValid"
                      >
                        <template v-if="loading">
                          <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending...
                        </template>
                        <template v-else>
                          <i class="fas fa-paper-plane me-2"></i>
                          Send Message
                        </template>
                      </button>
                      
                      <small class="text-muted">* Required fields</small>
                    </div>
                  </div>
                </div>
              </form>

              <!-- Alerts -->
              <div v-if="successMessage" class="alert alert-success mt-4" role="alert">
                <div class="d-flex align-items-center">
                  <i class="fas fa-check-circle fa-lg me-3"></i>
                  <div>
                    <h5 class="alert-heading mb-1">Message Sent Successfully!</h5>
                    <p class="mb-0">{{ successMessage }}</p>
                  </div>
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
                <div class="d-flex align-items-center">
                  <i class="fas fa-exclamation-triangle fa-lg me-3"></i>
                  <div>
                    <h5 class="alert-heading mb-1">Unable to Send Message</h5>
                    <p class="mb-0">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { apiService } from '@/services/api'

export default {
  name: 'ContactPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      errors: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      loading: false,
      successMessage: '',
      errorMessage: '',
      formTouched: false
    }
  },
  computed: {
    messageLength() {
      return this.form.message.length
    },
    isFormValid() {
      return (
        this.form.name.trim().length >= 2 &&
        this.form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
        this.form.subject.trim().length >= 5 &&
        this.form.message.trim().length >= 10 &&
        this.form.message.length <= 2000
      )
    }
  },
  methods: {
    validateField(field) {
      this.formTouched = true
      
      switch (field) {
        case 'name':
          this.errors.name = this.form.name.trim().length >= 2 ? '' : 'Name must be at least 2 characters long'
          break
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          this.errors.email = emailRegex.test(this.form.email) ? '' : 'Please enter a valid email address'
          break
        case 'subject':
          this.errors.subject = this.form.subject.trim().length >= 5 ? '' : 'Subject must be at least 5 characters long'
          break
        case 'message':
          this.errors.message = this.form.message.trim().length >= 10 && this.form.message.length <= 2000 
            ? '' : 'Message must be between 10 and 2000 characters'
          break
      }
    },
    async handleSubmit() {
      this.formTouched = true
      
      // Validate all fields
      Object.keys(this.form).forEach(field => this.validateField(field))
      
      if (!this.isFormValid) {
        this.errorMessage = 'Please fix the errors in the form before submitting.'
        return
      }

      this.loading = true
      this.successMessage = ''
      this.errorMessage = ''

      try {
        // Use the apiService instead of direct axios call
        const response = await apiService.contact.submit(this.form)
        
        console.log('Contact form response:', response)

        // Handle different possible response structures
        if (response.data) {
          // Case 1: Response has data property with success/message
          if (response.data.success) {
            this.successMessage = response.data.message || 'Message sent successfully! We will get back to you soon.'
            this.resetForm()
          } 
          // Case 2: Response has data with id (created successfully)
          else if (response.data.id) {
            this.successMessage = 'Message sent successfully! We will get back to you soon.'
            this.resetForm()
          }
          // Case 3: Response has data with detail/message
          else if (response.data.detail || response.data.message) {
            this.successMessage = response.data.detail || response.data.message || 'Message sent successfully!'
            this.resetForm()
          }
          else {
            // If we get here but no error, assume success
            this.successMessage = 'Message sent successfully! We will get back to you soon.'
            this.resetForm()
          }
        } else {
          // If response structure is unexpected but no error thrown
          this.successMessage = 'Message sent successfully! We will get back to you soon.'
          this.resetForm()
        }
        
      } catch (error) {
        console.error('Contact form error:', error)
        
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const errorData = error.response.data
          
          if (errorData.errors) {
            // Backend validation errors
            Object.keys(errorData.errors).forEach(field => {
              if (this.errors.hasOwnProperty(field)) {
                this.errors[field] = Array.isArray(errorData.errors[field]) 
                  ? errorData.errors[field][0] 
                  : errorData.errors[field]
              }
            })
            this.errorMessage = 'Please correct the errors in the form.'
          } else {
            this.errorMessage = errorData.detail || 
                               errorData.message || 
                               errorData.error || 
                               `Server error: ${error.response.status}`
          }
        } else if (error.request) {
          // Request was made but no response received
          this.errorMessage = 'Network error: Unable to reach server. Please check your connection.'
        } else {
          // Something else happened
          this.errorMessage = error.message || 'An unexpected error occurred.'
        }
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      this.formTouched = false
      this.errors = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>

.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.contact-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  margin-top: -1px;
  text-align: center;
}

.contact-info-card,
.contact-form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  height: 100%;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.method-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.method-details h5 {
  color: var(--text-dark);
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.method-details p {
  color: var(--text-muted);
  margin-bottom: 0;
}

.quick-actions {
  border-left: 4px solid var(--primary-color);
}

.header-icon {
  opacity: 0.8;
  margin: 0 auto 1.5rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 1rem;
}

/* Form enhancements */
.form-control {
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(67, 97, 238, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .contact-header .display-5 {
    font-size: 2rem;
  }
  
  .contact-info-card,
  .contact-form-card {
    padding: 1.5rem;
  }
  
  .contact-method {
    flex-direction: column;
    text-align: center;
  }
  
  .method-icon {
    align-self: center;
  }
}

/* Animation for success state */
.alert {
  animation: slideInDown 0.5s ease;
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>