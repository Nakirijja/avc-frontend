<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ editingMember ? 'Edit Member' : 'Add New Member' }}</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input 
              type="text" 
              v-model="formData.name"
              required
              class="form-input"
              placeholder="Enter full name"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input 
              type="email" 
              v-model="formData.email"
              required
              class="form-input"
              placeholder="Enter email address"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input 
              type="tel" 
              v-model="formData.phone"
              required
              class="form-input"
              placeholder="Enter phone number"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Voice Part *</label>
            <select v-model="formData.voicePart" required class="form-input">
              <option value="">Select voice part</option>
              <option value="soprano">Soprano</option>
              <option value="alto">Alto</option>
              <option value="tenor">Tenor</option>
              <option value="bass">Bass</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status *</label>
            <select v-model="formData.status" required class="form-input">
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Join Date</label>
            <input 
              type="date" 
              v-model="formData.joinDate"
              class="form-input"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Address</label>
          <textarea 
            v-model="formData.address"
            class="form-input"
            rows="3"
            placeholder="Enter residential address"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Emergency Contact</label>
          <div class="emergency-contact">
            <input 
              type="text" 
              v-model="formData.emergencyContact.name"
              class="form-input"
              placeholder="Contact name"
            >
            <input 
              type="tel" 
              v-model="formData.emergencyContact.phone"
              class="form-input"
              placeholder="Contact phone"
            >
            <input 
              type="text" 
              v-model="formData.emergencyContact.relationship"
              class="form-input"
              placeholder="Relationship"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Additional Notes</label>
          <textarea 
            v-model="formData.notes"
            class="form-input"
            rows="3"
            placeholder="Any additional information..."
          ></textarea>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline" @click="$emit('close')">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmit" :disabled="loading">
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Saving...
          </span>
          <span v-else>{{ editingMember ? 'Update' : 'Add' }} Member</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ChoristerForm',
  props: {
    member: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const loading = ref(false)
    const editingMember = ref(props.member)

    const formData = ref({
      name: '',
      email: '',
      phone: '',
      voicePart: '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      address: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      notes: ''
    })

    // Initialize form with member data if editing
    watch(() => props.member, (newMember) => {
      editingMember.value = newMember
      if (newMember) {
        formData.value = { ...formData.value, ...newMember }
      } else {
        // Reset form for new member
        formData.value = {
          name: '',
          email: '',
          phone: '',
          voicePart: '',
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          address: '',
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          },
          notes: ''
        }
      }
    }, { immediate: true })

    const handleSubmit = async () => {
      // Basic validation
      if (!formData.value.name || !formData.value.email || !formData.value.voicePart) {
        alert('Please fill in all required fields')
        return
      }

      loading.value = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        emit('save', {
          ...formData.value,
          id: editingMember.value?.id || null
        })
      } catch (error) {
        console.error('Error saving member:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      editingMember,
      formData,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.emergency-contact {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 0 0 10px 10px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .emergency-contact {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>