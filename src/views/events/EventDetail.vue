<template>
  <div class="container py-5">
    <div v-if="loading" class="text-center py-5">Loading...</div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>
      <div class="row">
        <div class="col-lg-8">
          <h1>{{ event.title }}</h1>
          <p class="text-muted">
            <i class="fas fa-calendar-alt me-2"></i>{{ event.date }} •
            <i class="fas fa-clock ms-2 me-2"></i>{{ event.time }} •
            <i class="fas fa-map-marker-alt ms-2 me-2"></i>{{ event.location }}
          </p>

          <div v-if="event.image" class="mb-3">
            <img :src="event.image" class="img-fluid rounded" alt="Event image">
          </div>

          <div class="mb-4" v-html="event.full_description || event.description"></div>

          <div class="d-flex gap-2">
            <button class="btn btn-primary" @click="submitRSVP" :disabled="rsvping">
              <i class="fas fa-calendar-check me-2"></i>RSVP Now
            </button>
            <router-link to="/events" class="btn btn-link">Back to Events</router-link>
          </div>
        </div>

        <aside class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h6>Event details</h6>
              <p class="mb-1"><strong>Location:</strong> {{ event.location }}</p>
              <p class="mb-1"><strong>Time:</strong> {{ event.time }}</p>
              <p class="mb-1"><strong>Seats:</strong> {{ event.capacity || 'N/A' }}</p>
              <p class="text-muted small mt-3">Organiser: {{ event.organiser_name || 'Angels Voices Choir' }}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios'
import authHelper from '@/helpers/authHelper'
import { ref, onMounted } from 'vue'

export default {
  name: 'EventDetail',
  props: ['id'],
  setup(props) {
    const event = ref(null)
    const loading = ref(true)
    const rsvping = ref(false)
    const error = ref(null)

    const loadEvent = async () => {
      loading.value = true
      try {
        const { data } = await api.get(`/events/${props.id}/`)
        event.value = data
      } catch (err) {
        console.error(err)
        error.value = 'Unable to load event'
      } finally { loading.value = false }
    }

    const submitRSVP = async () => {
      if (!authHelper.isAuthenticated()) {
        window.location.href = `/login?next=/events/${props.id}`
        return
      }
      rsvping.value = true
      try {
        await api.post(`/events/${props.id}/rsvp/`)
        alert('RSVP successful — see you there!')
      } catch (err) {
        console.error('RSVP error', err)
        alert('RSVP failed.')
      } finally {
        rsvping.value = false
      }
    }

    onMounted(loadEvent)

    return { event, loading, rsvping, submitRSVP, error }
  }
}
</script>
