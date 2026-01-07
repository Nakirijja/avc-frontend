<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content event-form-modal">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Edit Event' : 'Create Event' }}</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Basic Info -->
        <div class="form-group">
          <label>Title *</label>
          <input type="text" v-model="formData.title" required />
        </div>
        <div class="form-group">
          <label>Type *</label>
          <select v-model="formData.type" required>
            <option value="">Select type</option>
            <option value="practice">Practice</option>
            <option value="rehearsal">Rehearsal</option>
            <option value="performance">Performance</option>
            <option value="meeting">Meeting</option>
            <option value="workshop">Workshop</option>
            <option value="social">Social</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status *</label>
          <select v-model="formData.status" required>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea v-model="formData.description" required></textarea>
        </div>

        <div class="form-group">
          <label>Start *</label>
          <input type="datetime-local" v-model="formData.startDate" required />
        </div>
        <div class="form-group">
          <label>End *</label>
          <input type="datetime-local" v-model="formData.endDate" required />
        </div>

        <div class="form-group">
          <label>Location *</label>
          <input type="text" v-model="formData.location" required />
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'EventForm',
  props: { event: { type: Object, default: null } },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const isEditing = computed(() => !!props.event)
    const loading = ref(false)
    const formData = ref({
      title: '',
      type: '',
      status: 'upcoming',
      description: '',
      startDate: '',
      endDate: '',
      location: ''
    })

    watch(() => props.event, (val) => {
      if (val) formData.value = { ...val }
    }, { immediate: true })

    const handleSubmit = async () => {
      loading.value = true
      try {
        emit('save', { ...formData.value })
      } finally {
        loading.value = false
      }
    }

    return { formData, isEditing, handleSubmit, loading }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content { background: #fff; border-radius: 8px; width: 500px; padding: 1rem; }
.modal-header { display: flex; justify-content: space-between; align-items: center; }
.form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
</style>
