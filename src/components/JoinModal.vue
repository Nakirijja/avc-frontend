<!-- src/components/JoinModal.vue -->
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">Join Our Choir Family</h2>
        <button class="close-button" @click="closeModal" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Modal Progress -->
      <div class="modal-progress">
        <div class="progress-steps">
          <div 
            v-for="step in steps" 
            :key="step.id"
            :class="['step', { active: currentStep === step.id, completed: currentStep > step.id }]"
          >
            <div class="step-number">{{ step.id }}</div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>
      </div>

      <!-- Step 1: Personal Information -->
      <div v-if="currentStep === 1" class="modal-step">
        <div class="step-header">
          <h3>Tell Us About Yourself</h3>
          <p>We're excited to learn more about you and your musical journey!</p>
        </div>

        <form @submit.prevent="nextStep" class="join-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input 
                id="firstName"
                v-model="formData.firstName"
                type="text" 
                required
                placeholder="Enter your first name"
              >
            </div>
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input 
                id="lastName"
                v-model="formData.lastName"
                type="text" 
                required
                placeholder="Enter your last name"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address *</label>
            <input 
              id="email"
              v-model="formData.email"
              type="email" 
              required
              placeholder="your.email@example.com"
            >
          </div>

          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input 
              id="phone"
              v-model="formData.phone"
              type="tel" 
              required
              placeholder="+256 XXX XXX XXX"
            >
          </div>

          <div class="form-group">
            <label for="age">Age *</label>
            <select id="age" v-model="formData.age" required>
              <option value="">Select your age range</option>
              <option value="16-25">16-25 years</option>
              <option value="26-35">26-35 years</option>
              <option value="36-45">36-45 years</option>
              <option value="46-55">46-55 years</option>
              <option value="56+">56+ years</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Continue to Voice Section <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Voice Section & Experience -->
      <div v-else-if="currentStep === 2" class="modal-step">
        <div class="step-header">
          <h3>Your Musical Background</h3>
          <p>Help us find the perfect voice section for you</p>
        </div>

        <form @submit.prevent="nextStep" class="join-form">
          <!-- Voice Section Selection -->
          <div class="form-group">
            <label>Which voice section interests you? *</label>
            <div class="voice-options">
              <div 
                v-for="section in voiceSections" 
                :key="section.name"
                :class="['voice-option', { selected: formData.preferredSection === section.name }]"
                @click="formData.preferredSection = section.name"
              >
                <div class="voice-icon" :style="{ background: section.color }">
                  <i :class="section.icon"></i>
                </div>
                <div class="voice-info">
                  <h4>{{ section.name }}</h4>
                  <p>{{ section.range }}</p>
                  <small>{{ section.description }}</small>
                </div>
                <div class="selection-indicator">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Singing Experience -->
          <div class="form-group">
            <label for="experience">Previous Singing Experience *</label>
            <select id="experience" v-model="formData.experience" required>
              <option value="">Select your experience level</option>
              <option value="none">No formal experience</option>
              <option value="casual">Casual singing (shower singer!)</option>
              <option value="school">School or church choir</option>
              <option value="community">Community choir</option>
              <option value="professional">Professional/semi-professional</option>
            </select>
          </div>

          <!-- Instrument Experience -->
          <div class="form-group">
            <label>Do you play any instruments?</label>
            <div class="checkbox-group">
              <label v-for="instrument in instruments" :key="instrument" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="instrument"
                  v-model="formData.instruments"
                >
                <span class="checkmark"></span>
                {{ instrument }}
              </label>
            </div>
          </div>

          <!-- Availability -->
          <div class="form-group">
            <label>Which rehearsal days work for you? *</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  value="wednesday"
                  v-model="formData.availability"
                >
                <span class="checkmark"></span>
                Wednesdays (6:00-8:00 PM)
              </label>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  value="friday"
                  v-model="formData.availability"
                >
                <span class="checkmark"></span>
                Fridays (6:00-8:00 PM)
              </label>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  value="both"
                  v-model="formData.availability"
                >
                <span class="checkmark"></span>
                Both days
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="prevStep">
              <i class="fas fa-arrow-left"></i> Back
            </button>
            <button type="submit" class="btn btn-primary">
              Continue to Final Step <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 3: Final Questions & Submission -->
      <div v-else-if="currentStep === 3" class="modal-step">
        <div class="step-header">
          <h3>Almost There!</h3>
          <p>Just a few more questions to complete your application</p>
        </div>

        <form @submit.prevent="submitApplication" class="join-form">
          <!-- Motivation -->
          <div class="form-group">
            <label for="motivation">What motivates you to join our choir? *</label>
            <textarea 
              id="motivation"
              v-model="formData.motivation"
              rows="4"
              required
              placeholder="Share what draws you to sacred music and our choir community..."
            ></textarea>
          </div>

          <!-- How did you hear about us -->
          <div class="form-group">
            <label for="referral">How did you hear about Angels Voices Choir?</label>
            <select id="referral" v-model="formData.referral">
              <option value="">Please select...</option>
              <option value="friend">Friend or family member</option>
              <option value="church">St. Gyaviira Church service</option>
              <option value="social">Social media (Facebook, Instagram)</option>
              <option value="website">Our website</option>
              <option value="poster">Poster or flyer</option>
              <option value="event">Community event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Emergency Contact -->
          <div class="form-group">
            <label for="emergencyContact">Emergency Contact Name & Number</label>
            <input 
              id="emergencyContact"
              v-model="formData.emergencyContact"
              type="text"
              placeholder="Name and phone number"
            >
          </div>

          <!-- Medical Information -->
          <div class="form-group">
            <label>Any medical conditions we should be aware of?</label>
            <textarea 
              v-model="formData.medicalInfo"
              rows="3"
              placeholder="This helps us ensure your safety and comfort during rehearsals and performances"
            ></textarea>
          </div>

          <!-- Agreement -->
          <div class="agreement-section">
            <label class="agreement-label">
              <input 
                type="checkbox" 
                v-model="formData.agreedToTerms"
                required
              >
              <span class="checkmark"></span>
              I agree to the <a href="#" @click.prevent="showTerms">Terms & Conditions</a> and 
              <a href="#" @click.prevent="showPrivacy">Privacy Policy</a> *
            </label>

            <label class="agreement-label">
              <input 
                type="checkbox" 
                v-model="formData.agreedToCommitment"
                required
              >
              <span class="checkmark"></span>
              I understand this is a commitment to regular rehearsals and performances *
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="prevStep">
              <i class="fas fa-arrow-left"></i> Back
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="!canSubmit"
            >
              <i class="fas fa-paper-plane"></i>
              Submit Application
              <span v-if="isSubmitting" class="loading-spinner"></span>
            </button>
          </div>
        </form>
      </div>

      <!-- Success Step -->
      <div v-else-if="currentStep === 4" class="modal-step success-step">
        <div class="success-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Welcome to the Family!</h3>
          <p class="success-message">
            Thank you, <strong>{{ formData.firstName }}</strong>! Your application has been received.
            Our choir director will contact you within 24 hours to schedule your free trial session.
          </p>
          
          <div class="next-steps">
            <h4>What happens next?</h4>
            <ul>
              <li>
                <i class="fas fa-phone"></i>
                <span>We'll call you to welcome you and answer any questions</span>
              </li>
              <li>
                <i class="fas fa-calendar-check"></i>
                <span>Schedule your free trial rehearsal session</span>
              </li>
              <li>
                <i class="fas fa-music"></i>
                <span>Meet our choir family and find your voice section</span>
              </li>
              <li>
                <i class="fas fa-file-pdf"></i>
                <span>Receive your welcome package via email</span>
              </li>
            </ul>
          </div>

          <div class="immediate-actions">
            <button class="btn btn-outline" @click="closeModal">
              <i class="fas fa-download"></i>
              Download Welcome PDF
            </button>
            <button class="btn btn-primary" @click="closeModal">
              <i class="fas fa-home"></i>
              Return to Homepage
            </button>
          </div>

          <div class="contact-reminder">
            <p>
              <strong>Questions?</strong> Call us at 
              <a href="tel:+256700123456">+256-700-123-456</a> or email 
              <a href="mailto:join@angelsvoiceschoir.org">join@angelsvoiceschoir.org</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'JoinModal',
  emits: ['close'],
  setup(props, { emit }) {
    const currentStep = ref(1)
    const isSubmitting = ref(false)
    
    const steps = [
      { id: 1, label: 'Personal Info' },
      { id: 2, label: 'Voice & Experience' },
      { id: 3, label: 'Final Details' }
    ]

    const formData = ref({
      // Step 1
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      
      // Step 2
      preferredSection: '',
      experience: '',
      instruments: [],
      availability: [],
      
      // Step 3
      motivation: '',
      referral: '',
      emergencyContact: '',
      medicalInfo: '',
      agreedToTerms: false,
      agreedToCommitment: false
    })

    const voiceSections = ref([
      {
        name: 'Soprano',
        range: 'C4 - C6',
        description: 'Carry melodies with clarity and angelic purity',
        icon: 'fas fa-arrow-up',
        color: 'linear-gradient(135deg, #e91e63, #ad1457)'
      },
      {
        name: 'Alto',
        range: 'G3 - F5',
        description: 'Provide warm, rich harmonic foundation',
        icon: 'fas fa-arrows-alt-h',
        color: 'linear-gradient(135deg, #9c27b0, #7b1fa2)'
      },
      {
        name: 'Tenor',
        range: 'C3 - C5',
        description: 'Add brilliance with higher male voice',
        icon: 'fas fa-arrow-up',
        color: 'linear-gradient(135deg, #2196f3, #1976d2)'
      },
      {
        name: 'Bass',
        range: 'E2 - E4',
        description: 'Create deep, resonant foundation',
        icon: 'fas fa-arrow-down',
        color: 'linear-gradient(135deg, #3f51b5, #303f9f)'
      },
      {
        name: 'Unsure',
        range: 'Not sure yet',
        description: "I'd like help finding my voice section",
        icon: 'fas fa-question',
        color: 'linear-gradient(135deg, #ff9800, #f57c00)'
      }
    ])

    const instruments = [
      'Piano', 'Guitar', 'Violin', 'Drums', 'Flute', 'Trumpet', 'Other'
    ]

    const canSubmit = computed(() => {
      return formData.value.agreedToTerms && 
             formData.value.agreedToCommitment &&
             formData.value.motivation.trim().length > 0
    })

    const nextStep = () => {
      if (currentStep.value < 4) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const submitApplication = async () => {
      isSubmitting.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Move to success step
        currentStep.value = 4
        
        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData.value)
        
        // You might want to send this to your email service or database
        // await sendApplication(formData.value)
        
      } catch (error) {
        console.error('Error submitting application:', error)
        alert('There was an error submitting your application. Please try again.')
      } finally {
        isSubmitting.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const showTerms = () => {
      alert('Terms and conditions would be displayed here.')
    }

    const showPrivacy = () => {
      alert('Privacy policy would be displayed here.')
    }

    // Reset form when modal opens
    watch(() => formData.value, (newVal) => {
      // You can add form validation here
    }, { deep: true })

    return {
      currentStep,
      steps,
      formData,
      voiceSections,
      instruments,
      isSubmitting,
      canSubmit,
      nextStep,
      prevStep,
      submitApplication,
      closeModal,
      showTerms,
      showPrivacy
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #475569;
}

.modal-progress {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, #FFD700, #D4AF37);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-align: center;
}

.step.active .step-label {
  color: #1e293b;
}

.modal-step {
  padding: 2rem;
}

.step-header {
  text-align: center;
  margin-bottom: 2rem;
}

.step-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.step-header p {
  color: #64748b;
  margin: 0;
}

.join-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Voice Options */
.voice-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.voice-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.voice-option:hover {
  border-color: #cbd5e1;
}

.voice-option.selected {
  border-color: #3b82f6;
  background: #f8fafc;
}

.voice-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.voice-info {
  flex: 1;
}

.voice-info h4 {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-weight: 600;
}

.voice-info p {
  margin: 0 0 0.25rem 0;
  color: #64748b;
  font-weight: 500;
}

.voice-info small {
  color: #94a3b8;
  font-size: 0.8rem;
}

.selection-indicator {
  opacity: 0;
  color: #3b82f6;
  font-size: 1.25rem;
  transition: opacity 0.2s ease;
}

.voice-option.selected .selection-indicator {
  opacity: 1;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkbox-label:hover {
  border-color: #cbd5e1;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  margin-right: 0.75rem;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Agreement Section */
.agreement-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  cursor: pointer;
}

.agreement-label:last-child {
  margin-bottom: 0;
}

.agreement-label a {
  color: #3b82f6;
  text-decoration: none;
}

.agreement-label a:hover {
  text-decoration: underline;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #FFD700, #D4AF37);
  border-color: transparent;
  color: #1e293b;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: white;
  border-color: #cbd5e1;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #94a3b8;
  color: #475569;
}

/* Success Step */
.success-step {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1.5rem;
}

.success-message {
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 2rem;
}

.next-steps {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  text-align: left;
}

.next-steps h4 {
  color: #1e293b;
  margin-bottom: 1rem;
  text-align: center;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #475569;
}

.next-steps li:last-child {
  margin-bottom: 0;
}

.next-steps li i {
  color: #3b82f6;
  width: 20px;
}

.immediate-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.contact-reminder {
  background: #fff7ed;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fed7aa;
}

.contact-reminder a {
  color: #ea580c;
  text-decoration: none;
}

.contact-reminder a:hover {
  text-decoration: underline;
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 0.5rem;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
  .modal-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .modal-step {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .immediate-actions {
    flex-direction: column;
  }
  
  .progress-steps {
    gap: 0.5rem;
  }
  
  .step-label {
    font-size: 0.7rem;
  }
}
</style>