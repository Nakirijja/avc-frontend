<!-- src/components/events/EventCard.vue -->
<template>
  <div class="event-card card border-0 shadow-sm h-100">
    <div class="card-body">
      <!-- Event Header -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span class="badge mb-2" :class="getTypeBadgeClass(event.type)">
            {{ getTypeDisplay(event.type) }}
          </span>
          <span class="badge ms-1" :class="getStatusBadgeClass(event.status)">
            {{ getStatusDisplay(event.status) }}
          </span>
        </div>
        <div class="dropdown" v-if="isAdmin">
          <button class="btn btn-sm btn-outline-secondary border-0" type="button" data-bs-toggle="dropdown">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" @click="$emit('edit', event)"><i class="fas fa-edit me-2"></i>Edit</a></li>
            <li><a class="dropdown-item text-danger" href="#" @click="$emit('delete', event.id)"><i class="fas fa-trash me-2"></i>Delete</a></li>
          </ul>
        </div>
      </div>

      <!-- Event Title -->
      <h5 class="card-title text-primary">{{ event.title }}</h5>
      
      <!-- Event Description -->
      <p class="card-text text-muted small">{{ truncateDescription(event.description) }}</p>

      <!-- Event Details -->
      <div class="event-details">
        <div class="d-flex align-items-center mb-2">
          <i class="fas fa-calendar text-primary me-2"></i>
          <small>{{ formatDate(event.start_date) }}</small>
        </div>
        <div class="d-flex align-items-center mb-2">
          <i class="fas fa-clock text-primary me-2"></i>
          <small>{{ formatTime(event.start_date) }} - {{ formatTime(event.end_date) }}</small>
        </div>
        <div class="d-flex align-items-center mb-3">
          <i class="fas fa-map-marker-alt text-primary me-2"></i>
          <small class="text-truncate">{{ event.location }}</small>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-grid gap-2">
        <button class="btn btn-outline-primary btn-sm" @click="$emit('view', event)">
          <i class="fas fa-eye me-1"></i> View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    event: Object,
    isAdmin: Boolean
  },
  methods: {
    getTypeBadgeClass(type) {
      const classes = {
        practice: 'bg-primary',
        rehearsal: 'bg-info',
        performance: 'bg-success',
        meeting: 'bg-secondary',
        workshop: 'bg-warning',
        social: 'bg-purple'
      }
      return classes[type] || 'bg-secondary'
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        upcoming: 'bg-success',
        ongoing: 'bg-warning',
        completed: 'bg-secondary',
        cancelled: 'bg-danger'
      }
      return classes[status] || 'bg-secondary'
    },
    
    getTypeDisplay(type) {
      const types = {
        practice: 'Practice',
        rehearsal: 'Rehearsal',
        performance: 'Performance',
        meeting: 'Meeting',
        workshop: 'Workshop',
        social: 'Social'
      }
      return types[type] || type
    },
    
    getStatusDisplay(status) {
      const statuses = {
        upcoming: 'Upcoming',
        ongoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
      return statuses[status] || status
    },
    
    truncateDescription(description) {
      return description.length > 120 ? description.substring(0, 120) + '...' : description
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    formatTime(dateString) {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.event-card {
  transition: all 0.3s ease;
  border-radius: 0.75rem;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

.card-text {
  min-height: 40px;
}

.event-details small {
  font-size: 0.85rem;
}

.dropdown-toggle::after {
  display: none;
}
</style>