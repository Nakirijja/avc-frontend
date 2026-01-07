<template>
  <div class="events-page">
    <!-- Hero Section -->
    <section class="events-hero text-white py-5">
      <div class="hero-overlay"></div>
      <div class="container py-5">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4">Upcoming Events</h1>
            <p class="lead hero-subtitle">Join us for unforgettable musical experiences and community gatherings</p>
            <div class="hero-stats mt-4">
              <div class="stat-item">
                <i class="fas fa-music"></i>
                <span>Live Performances</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-users"></i>
                <span>Community Events</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Regular Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <div class="container py-5">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading amazing events...</p>
        </div>
      </div>

      <!-- Event Cards -->
      <div class="row g-4" v-else>
        <div
          v-for="event in events"
          :key="event.id"
          class="col-md-6 col-lg-4"
        >
          <div class="event-card h-100">
            <!-- Image Container -->
            <div class="event-image-container">
              <div class="image-wrapper">
                <img
                  :src="getEventImage(event.image)"
                  class="event-image"
                  :alt="event.title + ' image'"
                  @error="handleImageError"
                />
              </div>
              <div class="event-date-badge">
                <span class="date-day">{{ getEventDay(event.start_date) }}</span>
                <span class="date-month">{{ getEventMonth(event.start_date) }}</span>
              </div>
              <div class="event-overlay">
                <button class="btn-view-details" @click="viewEvent(event)">
                  <i class="fas fa-eye me-2"></i>
                  View Details
                </button>
              </div>
            </div>

            <div class="event-content">
              <div class="event-category">
                <i class="fas fa-tag me-2"></i>
                {{ getEventCategory(event) }}
              </div>
              <h5 class="event-title">{{ event.title }}</h5>
              <div class="event-meta">
                <div class="meta-item">
                  <i class="fas fa-clock me-2"></i>
                  {{ formatTime(event.start_date) }}
                </div>
                <div class="meta-item" v-if="event.location">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  {{ truncate(event.location, 25) }}
                </div>
              </div>
              <p class="event-description">{{ truncate(event.description, 100) }}</p>
              
              <div class="event-actions">
                <button class="btn btn-primary btn-sm" @click="viewEvent(event)">
                  Learn More
                </button>
                <div class="event-type-indicator" :class="getEventTypeClass(event)">
                  {{ getEventType(event) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="events.length === 0" class="col-12 text-center py-5">
          <div class="empty-state">
            <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">No Events Scheduled</h4>
            <p class="text-muted">We're preparing some amazing events. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <div class="modal fade" id="eventModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content event-modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <h5 class="modal-title">{{ selectedEvent?.title }}</h5>
              <div class="modal-category">{{ getEventCategory(selectedEvent) }}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0">
            <!-- Image Container -->
            <div class="modal-image-container">
              <div class="modal-image-wrapper">
                <img
                  v-if="selectedEvent?.image"
                  :src="selectedEvent.image"
                  class="modal-image"
                  :alt="selectedEvent.title + ' image'"
                  @error="handleModalImageError"
                />
                <div v-else class="modal-placeholder">
                  <i class="fas fa-music fa-3x text-muted mb-3"></i>
                  <span class="text-muted">Event Image</span>
                </div>
              </div>
              <div class="modal-date-overlay">
                <div class="modal-date">
                  <span class="modal-date-day">{{ getEventDay(selectedEvent?.start_date) }}</span>
                  <span class="modal-date-month">{{ getEventMonth(selectedEvent?.start_date) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Event Details -->
            <div class="modal-details p-4">
              <div class="detail-grid">
                <div class="detail-item">
                  <i class="fas fa-calendar-alt"></i>
                  <div>
                    <strong>Date & Time</strong>
                    <p>{{ formatDate(selectedEvent?.start_date) }} at {{ formatTime(selectedEvent?.start_date) }}</p>
                    <span v-if="selectedEvent?.end_date" class="text-muted">
                      Ends: {{ formatDate(selectedEvent.end_date) }}
                    </span>
                  </div>
                </div>
                
                <div class="detail-item" v-if="selectedEvent?.location">
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>Location</strong>
                    <p>{{ selectedEvent.location }}</p>
                    <span v-if="selectedEvent.location_details" class="text-muted">
                      {{ selectedEvent.location_details }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="event-description-full">
                <h6>About This Event</h6>
                <p>{{ selectedEvent?.description }}</p>
              </div>

              <div class="event-notes" v-if="selectedEvent?.additional_notes">
                <h6>Additional Information</h6>
                <p>{{ selectedEvent.additional_notes }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Close
            </button>
            <button class="btn btn-primary" v-if="selectedEvent?.registration_link">
              <i class="fas fa-user-plus me-2"></i>
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
import { apiService } from "@/services/api";

export default {
  name: "PublicEvents",
  data() {
    return {
      events: [],
      selectedEvent: null,
      loading: true,
    };
  },
  methods: {
    async fetchEvents() {
      this.loading = true;
      try {
        const res = await apiService.events.getAll();
        console.log("Events API response:", res.data)
        this.events = res.data.results || res.data;

        this.events.forEach(event => {
          console.log(`Event: ${event.title}`, `Image: ${event.image}`);
        });
      } catch (err) {
        console.error("Failed to load events:", err);
        this.events = [];
      } finally {
        this.loading = false;
      }
    },
    getEventImage(imageUrl) {
      if (!imageUrl || imageUrl.trim() === '') {
        return this.generatePlaceholder();
      }
      return imageUrl;
    },
    generatePlaceholder() {
      // More interesting placeholder with gradient
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdFRUEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3NjRCQTIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FdmVudCBJbWFnZTwvdGV4dD48L3N2Zz4=';
    },
    handleImageError(event) {
      console.log('Image failed to load, using placeholder');
      event.target.src = this.generatePlaceholder();
    },
    handleModalImageError(event) {
      event.target.style.display = 'none';
      const container = event.target.closest('.modal-image-container');
      const placeholder = container.querySelector('.modal-placeholder') || 
                         container.parentElement.querySelector('.modal-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatTime(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getEventDay(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).getDate();
    },
    getEventMonth(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
    },
    getEventCategory(event) {
      if (!event) return "General";
      // You can customize this based on your event data
      return event.category || "Music Event";
    },
    getEventType(event) {
      // Determine event type based on your data
      if (event.is_public) return "Public";
      if (event.is_free) return "Free";
      return "Members Only";
    },
    getEventTypeClass(event) {
      const type = this.getEventType(event);
      return type.toLowerCase().replace(' ', '-');
    },
    truncate(text, length) {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
    viewEvent(event) {
      this.selectedEvent = event;
      const modalEl = document.getElementById("eventModal");
      new bootstrap.Modal(modalEl).show();
    },
  },
  mounted() {
    this.fetchEvents();
  },
};
</script>

<style scoped>
.events-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Hero Section */
.events-hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

/* Event Cards - FIXED IMAGE SIZING */
.event-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  border: none;
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.event-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.event-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

.event-date-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 0.5rem;
  text-align: center;
  min-width: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.date-day {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
}

.date-month {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #764ba2;
  line-height: 1;
}

.event-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .event-overlay {
  opacity: 1;
}

.btn-view-details {
  background: white;
  color: #667eea;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-view-details:hover {
  background: #764ba2;
  color: white;
  transform: scale(1.05);
}

.event-content {
  padding: 1.5rem;
}

.event-category {
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.event-title {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #6c757d;
}

.event-description {
  color: #5a6c7d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.event-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-type-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.event-type-indicator.public {
  background: #d4edda;
  color: #155724;
}

.event-type-indicator.free {
  background: #fff3cd;
  color: #856404;
}

.event-type-indicator.members-only {
  background: #e2e3e5;
  color: #383d41;
}

/* Modal Styles - FIXED IMAGE SIZING */
.event-modal-content {
  border-radius: 15px;
  overflow: hidden;
  border: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.5rem;
}

.modal-header-content {
  flex: 1;
}

.modal-category {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.modal-image-container {
  position: relative;
  height: 300px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
}

.modal-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #6c757d;
  font-style: italic;
}

.modal-date-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.modal-date {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  min-width: 60px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-date-day {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
}

.modal-date-month {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #764ba2;
  line-height: 1;
  margin-top: 0.25rem;
}

.modal-details {
  background: white;
}

.detail-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.detail-item i {
  color: #667eea;
  font-size: 1.25rem;
  margin-top: 0.25rem;
}

.event-description-full,
.event-notes {
  margin-bottom: 1.5rem;
}

.event-description-full h6,
.event-notes h6 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Loading State */
.loading-spinner {
  padding: 3rem 0;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-stats {
    gap: 1rem;
  }
  
  .stat-item {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .event-image-container {
    height: 180px;
  }
  
  .modal-image-container {
    height: 250px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .events-hero {
    padding: 3rem 0;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .event-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .modal-image-container {
    height: 200px;
  }
}

/* Ensure consistent image sizing across all cards */
.row {
  align-items: stretch;
}

/* Prevent image overflow and ensure proper containment */
.event-image-container,
.modal-image-container {
  contain: layout style paint;
}
</style>