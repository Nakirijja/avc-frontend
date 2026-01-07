<template>
  <div class="lightbox-overlay" @click.self="$emit('close')">
    <div class="lightbox-content">
      <!-- Close Button -->
      <button class="btn btn-light btn-sm lightbox-close" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      
      <!-- Navigation Buttons -->
      <button v-if="hasPrevious" class="btn btn-light lightbox-nav lightbox-prev" @click="$emit('previous')">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button v-if="hasNext" class="btn btn-light lightbox-nav lightbox-next" @click="$emit('next')">
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- Media Display -->
      <div class="lightbox-media">
        <!-- Image Display -->
        <img 
          v-if="item.item_type === 'image' && item.file_url"
          :src="item.file_url" 
          :alt="item.title"
          class="lightbox-image"
          @error="handleMediaError"
        />
        
        <!-- Video Display -->
        <video 
          v-else-if="item.item_type === 'video' && item.file_url"
          :src="item.file_url"
          controls
          autoplay
          class="lightbox-video"
          @error="handleMediaError"
        >
          Your browser does not support the video tag.
        </video>
        
        <!-- Fallback -->
        <div v-else class="lightbox-fallback">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <p>Media cannot be displayed</p>
          <small class="text-muted">URL: {{ item.file_url }}</small>
        </div>
      </div>

      <!-- Item Info -->
      <div class="lightbox-info">
        <h4 class="lightbox-title">{{ item.title }}</h4>
        <p v-if="item.description" class="lightbox-description">{{ item.description }}</p>
        <div class="lightbox-meta">
          <span v-if="item.event_name" class="badge bg-primary me-2">
            <i class="fas fa-calendar me-1"></i>{{ item.event_name }}
          </span>
          <span class="text-muted">
            <i class="fas fa-user me-1"></i>{{ item.uploaded_by_name }}
          </span>
          <span class="text-muted ms-3">
            <i class="fas fa-clock me-1"></i>{{ formatDate(item.uploaded_at) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryLightbox',
  props: {
    item: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentIndex() {
      return this.items.findIndex(i => i.id === this.item.id)
    },
    hasNext() {
      return this.currentIndex < this.items.length - 1
    },
    hasPrevious() {
      return this.currentIndex > 0
    }
  },
  methods: {
    handleMediaError(event) {
      console.error('Failed to load media in lightbox:', this.item.file_url)
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown date'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-prev {
  left: 1rem;
}

.lightbox-next {
  right: 1rem;
}

.lightbox-media {
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.lightbox-image,
.lightbox-video {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.lightbox-fallback {
  padding: 3rem;
  text-align: center;
  color: #6c757d;
}

.lightbox-info {
  padding: 1.5rem;
  background: white;
}

.lightbox-title {
  margin-bottom: 0.5rem;
  color: #333;
}

.lightbox-description {
  color: #666;
  margin-bottom: 1rem;
}

.lightbox-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>