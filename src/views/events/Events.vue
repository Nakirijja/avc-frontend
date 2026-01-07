<!-- src/views/events/Events.vue -->
<template>
  <div class="events-page">
    <div class="container my-5 pt-4">
      <!-- Page Header with Stats -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="display-5 fw-bold text-primary">Choir Events</h1>
          <p class="text-muted">Join us for musical celebrations and community gatherings</p>
        </div>
        <div class="d-flex gap-2">
          <!-- Event Type Filter -->
          <select class="form-select" v-model="filterType" style="width: 180px;">
            <option value="">All Event Types</option>
            <option value="practice">Practice</option>
            <option value="rehearsal">Rehearsal</option>
            <option value="performance">Performance</option>
            <option value="meeting">Meeting</option>
            <option value="workshop">Workshop</option>
            <option value="social">Social Event</option>
          </select>
          
          <!-- Status Filter -->
          <select class="form-select" v-model="filterStatus" style="width: 150px;">
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          
          <button class="btn btn-outline-primary" @click="refreshEvents">
            <i class="fas fa-refresh me-1"></i> Refresh
          </button>
          <button
            v-if="isAdmin"
            class="btn btn-primary"
            @click="openForm()"
          >
            <i class="fas fa-plus-circle me-1"></i> Create Event
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4" v-if="!loading">
        <div class="col-md-3 mb-3">
          <div class="card border-0 bg-primary text-white shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-calendar-alt fa-2x mb-2"></i>
              <h3>{{ upcomingEventsCount }}</h3>
              <p class="mb-0">Upcoming</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 bg-success text-white shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-music fa-2x mb-2"></i>
              <h3>{{ practiceEventsCount }}</h3>
              <p class="mb-0">Practices</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 bg-info text-white shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-users fa-2x mb-2"></i>
              <h3>{{ performanceEventsCount }}</h3>
              <p class="mb-0">Performances</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 bg-warning text-white shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-chart-line fa-2x mb-2"></i>
              <h3>{{ totalEventsCount }}</h3>
              <p class="mb-0">Total Events</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0" 
                  placeholder="Search events by title, description, or location..." 
                  v-model="searchQuery"
                >
              </div>
            </div>
            <div class="col-md-6 text-md-end mt-2 mt-md-0">
              <small class="text-muted">
                Showing {{ filteredEvents.length }} of {{ events.length }} events
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 fs-5 text-muted">Loading events...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="fas fa-exclamation-triangle me-3 fa-2x"></i>
        <div>
          <h5 class="alert-heading">Failed to load events</h5>
          <p class="mb-0">{{ error }}</p>
          <button class="btn btn-outline-danger btn-sm mt-2" @click="fetchEvents">
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0" class="text-center py-5">
        <i class="fas fa-calendar-times fa-4x text-muted mb-3"></i>
        <h3 class="text-muted">No Events Found</h3>
        <p class="text-muted mb-4" v-if="hasActiveFilters">
          Try adjusting your search criteria or filters.
        </p>
        <p class="text-muted mb-4" v-else>
          No events scheduled yet. Check back later or create an event to get started.
        </p>
        <button v-if="isAdmin" class="btn btn-primary btn-lg" @click="openForm()">
          <i class="fas fa-plus me-2"></i>Create First Event
        </button>
        <button v-else class="btn btn-outline-primary" @click="clearFilters">
          Clear Filters
        </button>
      </div>

      <!-- Events Grid -->
      <div v-else class="row g-4">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <EventCard
            :event="event"
            @view="openDetails"
            @edit="openForm"
            @delete="deleteEvent"
            :is-admin="isAdmin"
          />
        </div>
      </div>

      <!-- Event Form Modal -->
      <EventForm
        v-if="showForm"
        :event="selectedEvent"
        @close="closeForm"
        @save="saveEvent"
      />

      <!-- Event Details Modal -->
      <EventDetails
        v-if="showDetails"
        :event="selectedEvent"
        @close="closeDetails"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import EventCard from '@/components/events/EventCard.vue'
import EventForm from '@/components/events/EventForm.vue'
import EventDetails from '@/components/events/EventDetails.vue'
import eventService from '@/services/eventService'
import authService from '@/services/authService'

export default {
  name: 'Events',
  components: { EventCard, EventForm, EventDetails },
  setup() {
    const events = ref([])
    const loading = ref(false)
    const error = ref(null)
    const showForm = ref(false)
    const showDetails = ref(false)
    const selectedEvent = ref(null)
    const isAdmin = ref(false)
    const searchQuery = ref('')
    const filterType = ref('')
    const filterStatus = ref('')

    // Computed properties for stats
    const upcomingEventsCount = computed(() => {
      const now = new Date()
      return events.value.filter(event => new Date(event.start_date) >= now && event.status === 'upcoming').length
    })

    const practiceEventsCount = computed(() => {
      return events.value.filter(event => event.type === 'practice').length
    })

    const performanceEventsCount = computed(() => {
      return events.value.filter(event => event.type === 'performance').length
    })

    const totalEventsCount = computed(() => {
      return events.value.length
    })

    const hasActiveFilters = computed(() => {
      return searchQuery.value || filterType.value || filterStatus.value
    })

    const filteredEvents = computed(() => {
      let filtered = events.value
      
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        )
      }
      
      // Type filter
      if (filterType.value) {
        filtered = filtered.filter(event => event.type === filterType.value)
      }
      
      // Status filter
      if (filterStatus.value) {
        filtered = filtered.filter(event => event.status === filterStatus.value)
      }
      
      return filtered
    })

    const checkAdmin = async () => {
      try {
        const res = await authService.getCurrentUser()
        // Adjust based on your user model structure
        isAdmin.value = res.data.is_staff || res.data.is_superuser || res.data.role === 'admin'
      } catch (err) { 
        console.error('Admin check failed:', err)
        isAdmin.value = false
      }
    }

    const fetchEvents = async () => {
      loading.value = true
      error.value = null
      try {
        // Build query params for filtering
        const params = {}
        if (filterType.value) params.type = filterType.value
        if (filterStatus.value) params.status = filterStatus.value
        
        const res = await eventService.getEvents(params)
        events.value = res.data.results || res.data
      } catch (err) { 
        console.error('Events fetch failed:', err)
        error.value = err.response?.data?.message || 'Failed to load events. Please try again.'
      }
      finally { 
        loading.value = false 
      }
    }

    const refreshEvents = async () => {
      await fetchEvents()
    }

    const clearFilters = () => {
      searchQuery.value = ''
      filterType.value = ''
      filterStatus.value = ''
    }

    const openForm = (event = null) => {
      selectedEvent.value = event
      showForm.value = true
    }

    const closeForm = () => { 
      showForm.value = false
      selectedEvent.value = null 
    }

    const openDetails = (event) => {
      selectedEvent.value = event
      showDetails.value = true
    }

    const closeDetails = () => { 
      showDetails.value = false
      selectedEvent.value = null 
    }

    const saveEvent = async (data) => {
      try {
        let res
        if (selectedEvent.value) {
          res = await eventService.updateEvent(selectedEvent.value.id, data)
          events.value = events.value.map(e => e.id === res.data.id ? res.data : e)
        } else {
          res = await eventService.createEvent(data)
          events.value.push(res.data)
        }
      } catch (err) { 
        console.error('Save event failed:', err)
        throw err // Re-throw for form handling
      }
      closeForm()
    }

    const deleteEvent = async (id) => {
      if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
      try {
        await eventService.deleteEvent(id)
        events.value = events.value.filter(e => e.id !== id)
      } catch (err) { 
        console.error('Delete event failed:', err)
        alert('Failed to delete event. Please try again.')
      }
    }

    onMounted(async () => {
      await checkAdmin()
      await fetchEvents()
    })

    return {
      events, loading, error, showForm, showDetails,
      selectedEvent, isAdmin, searchQuery, filterType, filterStatus,
      upcomingEventsCount, practiceEventsCount, performanceEventsCount, totalEventsCount,
      filteredEvents, hasActiveFilters,
      openForm, closeForm, openDetails, closeDetails, 
      saveEvent, deleteEvent, refreshEvents, fetchEvents, clearFilters
    }
  }
}
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding-top: 80px; /* Prevent navbar overlap */
}

/* Smooth card animations */
.row > div {
  display: flex;
  transition: transform 0.2s ease-in-out;
}

.row > div:hover {
  transform: translateY(-5px);
}

/* Enhanced spinner */
.spinner-border {
  border-width: 0.3em;
}

/* Form control enhancements */
.form-select, .form-control {
  border-radius: 0.5rem;
}

/* Responsive text */
@media (max-width: 768px) {
  .display-5 {
    font-size: 2rem;
  }
  
  .events-page {
    padding-top: 70px;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .d-flex.gap-2 {
    flex-wrap: wrap;
  }
}
</style>