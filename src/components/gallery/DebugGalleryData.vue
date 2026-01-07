<!-- src/components/DebugGalleryData.vue -->
<template>
  <div class="debug-panel card border-warning mt-4">
    <div class="card-header bg-warning text-dark">
      <h6 class="mb-0">Debug: Gallery Data</h6>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h6>API Response Sample:</h6>
          <pre class="bg-light p-2 small">{{ sampleItem }}</pre>
        </div>
        <div class="col-md-6">
          <h6>URL Analysis:</h6>
          <div v-for="item in sampleItems" :key="item.id" class="mb-2 p-2 border rounded">
            <strong>{{ item.title }}</strong><br>
            <small>
              Type: {{ item.item_type }}<br>
              File URL: {{ item.file_url }}<br>
              File Field: {{ item.file }}<br>
              Resolved: {{ resolveUrl(item) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DebugGalleryData',
  props: {
    galleryItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    sampleItems() {
      return this.galleryItems.slice(0, 3) // Show first 3 items
    },
    sampleItem() {
      return this.galleryItems.length > 0 ? this.galleryItems[0] : 'No items'
    }
  },
  methods: {
    resolveUrl(item) {
      // This will help us understand what URL the frontend is trying to use
      const url = item.file_url || item.file
      if (!url) return 'No URL available'
      
      if (url.startsWith('http')) {
        return 'Absolute URL'
      } else if (url.startsWith('/media/')) {
        return 'Relative media URL - needs absolute path'
      } else {
        return 'Unknown URL format'
      }
    }
  }
}
</script>