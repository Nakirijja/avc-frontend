<!-- src/components/virtual-practice/PracticeFormModal.vue -->
<template>
  <div class="modal-backdrop fade show" @click.self="closeModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="fas fa-calendar-plus me-2"></i>
            {{ isEditing ? 'Edit Practice Session' : 'Schedule New Practice Session' }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Title -->
            <div class="mb-3">
              <label for="practiceTitle" class="form-label">Practice Title *</label>
              <input
                type="text"
                class="form-control"
                id="practiceTitle"
                v-model="formData.title"
                placeholder="e.g., Weekly Rehearsal - Soprano Section"
                required
              />
              <div class="form-text">Give your practice session a descriptive title</div>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label for="practiceDescription" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="practiceDescription"
                v-model="formData.description"
                rows="3"
                placeholder="Describe what this practice session will focus on..."
              ></textarea>
            </div>

            <div class="row">
              <!-- Date -->
              <div class="col-md-6 mb-3">
                <label for="practiceDate" class="form-label">Date & Time *</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  id="practiceDate"
                  v-model="formData.date"
                  :min="minDate"
                  required
                />
              </div>

              <!-- Duration -->
              <div class="col-md-6 mb-3">
                <label for="practiceDuration" class="form-label">Duration (minutes) *</label>
                <select
                  class="form-select"
                  id="practiceDuration"
                  v-model="formData.duration"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="1800">30 minutes</option>
                  <option value="2700">45 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="5400">1.5 hours</option>
                  <option value="7200">2 hours</option>
                  <option value="9000">2.5 hours</option>
                  <option value="10800">3 hours</option>
                </select>
              </div>
            </div>

            <!-- Meeting Link -->
            <div class="mb-3">
              <label for="resourceLink" class="form-label">Video Conference Link</label>
              <input
                type="url"
                class="form-control"
                id="resourceLink"
                v-model="formData.resource_link"
                placeholder="https://meet.google.com/abc-def-ghi or Zoom link"
              />
              <div class="form-text">Provide the meeting link for virtual practice</div>
            </div>

            <!-- Voice Parts (Optional) -->
            <div class="mb-3">
              <label class="form-label">Voice Parts (Optional)</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="Soprano"
                  id="voiceSoprano"
                  v-model="formData.voice_parts"
                />
                <label class="form-check-label" for="voiceSoprano">Soprano</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="Alto"
                  id="voiceAlto"
                  v-model="formData.voice_parts"
                />
                <label class="form-check-label" for="voiceAlto">Alto</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="Tenor"
                  id="voiceTenor"
                  v-model="formData.voice_parts"
                />
                <label class="form-check-label" for="voiceTenor">Tenor</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="Bass"
                  id="voiceBass"
                  v-model="formData.voice_parts"
                />
                <label class="form-check-label" for="voiceBass">Bass</label>
              </div>
            </div>

            <!-- Expected Participants -->
            <div class="mb-3">
              <label for="expectedParticipants" class="form-label">Expected Participants</label>
              <input
                type="number"
                class="form-control"
                id="expectedParticipants"
                v-model="formData.expected_participants"
                min="1"
                max="100"
                placeholder="e.g., 15"
              />
              <div class="form-text">Estimated number of participants</div>
            </div>

            <!-- Additional Options -->
            <div class="mb-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="sendNotifications"
                  v-model="formData.send_notifications"
                />
                <label class="form-check-label" for="sendNotifications">
                  Send notifications to participants
                </label>
              </div>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="alert alert-danger" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ error }}
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="closeModal">
            <i class="fas fa-times me-1"></i>Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-danger" 
            v-if="isEditing" 
            @click="deletePractice"
            :disabled="processing"
          >
            <i class="fas fa-trash me-1"></i>Delete
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="submitForm"
            :disabled="processing"
          >
            <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-1"></i>
            {{ isEditing ? 'Update' : 'Create' }} Practice
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PracticeFormModal',
  props: {
    practice: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        title: '',
        description: '',
        date: '',
        duration: '',
        resource_link: '',
        voice_parts: [],
        expected_participants: null,
        send_notifications: true
      },
      processing: false,
      error: null
    }
  },
  computed: {
    isEditing() {
      return this.practice !== null
    },
    minDate() {
      // Set minimum date to current date/time
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      return now.toISOString().slice(0, 16)
    }
  },
  watch: {
    practice: {
      immediate: true,
      handler(newPractice) {
        if (newPractice) {
          this.loadPracticeData(newPractice)
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    loadPracticeData(practice) {
      this.formData = {
        title: practice.title || '',
        description: practice.description || '',
        date: this.formatDateForInput(practice.date),
        duration: practice.duration ? practice.duration.toString() : '3600',
        resource_link: practice.resource_link || '',
        voice_parts: practice.voice_parts || [],
        expected_participants: practice.expected_participants || null,
        send_notifications: true
      }
    },
    
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        date: '',
        duration: '3600', // Default to 1 hour
        resource_link: '',
        voice_parts: [],
        expected_participants: null,
        send_notifications: true
      }
      this.error = null
    },
    
    formatDateForInput(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      // Format for datetime-local input: YYYY-MM-DDTHH:MM
      return date.toISOString().slice(0, 16)
    },
    
    async submitForm() {
      // Basic validation
      if (!this.formData.title.trim()) {
        this.error = 'Please enter a practice title'
        return
      }
      
      if (!this.formData.date) {
        this.error = 'Please select a date and time'
        return
      }
      
      if (!this.formData.duration) {
        this.error = 'Please select a duration'
        return
      }
      
      this.processing = true
      this.error = null
      
      try {
        // Prepare data for API
        const submitData = {
          title: this.formData.title.trim(),
          description: this.formData.description.trim(),
          date: new Date(this.formData.date).toISOString(),
          duration: parseInt(this.formData.duration),
          resource_link: this.formData.resource_link.trim(),
          expected_participants: this.formData.expected_participants,
          send_notifications: this.formData.send_notifications
        }
        
        // Add voice parts if any selected
        if (this.formData.voice_parts.length > 0) {
          submitData.voice_parts = this.formData.voice_parts
        }
        
        // Emit save event to parent
        this.$emit('save', submitData)
        
      } catch (error) {
        console.error('Error in form submission:', error)
        this.error = 'Failed to save practice session. Please try again.'
      } finally {
        this.processing = false
      }
    },
    
    async deletePractice() {
      if (!this.practice || !confirm('Are you sure you want to delete this practice session? This action cannot be undone.')) {
        return
      }
      
      this.processing = true
      try {
        // Emit delete event to parent
        this.$emit('delete', this.practice.id)
        this.closeModal()
      } catch (error) {
        console.error('Error deleting practice:', error)
        this.error = 'Failed to delete practice session. Please try again.'
      } finally {
        this.processing = false
      }
    },
    
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-content {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-radius: 0.75rem 0.75rem 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 0.75rem 0.75rem;
}

.form-check {
  margin-bottom: 0.25rem;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }
  
  .modal-content {
    margin: 0;
  }
}

/* Custom scrollbar for modal body */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>