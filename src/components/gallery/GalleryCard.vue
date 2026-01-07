<!-- src/components/gallery/GalleryCard.vue -->
<template>
  <div class="gallery-card" @click="$emit('click', item)">
    <div class="card border-0 shadow-sm h-100">
      <!-- Media Preview -->
      <div class="card-img-container position-relative">
        <!-- Image Display -->
        <img 
          v-if="item.item_type === 'image' && displayUrl"
          :src="displayUrl" 
          :alt="item.title"
          class="card-img-top gallery-image"
          loading="lazy"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <!-- Video Display -->
        <div v-else-if="item.item_type === 'video' && displayUrl" class="video-preview">
          <video 
            :src="displayUrl"
            class="card-img-top gallery-video"
            preload="metadata"
            muted
            @loadeddata="videoLoaded"
            @error="handleVideoError"
          ></video>
          <div class="video-overlay">
            <i class="fas fa-play-circle fa-3x text-white"></i>
          </div>
        </div>
        
        <!-- Fallback for missing media -->
        <div v-else class="media-placeholder">
          <i class="fas fa-file fa-3x text-muted"></i>
          <p class="mt-2 text-muted small">Media not available</p>
          <small class="text-muted">URL: {{ displayUrl || 'No URL available' }}</small>
        </div>

        <!-- Item Type Badge -->
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge" :class="itemTypeClass">
            <i :class="itemTypeIcon"></i>
            {{ item.item_type }}
          </span>
        </div>

        <!-- Admin Actions -->
        <div v-if="canEdit" class="position-absolute top-0 start-0 m-2">
          <div class="btn-group btn-group-sm">
            <button 
              class="btn btn-outline-light btn-sm"
              @click.stop="$emit('edit', item)"
              title="Edit item"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="btn btn-outline-light btn-sm"
              @click.stop="$emit('delete', item)"
              title="Delete item"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <h6 class="card-title text-truncate" :title="item.title">
          {{ item.title }}
        </h6>
        
        <p v-if="item.description" class="card-text small text-muted line-clamp-2">
          {{ item.description }}
        </p>
        
        <div v-if="item.event_name" class="event-badge mb-2">
          <i class="fas fa-calendar me-1 small"></i>
          <small class="text-muted">{{ item.event_name }}</small>
        </div>
        
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            <i class="fas fa-user me-1"></i>
            {{ item.uploaded_by_name || 'Unknown' }}
          </small>
          <small class="text-muted">
            {{ formatDate(item.uploaded_at) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryCard',
  props: {
    item: {
      type: Object,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageError: false,
      videoError: false,
      imageLoaded: false
    }
  },
  computed: {
    itemTypeClass() {
      return {
        'image': 'bg-success',
        'video': 'bg-info'
      }[this.item.item_type] || 'bg-secondary'
    },
    itemTypeIcon() {
      return {
        'image': 'fas fa-image me-1',
        'video': 'fas fa-video me-1'
      }[this.item.item_type] || 'fas fa-file me-1'
    },
    displayUrl() {
      // Try different URL properties that might come from the backend
      const url = this.item.file_url || 
                 this.item.file || 
                 this.item.thumbnail_url ||
                 (this.item.file && typeof this.item.file === 'string' ? this.item.file : null)
      
      // If it's a relative URL, convert to absolute
      if (url && url.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
        return `${baseUrl}${url}`
      }
      
      return url
    }
  },
  methods: {
    handleImageError(event) {
      console.error('❌ Failed to load image:', {
        displayUrl: this.displayUrl,
        item: this.item
      })
      this.imageError = true
      
      // Try to fallback to different URL formats
      const fallbackUrl = this.item.file || this.item.thumbnail_url
      if (fallbackUrl && fallbackUrl !== this.displayUrl) {
        // If there's a different URL to try, retry with it
        setTimeout(() => {
          if (event.target.src !== fallbackUrl) {
            const resolvedUrl = fallbackUrl.startsWith('/') 
              ? `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${fallbackUrl}`
              : fallbackUrl
            event.target.src = resolvedUrl
          }
        }, 100)
      } else {
        // Final fallback to placeholder
        event.target.src = this.getPlaceholderImage()
      }
    },
    
    handleVideoError(event) {
      console.error('❌ Failed to load video:', this.displayUrl)
      this.videoError = true
      
      // Try fallback for video
      const fallbackUrl = this.item.file || this.item.thumbnail_url
      if (fallbackUrl && fallbackUrl !== this.displayUrl) {
        setTimeout(() => {
          if (event.target.src !== fallbackUrl) {
            const resolvedUrl = fallbackUrl.startsWith('/') 
              ? `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${fallbackUrl}`
              : fallbackUrl
            event.target.src = resolvedUrl
          }
        }, 100)
      }
    },
    
    handleImageLoad(event) {
      this.imageLoaded = true
      console.log('✅ Image loaded successfully:', this.displayUrl)
    },
    
    videoLoaded(event) {
      console.log('✅ Video loaded successfully:', this.item.title)
    },
    
    getPlaceholderImage() {
      // Return base64 placeholder images to avoid external file dependencies
      if (this.item.item_type === 'image') {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PGcgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjYWRiNWJjIj48dGV4dCB4PSIxMDAiIHk9IjExMCI+SW1hZ2U8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxNjAiPk5vdCBBdmFpbGFibGU8L3RleHQ+PC9nPjwvc3ZnPg=='
      } else if (this.item.item_type === 'video') {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOWVhIi8+PGcgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjNmM3NTdkIj48dGV4dCB4PSIxMDAiIHk9IjExMCI+VmlkZW88L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxNjAiPk5vdCBBdmFpbGFibGU8L3RleHQ+PC9nPjwvc3ZnPg=='
      }
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PGcgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjYWRiNWJjIj48dGV4dCB4PSIxMDAiIHk9IjExMCI+TWVkaWE8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxNjAiPk5vdCBBdmFpbGFibGU8L3RleHQ+PC9nPjwvc3ZnPg=='
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown date'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid date'
      }
    }
  },
  mounted() {
    // Log the item data for debugging
    console.log('🖼️ GalleryCard mounted:', {
      id: this.item.id,
      title: this.item.title,
      file_url: this.item.file_url,
      file: this.item.file,
      thumbnail_url: this.item.thumbnail_url,
      type: this.item.item_type,
      resolvedUrl: this.displayUrl
    })
  }
}
</script>

<style scoped>
.gallery-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.gallery-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.card-img-container {
  height: 200px;
  overflow: hidden;
  background-color: #f8f9fa;
  border-radius: 0.375rem 0.375rem 0 0;
}

.gallery-image,
.gallery-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-card:hover .gallery-image,
.gallery-card:hover .gallery-video {
  transform: scale(1.05);
}

.video-preview {
  position: relative;
  height: 100%;
  background-color: #000;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.gallery-card:hover .video-overlay {
  opacity: 1;
}

.media-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  padding: 1rem;
  text-align: center;
  background: #f8f9fa;
}

.media-placeholder i {
  margin-bottom: 0.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-badge {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  display: inline-block;
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  backdrop-filter: blur(10px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-img-container {
    height: 180px;
  }
  
  .btn-group-sm > .btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .card-img-container {
    height: 160px;
  }
  
  .media-placeholder {
    padding: 0.5rem;
  }
  
  .media-placeholder i {
    font-size: 2rem !important;
  }
}
</style>