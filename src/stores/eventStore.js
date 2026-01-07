import { defineStore } from 'pinia'
import axios from 'axios'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    events: [],
    total: 0,
    loading: false,
    filters: {
      search: '',
      type: '',
      status: '',
      page: 1,
      pageSize: 10
    }
  }),
  actions: {
    async fetchEvents() {
      this.loading = true
      try {
        const params = { ...this.filters }
        const res = await axios.get('/api/events/', { params })
        this.events = res.data.results
        this.total = res.data.count
      } catch (err) {
        console.error('Error fetching events:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    async createEvent(eventData) {
      const res = await axios.post('/api/events/', eventData)
      return res.data
    },
    async updateEvent(id, eventData) {
      const res = await axios.patch(`/api/events/${id}/`, eventData)
      return res.data
    },
    async deleteEvent(id) {
      await axios.delete(`/api/events/${id}/`)
    }
  }
})
