<template>
  <div class="gallery-page">
    <!-- Hero Section -->
    <section class="gallery-hero text-white py-5">
      <div class="hero-overlay"></div>
      <div class="container py-5">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4 hero-title">Choir Gallery</h1>
            <p class="lead hero-subtitle">Relive our musical journey through captivating moments and performances</p>
            
            <!-- Quick Stats -->
            <div class="hero-stats mt-4">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-images"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.totalItems || 0 }}</span>
                  <span class="stat-label">Total Memories</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-photo-video"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.imagesCount || 0 }}</span>
                  <span class="stat-label">Photos</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-film"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.videosCount || 0 }}</span>
                  <span class="stat-label">Videos</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-calendar-star"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.eventsCount || 0 }}</span>
                  <span class="stat-label">Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container-fluid pt-5">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner">
          <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading gallery...</span>
          </div>
          <p class="mt-3 text-muted">Loading beautiful memories...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger text-center error-alert">
        <div class="error-content">
          <i class="fas fa-exclamation-triangle error-icon"></i>
          <span class="error-message">{{ error }}</span>
          <button class="btn btn-outline-light btn-sm ms-3" @click="loadGalleryData">
            Try Again
          </button>
        </div>
      </div>

      <!-- Gallery Content -->
      <div v-else>
        <!-- Search and Filter Section -->
        <div class="search-filter-section mb-5">
          <div class="container">
            <!-- Main Search -->
            <div class="search-card">
              <div class="search-header">
                <i class="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  class="search-input" 
                  placeholder="Search memories by title, description, or event..." 
                  v-model="searchQuery"
                >
                <div class="search-stats">
                  <span class="badge bg-primary">{{ filteredItems.length }}</span>
                  <span class="text-muted">of {{ galleryItems.length }} items</span>
                </div>
              </div>
              
              <!-- Filter Controls -->
              <div class="filter-controls">
                <div class="filter-group">
                  <label class="filter-label">
                    <i class="fas fa-filter me-2"></i>Filter by:
                  </label>
                  <select class="filter-select" v-model="filterType">
                    <option value="all">All Media</option>
                    <option value="image">📷 Images</option>
                    <option value="video">🎥 Videos</option>
                    <option value="audio">🎵 Audio</option>
                  </select>

                  <select class="filter-select" v-model="filterEvent">
                    <option value="all">All Events</option>
                    <option v-for="event in uniqueEvents" :key="event" :value="event">
                      🎭 {{ event }}
                    </option>
                  </select>

                  <select class="filter-select" v-model="sortBy">
                    <option value="-created_at">🆕 Newest First</option>
                    <option value="created_at">📅 Oldest First</option>
                    <option value="title">🔤 Title A-Z</option>
                    <option value="-title">🔠 Title Z-A</option>
                  </select>
                </div>

                <button 
                  v-if="hasActiveFilters" 
                  class="btn btn-outline-secondary btn-clear" 
                  @click="clearFilters"
                >
                  <i class="fas fa-times me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Gallery Grid -->
        <div v-if="filteredItems.length > 0" class="gallery-grid">
          <div class="container">
            <div class="row g-4">
              <div 
                class="col-sm-6 col-lg-4 col-xl-3" 
                v-for="item in filteredItems" 
                :key="item.id"
              >
                <GalleryCard 
                  :item="item" 
                  @click="openLightbox(item)"
                  :can-edit="false"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state-section">
          <div class="container">
            <div class="empty-state text-center py-5">
              <div class="empty-icon">
                <i class="fas fa-camera"></i>
              </div>
              <h4 class="empty-title">
                {{ hasActiveFilters ? 'No Memories Found' : 'Gallery is Empty' }}
              </h4>
              <p class="empty-text">
                {{ hasActiveFilters 
                  ? 'Try adjusting your search criteria or filters to see more memories.' 
                  : 'Beautiful moments will be added soon. Check back later!'
                }}
              </p>
              <button v-if="hasActiveFilters" class="btn btn-primary" @click="clearFilters">
                <i class="fas fa-undo me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !loading" class="load-more-section">
          <div class="container text-center">
            <button class="btn btn-outline-primary btn-load-more" @click="loadMore" :disabled="loadingMore">
              <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2"></span>
              {{ loadingMore ? 'Loading Beautiful Memories...' : 'Load More Memories' }}
              <i class="fas fa-arrow-down ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <GalleryLightbox 
      v-if="selectedItem"
      :item="selectedItem"
      :items="filteredItems"
      @close="closeLightbox"
      @next="nextItem"
      @previous="previousItem"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import GalleryCard from '@/components/gallery/GalleryCard.vue'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'
import { apiService } from '@/services/api'

export default {
  name: 'GalleryView',
  components: {
    GalleryCard,
    GalleryLightbox
  },
  setup() {
    const toast = useToast()
    
    // Reactive data
    const loading = ref(true)
    const loadingMore = ref(false)
    const galleryItems = ref([])
    const stats = ref({
      totalItems: 0,
      imagesCount: 0,
      videosCount: 0,
      eventsCount: 0
    })
    const error = ref(null)
    
    // Filters
    const filterType = ref('all')
    const filterEvent = ref('all')
    const searchQuery = ref('')
    const sortBy = ref('-created_at')
    
    // Pagination
    const currentPage = ref(1)
    const hasMore = ref(false)
    
    // Lightbox
    const selectedItem = ref(null)

    // Computed properties
    const filteredItems = computed(() => {
      let items = [...galleryItems.value]
      
      // Apply type filter
      if (filterType.value !== 'all') {
        items = items.filter(i => i.item_type === filterType.value)
      }
      
      // Apply event filter
      if (filterEvent.value !== 'all') {
        items = items.filter(i => i.event_name === filterEvent.value)
      }
      
      // Apply search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        items = items.filter(i => 
          i.title.toLowerCase().includes(query) ||
          (i.description && i.description.toLowerCase().includes(query)) ||
          (i.event_name && i.event_name.toLowerCase().includes(query))
        )
      }
      
      return items
    })
    
    const uniqueEvents = computed(() => {
      const events = galleryItems.value
        .map(i => i.event_name)
        .filter(event => event && event.trim() !== '')
      return [...new Set(events)].sort()
    })
    
    const hasActiveFilters = computed(() => {
      return searchQuery.value.trim() || filterType.value !== 'all' || filterEvent.value !== 'all'
    })

    // Methods
    const loadGalleryData = async (reset = true) => {
      if (reset) {
        loading.value = true
        currentPage.value = 1
        galleryItems.value = []
      } else {
        loadingMore.value = true
      }
      
      error.value = null
      
      try {
        const params = {
          page: currentPage.value,
          ordering: sortBy.value,
          page_size: 12
        }

        console.log('🔄 Fetching gallery data from backend...')
        
        const response = await apiService.gallery.getItems(params)
        
        if (response.data) {
          // Handle Django REST Framework pagination
          const newItems = response.data.results || response.data
          
          if (reset) {
            galleryItems.value = newItems
          } else {
            galleryItems.value.push(...newItems)
          }
          
          hasMore.value = !!response.data.next
          currentPage.value += 1
          
          // Calculate stats
          calculateStats()
          
          console.log('✅ Gallery data loaded successfully:', newItems.length, 'items')
        }
      } catch (err) {
        console.error('❌ Error loading gallery data:', err)
        error.value = 'Failed to load gallery items. Please try again later.'
        toast.error('Failed to load gallery')
      } finally {
        loading.value = false
        loadingMore.value = false
      }
    }

    const calculateStats = () => {
      const imagesCount = galleryItems.value.filter(i => i.item_type === 'image').length
      const videosCount = galleryItems.value.filter(i => i.item_type === 'video').length
      const audioCount = galleryItems.value.filter(i => i.item_type === 'audio').length
      const eventsCount = new Set(galleryItems.value.map(i => i.event_name).filter(Boolean)).size
      
      stats.value = {
        totalItems: galleryItems.value.length,
        imagesCount,
        videosCount,
        audioCount,
        eventsCount
      }
    }

    const loadMore = () => {
      if (!hasMore.value || loadingMore.value) return
      loadGalleryData(false)
    }

    const openLightbox = (item) => {
      selectedItem.value = item
    }

    const closeLightbox = () => {
      selectedItem.value = null
    }

    const nextItem = () => {
      const currentIndex = filteredItems.value.findIndex(item => item.id === selectedItem.value.id)
      const nextIndex = (currentIndex + 1) % filteredItems.value.length
      selectedItem.value = filteredItems.value[nextIndex]
    }

    const previousItem = () => {
      const currentIndex = filteredItems.value.findIndex(item => item.id === selectedItem.value.id)
      const previousIndex = (currentIndex - 1 + filteredItems.value.length) % filteredItems.value.length
      selectedItem.value = filteredItems.value[previousIndex]
    }

    const clearFilters = () => {
      filterType.value = 'all'
      filterEvent.value = 'all'
      searchQuery.value = ''
      sortBy.value = '-created_at'
      currentPage.value = 1
      loadGalleryData()
    }

    // Watchers
    watch([filterType, filterEvent, sortBy], () => {
      loadGalleryData()
    })

    watch(searchQuery, (newQuery) => {
      // Debounce search
      clearTimeout(searchQuery.timeout)
      searchQuery.timeout = setTimeout(() => {
        loadGalleryData()
      }, 500)
    })

    // Lifecycle
    onMounted(() => {
      loadGalleryData()
    })

    return {
      // State
      loading,
      loadingMore,
      galleryItems,
      stats,
      error,
      filterType,
      filterEvent,
      searchQuery,
      sortBy,
      selectedItem,
      hasMore,
      
      // Computed
      filteredItems,
      uniqueEvents,
      hasActiveFilters,
      
      // Methods
      loadGalleryData,
      loadMore,
      openLightbox,
      closeLightbox,
      nextItem,
      previousItem,
      clearFilters
    }
  }
}
</script>

<style scoped>
.gallery-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

/* Hero Section */
.gallery-hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
}

.hero-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  color: #e2e8f0;
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  min-width: 180px;
}

.stat-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 1.5rem;
  color: #ffd700;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #e2e8f0;
  margin-top: 0.25rem;
}

/* Search and Filter Section */
.search-filter-section {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.search-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-icon {
  font-size: 1.25rem;
  color: #667eea;
}

.search-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-label {
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 0;
}

.filter-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem 1rem;
  color: white;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.1);
}

.filter-select option {
  background: #1e293b;
  color: white;
}

.btn-clear {
  border-color: #475569;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: #475569;
  border-color: #475569;
  color: white;
  transform: translateY(-1px);
}

/* Gallery Grid */
.gallery-grid {
  padding: 2rem 0;
}

/* Loading State */
.loading-spinner {
  padding: 4rem 0;
}

/* Error State */
.error-alert {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border: none;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 600px;
}

.error-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: white;
}

.error-icon {
  font-size: 1.5rem;
}

.error-message {
  font-weight: 500;
}

/* Empty State */
.empty-state-section {
  padding: 4rem 0;
}

.empty-state {
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: #475569;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-title {
  color: #94a3b8;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty-text {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Load More Section */
.load-more-section {
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-load-more {
  border-color: #667eea;
  color: #667eea;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-load-more:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-stats {
    gap: 1rem;
  }
  
  .stat-item {
    min-width: 140px;
    padding: 0.75rem 1rem;
  }
  
  .search-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .search-stats {
    justify-content: center;
  }
  
  .gallery-grid .container {
    padding: 0 1rem;
  }
}

@media (max-width: 576px) {
  .gallery-hero {
    padding: 3rem 0;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-item {
    width: 100%;
    max-width: 250px;
  }
  
  .search-card {
    padding: 1.5rem;
    margin: 0 1rem;
  }
  
  .filter-group {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
}

/* Animation for cards */
.gallery-grid .col-sm-6,
.gallery-grid .col-lg-4,
.gallery-grid .col-xl-3 {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
.gallery-page ::-webkit-scrollbar {
  width: 8px;
}

.gallery-page ::-webkit-scrollbar-track {
  background: #1e293b;
}

.gallery-page ::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.gallery-page ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>