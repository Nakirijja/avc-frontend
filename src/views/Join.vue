<template>
  <div class="join-page">
    <!-- Header Section -->
    <section class="join-header bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-5 fw-bold mb-3">Join Angels Voices Choir</h1>
            <p class="lead mb-0">Become part of our musical family and use your talent to worship and serve the community.</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <div class="header-icon">
              <i class="fas fa-music fa-3x"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="join-main py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="row g-5">
              <!-- Membership Information -->
              <div class="col-lg-4">
                <div class="info-card">
                  <h3 class="h4 mb-4 text-primary">Membership Details</h3>
                  
                  <div class="info-item mb-4">
                    <div class="info-icon">
                      <i class="fas fa-users"></i>
                    </div>
                    <div class="info-details">
                      <h5>Who Can Join</h5>
                      <p class="mb-0">Ages 7+, all voice types welcome. No prior choir experience required!</p>
                    </div>
                  </div>

                  <div class="info-item mb-4">
                    <div class="info-icon">
                      <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="info-details">
                      <h5>Commitment</h5>
                      <p class="mb-0">Weekly practices and participation in Sunday services & special events</p>
                    </div>
                  </div>

                  <div class="info-item mb-4">
                    <div class="info-icon">
                      <i class="fas fa-heart"></i>
                    </div>
                    <div class="info-details">
                      <h5>Benefits</h5>
                      <ul class="list-unstyled mb-0">
                        <li>• Vocal training</li>
                        <li>• Music theory lessons</li>
                        <li>• Community service</li>
                        <li>• Spiritual growth</li>
                      </ul>
                    </div>
                  </div>

                  <!-- Quick Info -->
                  <div class="quick-info mt-4 p-4 bg-light rounded">
                    <h6 class="mb-3">Quick Info</h6>
                    <div class="d-grid gap-2">
                      <div class="d-flex justify-content-between">
                        <span>Practice Days:</span>
                        <strong>Thur & Sat</strong>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Time:</span>
                        <strong>6-8 PM / 4PM-7PM</strong>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Location:</span>
                        <strong>AVC Choir Office</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Already have account -->
                  <div class="mt-4 text-center">
                    <p class="small text-muted mb-2">Already have an account?</p>
                    <router-link to="/auth/login" class="btn btn-outline-primary btn-sm">
                      Sign In Here
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Application Form -->
              <div class="col-lg-8">
                <div class="application-card">
                  <div class="card-header bg-transparent border-0 pb-3">
                    <h3 class="h4 mb-2">Choir Membership Application</h3>
                    <p class="text-muted mb-0">Fill out this form to apply for choir membership. Our team will review your application and contact you.</p>
                  </div>

                  <!-- Option Selection -->
                  <div class="option-selection mb-4">
                    <div class="alert alert-info">
                      <h6 class="alert-heading mb-3">Choose Your Path:</h6>
                      <div class="btn-group w-100" role="group">
                        <button 
                          type="button"
                          class="btn"
                          :class="showApplicationForm ? 'btn-primary' : 'btn-outline-primary'"
                          @click="showApplicationForm = true"
                        >
                          Apply for Membership
                        </button>
                        <button 
                          type="button"
                          class="btn"
                          :class="!showApplicationForm ? 'btn-primary' : 'btn-outline-primary'"
                          @click="showApplicationForm = false"
                        >
                          Create Account First
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Membership Application Form -->
                  <div v-if="showApplicationForm">
                    <form @submit.prevent="submitMembershipApplication" novalidate class="needs-validation" :class="{ 'was-validated': formTouched }">
                      <div class="section-title mb-4">
                        <h5 class="text-primary">
                          <i class="fas fa-user me-2"></i>Personal Information
                        </h5>
                      </div>

                      <div class="row g-3">
                        <div class="col-md-6">
                          <label for="full_name" class="form-label">Full Name *</label>
                          <input
                            v-model="membershipForm.full_name"
                            type="text"
                            id="full_name"
                            class="form-control"
                            :class="{ 'is-invalid': errors.full_name }"
                            required
                            @blur="validateField('full_name')"
                          >
                          <div class="invalid-feedback" v-if="errors.full_name">{{ errors.full_name }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="email" class="form-label">Email Address *</label>
                          <input
                            v-model="membershipForm.email"
                            type="email"
                            id="email"
                            class="form-control"
                            :class="{ 'is-invalid': errors.email }"
                            required
                            @blur="validateField('email')"
                          >
                          <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="phone" class="form-label">Phone Number *</label>
                          <input
                            v-model="membershipForm.phone"
                            type="tel"
                            id="phone"
                            class="form-control"
                            :class="{ 'is-invalid': errors.phone }"
                            required
                            @blur="validateField('phone')"
                            placeholder="+256 XXX XXX XXX"
                          >
                          <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
                        </div>

                        <div class="col-md-6">
                          <label for="role" class="form-label">Desired Role *</label>
                          <select
                            v-model="membershipForm.role"
                            id="role"
                            class="form-select"
                            :class="{ 'is-invalid': errors.role }"
                            required
                          >
                            <option value="">Select your role</option>
                            <option value="chorister">Chorister (Singer)</option>
                            <option value="instrumentalist">Instrumentalist</option>
                            <option value="supporter">Supporter/Volunteer</option>
                          </select>
                          <div class="invalid-feedback" v-if="errors.role">{{ errors.role }}</div>
                        </div>

                        <div class="col-12">
                          <label for="experience" class="form-label">Musical Background & Experience</label>
                          <textarea
                            v-model="membershipForm.experience"
                            id="experience"
                            rows="4"
                            class="form-control"
                            placeholder="Tell us about your musical experience, instruments you play, voice type (if known), or why you want to join our choir..."
                          ></textarea>
                          <div class="form-text">
                            <span :class="{'text-danger': experienceLength > 1000}">
                              {{ experienceLength }}/1000 characters
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Submit Section -->
                      <div class="submit-section mt-5 pt-4 border-top">
                        <div class="d-flex justify-content-between align-items-center">
                          <button
                            type="submit"
                            class="btn btn-primary btn-lg px-5"
                            :disabled="loading || !isMembershipFormValid"
                          >
                            <template v-if="loading">
                              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                              Submitting...
                            </template>
                            <template v-else>
                              <i class="fas fa-paper-plane me-2"></i>
                              Submit Application
                            </template>
                          </button>
                          
                          <small class="text-muted">* Required fields</small>
                        </div>
                      </div>
                    </form>
                  </div>

                  <!-- Create Account Option -->
                  <div v-else>
                    <div class="text-center py-4">
                      <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                      <h4>Create an Account First</h4>
                      <p class="text-muted mb-4">
                        Create a user account to access all choir features and manage your membership.
                      </p>
                      <router-link to="/auth/register" class="btn btn-primary btn-lg">
                        <i class="fas fa-user-plus me-2"></i>
                        Create Account
                      </router-link>
                      <div class="mt-3">
                        <small class="text-muted">
                          Already have an account? 
                          <router-link to="/auth/login" class="text-decoration-none">Sign in here</router-link>
                        </small>
                      </div>
                    </div>
                  </div>

                  <!-- Success Message -->
                  <div v-if="successMessage" class="alert alert-success mt-4" role="alert">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-check-circle fa-lg me-3"></i>
                      <div>
                        <h5 class="alert-heading mb-1">Application Submitted Successfully!</h5>
                        <p class="mb-0">{{ successMessage }}</p>
                        <hr>
                        <p class="mb-0 small">
                          <strong>Next Steps:</strong> We'll review your application and contact you within 3-5 business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-exclamation-triangle fa-lg me-3"></i>
                      <div>
                        <h5 class="alert-heading mb-1">Unable to Submit Application</h5>
                        <p class="mb-0">{{ errorMessage }}</p>
                      </div>
                    </div>
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
  name: 'JoinPage',
  data() {
    return {
      showApplicationForm: true,
      membershipForm: {
        full_name: '',
        email: '',
        phone: '',
        role: 'chorister',
        experience: ''
      },
      errors: {
        full_name: '',
        email: '',
        phone: '',
        role: ''
      },
      loading: false,
      successMessage: '',
      errorMessage: '',
      formTouched: false
    }
  },
  computed: {
    experienceLength() {
      return this.membershipForm.experience?.length || 0
    },
    isMembershipFormValid() {
      return (
        this.membershipForm.full_name?.trim().length >= 2 &&
        this.membershipForm.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
        this.membershipForm.phone?.trim().length >= 10 &&
        this.membershipForm.role
      )
    }
  },
  methods: {
    validateField(field) {
      this.formTouched = true
      
      switch (field) {
        case 'full_name':
          this.errors.full_name = this.membershipForm.full_name?.trim().length >= 2 ? '' : 'Full name must be at least 2 characters long'
          break
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          this.errors.email = emailRegex.test(this.membershipForm.email) ? '' : 'Please enter a valid email address'
          break
        case 'phone':
          this.errors.phone = this.membershipForm.phone?.trim().length >= 10 ? '' : 'Please enter a valid phone number'
          break
        case 'role':
          this.errors.role = this.membershipForm.role ? '' : 'Please select a role'
          break
      }
    },
    async submitMembershipApplication() {
      this.formTouched = true
      
      // Validate all fields
      Object.keys(this.membershipForm).forEach(field => {
        if (field !== 'experience') { // experience is optional
          this.validateField(field)
        }
      })
      
      if (!this.isMembershipFormValid) {
        this.errorMessage = 'Please fix the errors in the form before submitting.'
        return
      }

      this.loading = true
      this.successMessage = ''
      this.errorMessage = ''

      try {
        // Use the membership endpoint from your existing Membership.vue
        const response = await apiService.membership.submitApplication(this.membershipForm)
        
        console.log('Membership application response:', response)

        if (response && response.status >= 200 && response.status < 300) {
          this.successMessage = 'Your choir membership application has been submitted successfully! Our team will review it and contact you soon.'
          this.resetForm()
        } else {
          this.errorMessage = 'Failed to submit application. Please try again.'
        }
        
      } catch (error) {
        console.error('Membership application error:', error)
        this.handleApiError(error)
      } finally {
        this.loading = false
      }
    },

    handleApiError(error) {
      this.errors = {
        full_name: '',
        email: '',
        phone: '',
        role: ''
      }

      if (error?.response?.data) {
        const errorData = error.response.data
        
        if (errorData.errors) {
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
                             'An error occurred while submitting your application.'
        }
      } else if (error?.request) {
        this.errorMessage = 'Network error: Unable to reach server. Please check your connection.'
      } else {
        this.errorMessage = error?.message || 'An unexpected error occurred. Please try again.'
      }
    },

    resetForm() {
      this.membershipForm = {
        full_name: '',
        email: '',
        phone: '',
        role: 'chorister',
        experience: ''
      }
      this.formTouched = false
      this.errors = {
        full_name: '',
        email: '',
        phone: '',
        role: ''
      }
    }
  }
}
</script>

<style scoped>
.join-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  
}

.join-header {
  background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%);
  margin-top: -1px;
  
}

.info-card,
.application-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  height: 100%;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--bs-primary), var(--bs-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.info-details h5 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.section-title {
  border-bottom: 2px solid var(--bs-primary);
  padding-bottom: 0.5rem;
}

.quick-info {
  border-left: 4px solid var(--bs-primary);
}

.header-icon {
  opacity: 0.8;
}

/* Button group styling */
.btn-group {
  border-radius: 8px;
  overflow: hidden;
}

.btn-group .btn {
  border-radius: 0;
  flex: 1;
}

/* Form enhancements */
.form-control,
.form-select {
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-section {
  border-top: 2px solid #e9ecef !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .join-header .display-5 {
    font-size: 2rem;
  }
  
  .info-card,
  .application-card {
    padding: 1.5rem;
  }
  
  .info-item {
    flex-direction: column;
    text-align: center;
  }
  
  .info-icon {
    align-self: center;
  }

  .btn-group {
    flex-direction: column;
  }

  .btn-group .btn {
    border-radius: 0;
  }

  .btn-group .btn:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .btn-group .btn:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}

/* Animation for alerts */
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