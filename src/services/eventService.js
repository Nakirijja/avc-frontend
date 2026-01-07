// src/services/eventService.js
import apiClient from './api'

export default {
  async getEvents(params = {}) {
    const response = await apiClient.get('/events/', { params })
    return response
  },

  async getEvent(id) {
    const response = await apiClient.get(`/events/${id}/`)
    return response
  },

  async createEvent(eventData) {
    const response = await apiClient.post('/events/', eventData)
    return response
  },

  async updateEvent(id, eventData) {
    const response = await apiClient.patch(`/events/${id}/`, eventData)
    return response
  },

  async deleteEvent(id) {
    const response = await apiClient.delete(`/events/${id}/`)
    return response
  }
}