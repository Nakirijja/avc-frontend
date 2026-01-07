<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Mark Attendance</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label class="form-label">Event Date *</label>
          <input 
            type="date" 
            v-model="formData.eventDate"
            required
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Event Type *</label>
          <select v-model="formData.eventType" required class="form-input">
            <option value="">Select event type</option>
            <option value="practice">Practice Session</option>
            <option value="rehearsal">Rehearsal</option>
            <option value="performance">Performance</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea 
            v-model="formData.description"
            class="form-input"
            rows="3"
            placeholder="Brief description of the event..."
          ></textarea>
        </div>

        <div class="attendance-section">
          <h3>Member Attendance</h3>
          <div class="members-list">
            <div 
              v-for="member in availableMembers" 
              :key="member.id"
              class="member-attendance-item"
            >
              <div class="member-info">
                <img :src="member.avatar" :alt="member.name" class="member-avatar">
                <div>
                  <div class="member-name">{{ member.name }}</div>
                  <div class="member-voice">{{ member.voicePart }}</div>
                </div>
              </div>
              <select 
                v-model="formData.attendance[member.id]"
                class="attendance-status"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline" @click="$emit('close')">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Saving...
          </span>
          <span v-else>Save Attendance</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUIStore } from '@/stores/uiStore'

export default {
  name: 'AttendanceForm',
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const uiStore = useUIStore()
    const loading = ref(false)
    const availableMembers = ref([])

    const formData = ref({
      eventDate: new Date().toISOString().split('T')[0],
      eventType: '',
      description: '',
      attendance: {}
    })

    const fetchMembers = async () => {
      // Simulate API call to fetch members
      availableMembers.value = [
        {
          id: 1,
          name: 'Sarah Johnson',
          voicePart: 'Soprano',
          avatar: '/assets/images/avatars/sarah.jpg'
        },
        {
          id: 2,
          name: 'Michael Brown',
          voicePart: 'Tenor',
          avatar: '/assets/images/avatars/michael.jpg'
        },
        {
          id: 3,
          name: 'Emily Davis',
          voicePart: 'Alto',
          avatar: '/assets/images/avatars/emily.jpg'
        }
      ]

      // Initialize attendance for each member
      availableMembers.value.forEach(member => {
        formData.value.attendance[member.id] = 'present'
      })
    }

    const handleSubmit = async () => {
      if (!formData.value.eventDate || !formData.value.eventType) {
        uiStore.showNotification({
          type: 'error',
          message: 'Please fill in all required fields'
        })
        return
      }

      loading.value = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        emit('save', formData.value)
      } catch (error) {
        uiStore.showNotification({
          type: 'error',
          message: 'Failed to save attendance'
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchMembers()
    })

    return {
      loading,
      availableMembers,
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

.form-group {
  margin-bottom: 1.5rem;
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

.attendance-section {
  margin-top: 2rem;
}

.attendance-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.members-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

.member-attendance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.member-attendance-item:last-child {
  border-bottom: none;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.member-name {
  font-weight: 500;
  color: #2c3e50;
}

.member-voice {
  font-size: 0.8rem;
  color: #7f8c8d;
  text-transform: capitalize;
}

.attendance-status {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  min-width: 100px;
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
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .member-attendance-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .attendance-status {
    align-self: flex-end;
  }
}
</style>