<template>
  <div class="event-detail-page">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="container py-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/" class="text-decoration-none">
            <i class="fas fa-home me-1"></i>Home
          </router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/events" class="text-decoration-none">Events</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ event ? event.title : 'Event Details' }}</li>
      </ol>
    </nav>

    <div class="container py-4">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading event details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger text-center">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Unable to load event</strong>
        <p class="mb-0">{{ error }}</p>
        <router-link to="/events" class="btn btn-primary mt-2">
          <i class="fas fa-arrow-left me-1"></i> Back to Events
        </router-link>
      </div>

      <!-- Event Content -->
      <div v-else-if="event" class="row">
        <!-- Main Content -->
        <div class="col-lg-8">
          <!-- Event Header -->
          <div class="event-header mb-4">
            <div class="event-badges mb-3">
              <span class="badge bg-primary me-2">{{ formatEventType(event.type) }}</span>
              <span class="badge" :class="getStatusClass(event.status)">
                {{ formatEventStatus(event.status) }}
              </span>
              <span v-if="event.is_featured" class="badge bg-warning text-dark ms-2">
                <i class="fas fa-star me-1"></i>Featured
              </span>
            </div>
            
            <h1 class="event-title mb-3">{{ event.title }}</h1>
            
            <!-- Event Meta -->
            <div class="event-meta d-flex flex-wrap gap-3 mb-4">
              <div class="meta-item">
                <i class="fas fa-calendar-alt me-2 text-primary"></i>
                <strong>Date:</strong> {{ formatEventDate(event) }}
              </div>
              <div class="meta-item">
                <i class="fas fa-clock me-2 text-primary"></i>
                <strong>Time:</strong> {{ formatEventTime(event) }}
              </div>
              <div class="meta-item">
                <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                <strong>Location:</strong> {{ event.location }}
              </div>
              <div v-if="event.max_attendees > 0" class="meta-item">
                <i class="fas fa-users me-2 text-primary"></i>
                <strong>Capacity:</strong> {{ event.max_attendees }} people
              </div>
            </div>
          </div>

          <!-- Event Image -->
          <div v-if="event.image" class="mb-4">
            <div class="event-image-container rounded overflow-hidden shadow">
              <img 
                :src="getEventImage(event.image)" 
                :alt="event.title"
                class="img-fluid w-100"
                style="max-height: 400px; object-fit: cover;"
              >
            </div>
          </div>

          <!-- Event Description -->
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="fas fa-info-circle me-2 text-primary"></i>
                Event Description
              </h3>
              <div class="event-description" v-html="formatDescription(event.description)"></div>
              
              <!-- Location Details -->
              <div v-if="event.location_details" class="mt-4">
                <h5 class="mb-3">
                  <i class="fas fa-map-pin me-2 text-primary"></i>
                  Location Details
                </h5>
                <p class="mb-0">{{ event.location_details }}</p>
              </div>
              
              <!-- Important Notes -->
              <div v-if="event.location_notes" class="mt-4 p-3 bg-light rounded">
                <h6 class="mb-2">
                  <i class="fas fa-exclamation-circle me-2 text-warning"></i>
                  Important Notes
                </h6>
                <p class="mb-0">{{ event.location_notes }}</p>
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div v-if="event.schedule && event.schedule.length > 0" class="card mb-4 shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="fas fa-list-alt me-2 text-primary"></i>
                Event Schedule
              </h3>
              <div class="timeline">
                <div 
                  v-for="(item, index) in event.schedule" 
                  :key="index" 
                  class="timeline-item"
                >
                  <div class="timeline-time">{{ item.time }}</div>
                  <div class="timeline-content">
                    <h5 class="mb-1">{{ item.title }}</h5>
                    <p class="mb-0 text-muted" v-if="item.description">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div v-if="event.additional_notes" class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-3">
                <i class="fas fa-sticky-note me-2 text-primary"></i>
                Additional Information
              </h3>
              <div class="additional-notes" v-html="formatDescription(event.additional_notes)"></div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- RSVP Card -->
          <div class="card mb-4 shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title mb-4">
                <i class="fas fa-calendar-check me-2 text-primary"></i>
                Attend this Event
              </h5>
              
              <!-- Attendance Progress -->
              <div v-if="event.max_attendees > 0" class="mb-4">
                <div class="progress mb-2" style="height: 10px;">
                  <div 
                    class="progress-bar bg-success" 
                    :style="{ width: `${getAttendancePercentage(event)}%` }"
                  ></div>
                </div>
                <small class="text-muted">
                  {{ event.rsvp_count || 0 }} of {{ event.max_attendees }} spots filled
                  <br>
                  <strong>{{ getRemainingSpots(event) }} spots remaining</strong>
                </small>
              </div>
              
              <!-- RSVP Button -->
              <button 
                v-if="canRSVP"
                @click="submitRSVP"
                class="btn btn-primary btn-lg w-100 mb-3"
                :disabled="rsvping"
              >
                <template v-if="rsvping">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </template>
                <template v-else>
                  <i class="fas fa-calendar-check me-2"></i>
                  RSVP Now
                </template>
              </button>
              
              <!-- Already RSVPed -->
              <button 
                v-else-if="hasRSVPed"
                class="btn btn-success btn-lg w-100 mb-3"
                disabled
              >
                <i class="fas fa-check-circle me-2"></i>
                You're Attending
              </button>
              
              <!-- Event Full -->
              <button 
                v-else
                class="btn btn-secondary btn-lg w-100 mb-3"
                disabled
              >
                <i class="fas fa-calendar-times me-2"></i>
                Event Full
              </button>
              
              <!-- Action Buttons -->
              <div class="d-grid gap-2">
                <button @click="shareEvent" class="btn btn-outline-primary">
                  <i class="fas fa-share-alt me-2"></i>Share Event
                </button>
                <button @click="addToCalendar" class="btn btn-outline-secondary">
                  <i class="fas fa-calendar-plus me-2"></i>Add to Calendar
                </button>
              </div>
            </div>
          </div>

          <!-- Organizer Info -->
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-user-tie me-2 text-primary"></i>
                Event Organizer
              </h5>
              <div class="organizer-info">
                <div class="d-flex align-items-center mb-3">
                  <div class="organizer-avatar me-3">
                    <i class="fas fa-user-circle fa-3x text-muted"></i>
                  </div>
                  <div>
                    <h6 class="mb-1">{{ event.created_by || 'AVC Choir Team' }}</h6>
                    <p class="text-muted mb-0 small">Event Coordinator</p>
                  </div>
                </div>
                <div class="organizer-contact">
                  <p class="mb-2 small">
                    <i class="fas fa-envelope me-2 text-muted"></i>
                    <a href="mailto:info@avcchoir.org" class="text-decoration-none">
                      info@avcchoir.org
                    </a>
                  </p>
                  <p class="mb-0 small">
                    <i class="fas fa-phone me-2 text-muted"></i>
                    <a href="tel:+256700123456" class="text-decoration-none">+256 700 123 456</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Info -->
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-info-circle me-2 text-primary"></i>
                Quick Info
              </h5>
              <ul class="list-unstyled mb-0">
                <li class="mb-2">
                  <i class="fas fa-calendar-day me-2 text-muted"></i>
                  <strong>Date:</strong> {{ formatShortDate(event.date) }}
                </li>
                <li class="mb-2">
                  <i class="fas fa-clock me-2 text-muted"></i>
                  <strong>Time:</strong> {{ formatEventTime(event) }}
                </li>
                <li class="mb-2">
                  <i class="fas fa-map-marker-alt me-2 text-muted"></i>
                  <strong>Venue:</strong> {{ event.location }}
                </li>
                <li class="mb-2" v-if="event.location_details">
                  <i class="fas fa-building me-2 text-muted"></i>
                  <strong>Venue Details:</strong> {{ event.location_details }}
                </li>
                <li>
                  <i class="fas fa-users me-2 text-muted"></i>
                  <strong>Type:</strong> {{ formatEventType(event.type) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService, authHelper } from '@/services/api'

export default {
  name: 'EventDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const event = ref(null)
    const loading = ref(true)
    const rsvping = ref(false)
    const error = ref(null)
    const userRSVP = ref(null)

    // Fetch event details
    const loadEvent = async () => {
      loading.value = true
      error.value = null
      try {
        const eventId = route.params.id
        const response = await apiService.events.getEvent(eventId)
        event.value = response.data
        
        // Check if user has RSVPed
        await checkUserRSVP()
        
      } catch (err) {
        console.error('Error loading event:', err)
        error.value = 'Unable to load event details. Please try again.'
      } finally {
        loading.value = false
      }
    }

    // Check if user has RSVPed
    const checkUserRSVP = async () => {
      if (!authHelper.isAuthenticated()) {
        userRSVP.value = null
        return
      }
      
      try {
        // Try to get user's RSVP for this event
        const eventId = route.params.id
        const response = await apiService.events.getUserRSVP(eventId)
        userRSVP.value = response.data
      } catch (err) {
        // If 404, user hasn't RSVPed
        if (err.response?.status === 404) {
          userRSVP.value = null
        } else {
          console.error('Error checking RSVP:', err)
        }
      }
    }

    // Formatting functions
    const formatEventDate = (event) => {
      if (!event.date) return 'Date to be announced'
      try {
        const date = new Date(event.date)
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return event.date
      }
    }

    const formatShortDate = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch {
        return dateString
      }
    }

    const formatEventTime = (event) => {
      if (event.start_time && event.end_time) {
        return `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
      } else if (event.time) {
        return event.time
      }
      return 'Time to be announced'
    }

    const formatTime = (timeString) => {
      if (!timeString) return ''
      try {
        const [hours, minutes] = timeString.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
      } catch {
        return timeString
      }
    }

    const formatDescription = (text) => {
      if (!text) return 'No description available'
      // Convert newlines to paragraphs
      const paragraphs = text.split('\n').filter(p => p.trim() !== '')
      return paragraphs.map(p => `<p>${p}</p>`).join('')
    }

    const formatEventType = (type) => {
      const typeMap = {
        'practice': 'Practice',
        'rehearsal': 'Rehearsal',
        'performance': 'Performance',
        'meeting': 'Meeting',
        'workshop': 'Workshop',
        'social': 'Social Event'
      }
      return typeMap[type] || type
    }

    const formatEventStatus = (status) => {
      const statusMap = {
        'upcoming': 'Upcoming',
        'ongoing': 'Ongoing',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }

    const getEventImage = (imageUrl) => {
      if (!imageUrl) {
        return 'https://picsum.photos/800/400?random=1'
      }
      
      if (imageUrl.startsWith('http')) {
        return imageUrl
      }
      
      if (imageUrl.startsWith('/media/')) {
        return `${process.env.VUE_APP_API_URL || 'http://localhost:8000'}${imageUrl}`
      }
      
      return `${process.env.VUE_APP_API_URL || 'http://localhost:8000'}/media/${imageUrl}`
    }

    const getStatusClass = (status) => {
      const statusClasses = {
        'upcoming': 'bg-success',
        'ongoing': 'bg-warning text-dark',
        'completed': 'bg-secondary',
        'cancelled': 'bg-danger'
      }
      return statusClasses[status] || 'bg-primary'
    }

    const getAttendancePercentage = (event) => {
      if (!event.max_attendees || event.max_attendees === 0) return 0
      const rsvpCount = event.rsvp_count || 0
      return Math.min(100, (rsvpCount / event.max_attendees) * 100)
    }

    const getRemainingSpots = (event) => {
      if (!event.max_attendees || event.max_attendees === 0) return 'Unlimited'
      const rsvpCount = event.rsvp_count || 0
      return Math.max(0, event.max_attendees - rsvpCount)
    }

    // Computed properties
    const canRSVP = computed(() => {
      if (!event.value) return false
      if (event.value.status !== 'upcoming') return false
      if (hasRSVPed.value) return false
      if (event.value.max_attendees === 0) return true
      const remainingSpots = getRemainingSpots(event.value)
      return remainingSpots > 0
    })

    const hasRSVPed = computed(() => {
      return !!userRSVP.value
    })

    // RSVP Function
    const submitRSVP = async () => {
      if (!authHelper.isAuthenticated()) {
        router.push({ 
          path: '/auth/login', 
          query: { redirect: route.fullPath }
        })
        return
      }

      rsvping.value = true
      try {
        const data = {
          event: event.value.id,
          guests: 1,
          notes: ''
        }
        
        const response = await apiService.events.rsvpToEvent(event.value.id, data)
        userRSVP.value = response.data
        
        // Update event RSVP count
        event.value.rsvp_count = (event.value.rsvp_count || 0) + 1
        
        alert('RSVP successful! We look forward to seeing you.')
        
      } catch (err) {
        console.error('RSVP error:', err)
        let errorMessage = 'Unable to RSVP. Please try again.'
        
        if (err.response) {
          if (err.response.status === 400) {
            errorMessage = err.response.data.detail || 'Invalid RSVP data.'
          } else if (err.response.status === 409) {
            errorMessage = 'You have already RSVPed to this event.'
            userRSVP.value = { id: 'existing' }
          } else if (err.response.status === 403) {
            errorMessage = 'Event is full or registration is closed.'
          }
        }
        
        alert(errorMessage)
      } finally {
        rsvping.value = false
      }
    }

    // Share event
    const shareEvent = () => {
      if (navigator.share) {
        navigator.share({
          title: event.value.title,
          text: event.value.description,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert('Event link copied to clipboard!')
      }
    }

    // Add to calendar
    const addToCalendar = () => {
      if (!event.value || !event.value.date) return
      
      try {
        const startDate = new Date(event.value.date)
        if (event.value.start_time) {
          const [hours, minutes] = event.value.start_time.split(':')
          startDate.setHours(parseInt(hours), parseInt(minutes))
        }
        
        const endDate = new Date(startDate)
        if (event.value.end_time) {
          const [hours, minutes] = event.value.end_time.split(':')
          endDate.setHours(parseInt(hours), parseInt(minutes))
        } else {
          endDate.setHours(startDate.getHours() + 2)
        }
        
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.value.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}&details=${encodeURIComponent(event.value.description)}&location=${encodeURIComponent(event.value.location)}`
        
        window.open(calendarUrl, '_blank')
        
      } catch (err) {
        console.error('Calendar error:', err)
        alert('Unable to create calendar event. Please try manually.')
      }
    }

    // Lifecycle
    onMounted(() => {
      loadEvent()
    })

    return {
      event,
      loading,
      rsvping,
      error,
      formatEventDate,
      formatShortDate,
      formatEventTime,
      formatDescription,
      formatEventType,
      formatEventStatus,
      getEventImage,
      getStatusClass,
      getAttendancePercentage,
      getRemainingSpots,
      canRSVP,
      hasRSVPed,
      submitRSVP,
      shareEvent,
      addToCalendar
    }
  }
}
</script>

<style scoped>
.event-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.event-header {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.event-title {
  color: #2c3e50;
  font-weight: 700;
}

.event-meta .meta-item {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.event-image-container {
  border: 1px solid #dee2e6;
  border-radius: 12px;
  overflow: hidden;
}

.card {
  border: none;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.event-description p {
  line-height: 1.8;
  margin-bottom: 1rem;
  color: #495057;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 0.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #4361ee;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #4361ee;
}

.timeline-time {
  font-weight: 600;
  color: #4361ee;
  margin-bottom: 0.25rem;
}

.timeline-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #4361ee;
}

.organizer-info {
  padding: 1rem 0;
}

.organizer-avatar {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.progress {
  height: 10px;
  border-radius: 5px;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 5px;
}

.additional-notes p {
  line-height: 1.8;
  color: #6c757d;
}

.breadcrumb {
  background-color: transparent;
  padding-left: 0;
}

.breadcrumb-item.active {
  color: #6c757d;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .event-header {
    padding: 1.5rem;
  }
  
  .event-title {
    font-size: 1.75rem;
  }
  
  .event-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .event-meta .meta-item {
    width: 100%;
  }
  
  .card-body {
    padding: 1.25rem;
  }
}
</style>