<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content upload-modal">
      <div class="modal-header">
        <h2>Upload Media</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleUpload" class="modal-body">
        <!-- Upload Method Selection -->
        <div class="upload-method">
          <div class="method-tabs">
            <button 
              type="button"
              class="method-tab"
              :class="{ active: uploadMethod === 'single' }"
              @click="uploadMethod = 'single'"
            >
              <i class="fas fa-file-upload"></i>
              Single File
            </button>
            <button 
              type="button"
              class="method-tab"
              :class="{ active: uploadMethod === 'multiple' }"
              @click="uploadMethod = 'multiple'"
            >
              <i class="fas fa-folder-open"></i>
              Multiple Files
            </button>
            <button 
              type="button"
              class="method-tab"
              :class="{ active: uploadMethod === 'url' }"
              @click="uploadMethod = 'url'"
            >
              <i class="fas fa-link"></i>
              From URL
            </button>
          </div>
        </div>

        <!-- Single/Multiple File Upload -->
        <div v-if="uploadMethod !== 'url'" class="upload-section">
          <div 
            class="drop-zone"
            :class="{
              'dragover': isDragover,
              'has-files': uploadedFiles.length > 0
            }"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="isDragover = false"
          >
            <div v-if="uploadedFiles.length === 0" class="drop-zone-content">
              <i class="fas fa-cloud-upload-alt"></i>
              <h3>Drop files here or click to browse</h3>
              <p>Supports images, videos, and audio files</p>
              <input 
                type="file" 
                ref="fileInput"
                :multiple="uploadMethod === 'multiple'"
                @change="handleFileSelect"
                accept="image/*,video/*,audio/*"
                class="file-input"
              >
              <button 
                type="button" 
                class="btn btn-outline"
                @click="triggerFileInput"
              >
                <i class="fas fa-folder-open"></i> Browse Files
              </button>
            </div>

            <div v-else class="files-list">
              <div 
                v-for="(file, index) in uploadedFiles" 
                :key="file.id"
                class="file-item"
                :class="file.status"
              >
                <div class="file-preview">
                  <img 
                    v-if="file.type.startsWith('image')" 
                    :src="file.preview" 
                    :alt="file.name"
                    class="preview-image"
                  >
                  <div v-else class="file-icon">
                    <i :class="getFileIcon(file.type)"></i>
                  </div>
                </div>
                
                <div class="file-info">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-size">{{ formatFileSize(file.size) }}</div>
                  <div class="file-progress" v-if="file.status === 'uploading'">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: file.progress + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ file.progress }}%</span>
                  </div>
                  <div class="file-status" v-else>
                    <span :class="file.status">{{ getStatusText(file.status) }}</span>
                  </div>
                </div>

                <div class="file-actions">
                  <button 
                    v-if="file.status === 'pending' || file.status === 'error'"
                    type="button"
                    class="btn-icon"
                    @click="removeFile(index)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  <button 
                    v-if="file.status === 'error'"
                    type="button"
                    class="btn-icon"
                    @click="retryUpload(index)"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="upload-queue" v-if="uploadedFiles.length > 1">
            <div class="queue-header">
              <span>Upload Queue ({{ uploadedFiles.length }} files)</span>
              <button 
                type="button"
                class="btn-link"
                @click="clearQueue"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- URL Upload -->
        <div v-else class="url-upload-section">
          <div class="form-group">
            <label class="form-label">Media URL *</label>
            <input 
              type="url" 
              v-model="urlData.url"
              placeholder="https://example.com/image.jpg"
              class="form-input"
              required
            >
          </div>
          
          <div class="url-preview" v-if="urlData.preview">
            <img :src="urlData.preview" alt="URL preview" class="preview-image">
            <button 
              type="button"
              class="btn-icon remove-preview"
              @click="clearUrlPreview"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <button 
            type="button"
            class="btn btn-outline"
            @click="fetchUrlPreview"
            :disabled="!urlData.url || urlData.loading"
          >
            <span v-if="urlData.loading">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
            <span v-else>Preview URL</span>
          </button>
        </div>

        <!-- Media Details Form -->
        <div class="media-details" v-if="hasFiles || urlData.preview">
          <h3>Media Details</h3>
          
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input 
                type="text" 
                v-model="mediaDetails.title"
                required
                class="form-input"
                placeholder="Enter media title"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Category *</label>
              <select v-model="mediaDetails.category" required class="form-input">
                <option value="">Select category</option>
                <option value="performance">Performance</option>
                <option value="practice">Practice</option>
                <option value="event">Event</option>
                <option value="behind-scenes">Behind the Scenes</option>
                <option value="tours">Tours</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Media Type</label>
              <select v-model="mediaDetails.type" class="form-input" disabled>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Visibility</label>
              <select v-model="mediaDetails.visibility" class="form-input">
                <option value="public">Public</option>
                <option value="members">Members Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea 
              v-model="mediaDetails.description"
              class="form-input"
              rows="3"
              placeholder="Describe this media..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Tags</label>
            <div class="tags-input">
              <div 
                v-for="(tag, index) in mediaDetails.tags"
                :key="index"
                class="tag"
              >
                {{ tag }}
                <button 
                  type="button"
                  class="tag-remove"
                  @click="removeTag(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <input 
                type="text" 
                v-model="newTag"
                @keydown.enter="addTag"
                @keydown.backspace="handleBackspace"
                placeholder="Add tags..."
                class="tag-input"
              >
            </div>
            <small class="help-text">Press Enter to add a tag</small>
          </div>

          <!-- Advanced Options -->
          <div class="advanced-options">
            <button 
              type="button"
              class="btn-link"
              @click="showAdvanced = !showAdvanced"
            >
              <i class="fas" :class="showAdvanced ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              Advanced Options
            </button>

            <div v-if="showAdvanced" class="advanced-content">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Copyright Information</label>
                  <input 
                    type="text" 
                    v-model="mediaDetails.copyright"
                    class="form-input"
                    placeholder="Copyright holder"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">License</label>
                  <select v-model="mediaDetails.license" class="form-input">
                    <option value="">All Rights Reserved</option>
                    <option value="cc-by">Creative Commons Attribution</option>
                    <option value="cc-by-sa">Creative Commons ShareAlike</option>
                    <option value="public-domain">Public Domain</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="mediaDetails.allowDownloads">
                  Allow downloads
                </label>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="mediaDetails.allowComments">
                  Allow comments
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline" @click="$emit('close')">
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          @click="handleUpload"
          :disabled="!canUpload || uploading"
        >
          <span v-if="uploading">
            <i class="fas fa-spinner fa-spin"></i> 
            {{ uploadMethod === 'multiple' ? `Uploading... (${uploadProgress}%)` : 'Uploading...' }}
          </span>
          <span v-else>
            Upload Media
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useUIStore } from '@/stores/uiStore'

export default {
  name: 'GalleryUpload',
  emits: ['upload', 'close'],
  setup(props, { emit }) {
    const uiStore = useUIStore()
    const fileInput = ref(null)
    
    const uploadMethod = ref('single')
    const isDragover = ref(false)
    const showAdvanced = ref(false)
    const uploading = ref(false)
    const newTag = ref('')

    const uploadedFiles = ref([])
    const urlData = ref({
      url: '',
      preview: '',
      loading: false
    })

    const mediaDetails = ref({
      title: '',
      category: '',
      type: 'image',
      description: '',
      visibility: 'public',
      tags: [],
      copyright: '',
      license: '',
      allowDownloads: true,
      allowComments: true
    })

    const hasFiles = computed(() => uploadedFiles.value.length > 0)
    const canUpload = computed(() => {
      if (uploadMethod.value === 'url') {
        return urlData.value.preview && mediaDetails.value.title && mediaDetails.value.category
      }
      return uploadedFiles.value.length > 0 && mediaDetails.value.title && mediaDetails.value.category
    })

    const uploadProgress = computed(() => {
      if (uploadedFiles.value.length === 0) return 0
      const total = uploadedFiles.value.reduce((sum, file) => sum + file.progress, 0)
      return Math.round(total / uploadedFiles.value.length)
    })

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      processFiles(files)
    }

    const handleDrop = (event) => {
      event.preventDefault()
      isDragover.value = false
      
      const files = Array.from(event.dataTransfer.files)
      processFiles(files)
    }

    const handleDragOver = (event) => {
      event.preventDefault()
      isDragover.value = true
    }

    const processFiles = (files) => {
      files.forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/') && 
            !file.type.startsWith('video/') && 
            !file.type.startsWith('audio/')) {
          uiStore.showNotification({
            type: 'error',
            message: `Unsupported file type: ${file.name}`
          })
          return
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          uiStore.showNotification({
            type: 'error',
            message: `File too large: ${file.name} (max 100MB)`
          })
          return
        }

        const fileData = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type.split('/')[0],
          status: 'pending',
          progress: 0,
          preview: ''
        }

        // Generate preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            fileData.preview = e.target.result
          }
          reader.readAsDataURL(file)
        }

        uploadedFiles.value.push(fileData)
      })

      // Auto-detect media type from first file
      if (uploadedFiles.value.length > 0) {
        mediaDetails.value.type = uploadedFiles.value[0].type
      }
    }

    const removeFile = (index) => {
      uploadedFiles.value.splice(index, 1)
    }

    const retryUpload = (index) => {
      uploadedFiles.value[index].status = 'pending'
      uploadedFiles.value[index].progress = 0
    }

    const clearQueue = () => {
      uploadedFiles.value = []
    }

    const getFileIcon = (fileType) => {
      const icons = {
        image: 'fa-image',
        video: 'fa-video',
        audio: 'fa-music'
      }
      return icons[fileType] || 'fa-file'
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getStatusText = (status) => {
      const statusMap = {
        pending: 'Ready to upload',
        uploading: 'Uploading...',
        completed: 'Uploaded',
        error: 'Upload failed'
      }
      return statusMap[status] || status
    }

    const fetchUrlPreview = async () => {
      if (!urlData.value.url) return

      urlData.value.loading = true
      try {
        // Simulate URL validation and preview generation
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In real app, you'd validate the URL and fetch metadata
        urlData.value.preview = '/assets/images/placeholder.jpg'
        
        // Auto-detect type from URL extension
        const ext = urlData.value.url.split('.').pop().toLowerCase()
        const typeMap = {
          jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
          mp4: 'video', webm: 'video', mov: 'video', avi: 'video',
          mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio'
        }
        mediaDetails.value.type = typeMap[ext] || 'image'
        
      } catch (error) {
        uiStore.showNotification({
          type: 'error',
          message: 'Failed to fetch URL preview'
        })
      } finally {
        urlData.value.loading = false
      }
    }

    const clearUrlPreview = () => {
      urlData.value.preview = ''
      urlData.value.url = ''
    }

    const addTag = () => {
      const tag = newTag.value.trim()
      if (tag && !mediaDetails.value.tags.includes(tag)) {
        mediaDetails.value.tags.push(tag)
        newTag.value = ''
      }
    }

    const removeTag = (index) => {
      mediaDetails.value.tags.splice(index, 1)
    }

    const handleBackspace = (event) => {
      if (newTag.value === '' && mediaDetails.value.tags.length > 0) {
        mediaDetails.value.tags.pop()
      }
    }

    const simulateUpload = (fileData, index) => {
      return new Promise((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 10
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            uploadedFiles.value[index].status = 'completed'
            resolve()
          }
          uploadedFiles.value[index].progress = progress
        }, 200)
      })
    }

    const handleUpload = async () => {
      if (!canUpload.value) return

      uploading.value = true

      try {
        if (uploadMethod.value === 'url') {
          // Handle URL upload
          const uploadData = {
            ...mediaDetails.value,
            url: urlData.value.url,
            thumbnail: urlData.value.preview
          }
          await new Promise(resolve => setTimeout(resolve, 1500))
          emit('upload', uploadData)
        } else {
          // Handle file uploads
          for (let i = 0; i < uploadedFiles.value.length; i++) {
            if (uploadedFiles.value[i].status === 'pending') {
              uploadedFiles.value[i].status = 'uploading'
              await simulateUpload(uploadedFiles.value[i], i)
            }
          }

          // Prepare upload data
          const uploadData = uploadedFiles.value.map(file => ({
            ...mediaDetails.value,
            file: file.file,
            name: file.name,
            type: file.type
          }))

          emit('upload', uploadMethod.value === 'multiple' ? uploadData : uploadData[0])
        }

        uiStore.showNotification({
          type: 'success',
          message: `Media uploaded successfully!`
        })

        // Close modal after successful upload
        emit('close')
      } catch (error) {
        uiStore.showNotification({
          type: 'error',
          message: 'Upload failed. Please try again.'
        })
      } finally {
        uploading.value = false
      }
    }

    watch(uploadMethod, (newMethod) => {
      // Reset when changing methods
      if (newMethod === 'url') {
        uploadedFiles.value = []
      } else {
        urlData.value = { url: '', preview: '', loading: false }
      }
    })

    return {
      fileInput,
      uploadMethod,
      isDragover,
      showAdvanced,
      uploading,
      newTag,
      uploadedFiles,
      urlData,
      mediaDetails,
      hasFiles,
      canUpload,
      uploadProgress,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      removeFile,
      retryUpload,
      clearQueue,
      getFileIcon,
      formatFileSize,
      getStatusText,
      fetchUrlPreview,
      clearUrlPreview,
      addTag,
      removeTag,
      handleBackspace,
      handleUpload
    }
  }
}
</script>

<style scoped>
.upload-modal {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.upload-method {
  margin-bottom: 2rem;
}

.method-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.25rem;
}

.method-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #7f8c8d;
}

.method-tab.active {
  background: white;
  color: #3498db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drop-zone {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.drop-zone.dragover {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.05);
}

.drop-zone.has-files {
  padding: 1rem;
  text-align: left;
}

.drop-zone-content i {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.drop-zone-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.drop-zone-content p {
  margin: 0 0 1.5rem 0;
  color: #7f8c8d;
}

.file-input {
  display: none;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ddd;
}

.file-item.pending { border-left-color: #f39c12; }
.file-item.uploading { border-left-color: #3498db; }
.file-item.completed { border-left-color: #2ecc71; }
.file-item.error { border-left-color: #e74c3c; }

.file-preview {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  width: 100%;
  height: 100%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.file-size {
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.file-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3498db;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #7f8c8d;
  min-width: 40px;
}

.file-status span {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.file-status .pending { background: #fff3cd; color: #856404; }
.file-status .uploading { background: #d1ecf1; color: #0c5460; }
.file-status .completed { background: #d4edda; color: #155724; }
.file-status .error { background: #f8d7da; color: #721c24; }

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.upload-queue {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-link {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.url-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.url-preview {
  position: relative;
  max-width: 200px;
}

.url-preview .preview-image {
  width: 100%;
  border-radius: 8px;
}

.remove-preview {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
}

.media-details {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.media-details h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 44px;
  align-items: center;
}

.tag {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 0.7rem;
}

.tag-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0;
  min-width: 100px;
}

.help-text {
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.advanced-options {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.advanced-content {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .upload-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .method-tabs {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .file-item {
    flex-direction: column;
    text-align: center;
  }

  .file-actions {
    align-self: stretch;
    justify-content: center;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>