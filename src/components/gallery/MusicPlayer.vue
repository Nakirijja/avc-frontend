<template>
  <div class="music-player" :class="{ compact: compact }">
    <!-- Compact View -->
    <div v-if="compact" class="compact-player">
      <div class="compact-info">
        <img :src="audio.thumbnail" :alt="audio.title" class="compact-cover">
        <div class="compact-details">
          <h4 class="compact-title">{{ audio.title }}</h4>
          <p class="compact-description">{{ audio.description }}</p>
        </div>
      </div>
      
      <div class="compact-controls">
        <button class="btn-icon" @click="togglePlayback">
          <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
        </button>
        <div class="compact-progress">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <input 
            type="range" 
            min="0" 
            :max="duration" 
            :value="currentTime"
            @input="seekAudio"
            class="progress-slider"
          >
          <span class="duration">{{ formatTime(duration) }}</span>
        </div>
        <button class="btn-icon" @click="toggleMute">
          <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume-up'"></i>
        </button>
      </div>
    </div>

    <!-- Full View -->
    <div v-else class="full-player">
      <div class="player-header">
        <img :src="audio.thumbnail" :alt="audio.title" class="cover-art">
        <div class="track-info">
          <h3 class="track-title">{{ audio.title }}</h3>
          <p class="track-description">{{ audio.description }}</p>
          <div class="track-meta">
            <span class="upload-date">{{ formatDate(audio.uploadDate) }}</span>
            <span class="separator">•</span>
            <span class="views">{{ audio.views }} plays</span>
            <span class="separator">•</span>
            <span class="likes">
              <i class="fas fa-heart"></i> {{ audio.likes }}
            </span>
          </div>
        </div>
        
        <div class="player-actions">
          <button class="btn-icon" @click="toggleLike" :class="{ liked: audio.liked }">
            <i class="fas fa-heart"></i>
          </button>
          <button class="btn-icon" @click="downloadAudio">
            <i class="fas fa-download"></i>
          </button>
          <button class="btn-icon" @click="shareAudio">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>

      <div class="player-controls">
        <div class="control-buttons">
          <button class="btn-icon large" @click="previousTrack" :disabled="!hasPrevious">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="btn-icon large play-btn" @click="togglePlayback">
            <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <button class="btn-icon large" @click="nextTrack" :disabled="!hasNext">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>

        <div class="progress-section">
          <span class="time-current">{{ formatTime(currentTime) }}</span>
          <div class="progress-container">
            <input 
              type="range" 
              min="0" 
              :max="duration" 
              :value="currentTime"
              @input="seekAudio"
              class="progress-slider"
            >
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: progressPercentage + '%' }"
              ></div>
              <div 
                class="progress-buffer" 
                :style="{ width: bufferPercentage + '%' }"
              ></div>
            </div>
          </div>
          <span class="time-duration">{{ formatTime(duration) }}</span>
        </div>

        <div class="volume-control">
          <button class="btn-icon" @click="toggleMute">
            <i class="fas" :class="volumeIcon"></i>
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            :value="volume"
            @input="setVolume"
            class="volume-slider"
          >
        </div>
      </div>

      <!-- Playback Settings -->
      <div class="playback-settings">
        <button 
          class="btn-icon" 
          @click="toggleRepeat"
          :class="{ active: repeatMode !== 'none' }"
        >
          <i class="fas" :class="repeatIcon"></i>
        </button>
        <button 
          class="btn-icon" 
          @click="toggleShuffle"
          :class="{ active: shuffle }"
        >
          <i class="fas fa-random"></i>
        </button>
        <button class="btn-icon" @click="togglePlaybackRate">
          <span class="playback-rate">{{ playbackRate }}x</span>
        </button>
      </div>

      <!-- Waveform Visualization -->
      <div class="waveform-container" v-if="showWaveform">
        <canvas ref="waveformCanvas" class="waveform"></canvas>
      </div>

      <!-- Equalizer -->
      <div class="equalizer" v-if="showEqualizer">
        <div class="eq-bands">
          <div 
            v-for="(band, index) in equalizerBands" 
            :key="index"
            class="eq-band"
          >
            <input 
              type="range" 
              min="-12" 
              max="12" 
              :value="band.gain"
              @input="updateEqualizer(index, $event)"
              class="eq-slider"
              orient="vertical"
            >
            <span class="eq-frequency">{{ band.freq }}Hz</span>
          </div>
        </div>
        <button class="btn-link" @click="resetEqualizer">
          Reset EQ
        </button>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio 
      ref="audioElement"
      :src="audio.url"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplaythrough="onCanPlayThrough"
      @error="onError"
    ></audio>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUIStore } from '@/stores/uiStore'

export default {
  name: 'MusicPlayer',
  props: {
    audio: {
      type: Object,
      required: true
    },
    playlist: {
      type: Array,
      default: () => []
    },
    compact: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const uiStore = useUIStore()
    const audioElement = ref(null)
    const waveformCanvas = ref(null)
    
    const isPlaying = ref(false)
    const isMuted = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(80)
    const buffered = ref(0)
    const repeatMode = ref('none') // 'none', 'one', 'all'
    const shuffle = ref(false)
    const playbackRate = ref(1.0)
    const showWaveform = ref(false)
    const showEqualizer = ref(false)

    const equalizerBands = ref([
      { freq: 60, gain: 0 },
      { freq: 230, gain: 0 },
      { freq: 910, gain: 0 },
      { freq: 3000, gain: 0 },
      { freq: 14000, gain: 0 }
    ])

    const progressPercentage = computed(() => {
      return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
    })

    const bufferPercentage = computed(() => {
      return duration.value > 0 ? (buffered.value / duration.value) * 100 : 0
    })

    const volumeIcon = computed(() => {
      if (isMuted.value || volume.value === 0) return 'fa-volume-mute'
      if (volume.value < 30) return 'fa-volume-off'
      if (volume.value < 70) return 'fa-volume-down'
      return 'fa-volume-up'
    })

    const repeatIcon = computed(() => {
      return repeatMode.value === 'one' ? 'fa-redo-alt' : 'fa-redo'
    })

    const hasPrevious = computed(() => {
      return props.playlist.length > 1
    })

    const hasNext = computed(() => {
      return props.playlist.length > 1
    })

    const onLoadedMetadata = () => {
      duration.value = audioElement.value.duration
      if (props.autoplay) {
        audioElement.value.play()
        isPlaying.value = true
      }
    }

    const onTimeUpdate = () => {
      currentTime.value = audioElement.value.currentTime
      
      // Update buffered progress
      if (audioElement.value.buffered.length > 0) {
        buffered.value = audioElement.value.buffered.end(0)
      }
    }

    const onEnded = () => {
      isPlaying.value = false
      currentTime.value = 0
      
      if (repeatMode.value === 'one') {
        audioElement.value.currentTime = 0
        audioElement.value.play()
        isPlaying.value = true
      } else if (repeatMode.value === 'all' || hasNext.value) {
        emit('next')
      }
    }

    const onCanPlayThrough = () => {
      // Audio is ready to play
      console.log('Audio can play through')
    }

    const onError = (error) => {
      console.error('Audio error:', error)
      uiStore.showNotification({
        type: 'error',
        message: 'Failed to load audio file'
      })
    }

    const togglePlayback = () => {
      if (!audioElement.value) return

      if (isPlaying.value) {
        audioElement.value.pause()
      } else {
        audioElement.value.play()
      }
      isPlaying.value = !isPlaying.value
    }

    const seekAudio = (event) => {
      if (!audioElement.value) return
      const seekTime = parseFloat(event.target.value)
      audioElement.value.currentTime = seekTime
      currentTime.value = seekTime
    }

    const setVolume = (event) => {
      const newVolume = parseInt(event.target.value)
      volume.value = newVolume
      
      if (audioElement.value) {
        audioElement.value.volume = newVolume / 100
        isMuted.value = newVolume === 0
      }
    }

    const toggleMute = () => {
      if (!audioElement.value) return
      audioElement.value.muted = !audioElement.value.muted
      isMuted.value = audioElement.value.muted
    }

    const toggleRepeat = () => {
      const modes = ['none', 'one', 'all']
      const currentIndex = modes.indexOf(repeatMode.value)
      repeatMode.value = modes[(currentIndex + 1) % modes.length]
    }

    const toggleShuffle = () => {
      shuffle.value = !shuffle.value
    }

    const togglePlaybackRate = () => {
      const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
      const currentIndex = rates.indexOf(playbackRate.value)
      playbackRate.value = rates[(currentIndex + 1) % rates.length]
      
      if (audioElement.value) {
        audioElement.value.playbackRate = playbackRate.value
      }
    }

    const previousTrack = () => {
      emit('previous')
    }

    const nextTrack = () => {
      emit('next')
    }

    const toggleLike = () => {
      props.audio.liked = !props.audio.liked
      props.audio.likes += props.audio.liked ? 1 : -1
      
      uiStore.showNotification({
        type: 'success',
        message: props.audio.liked ? 'Added to favorites!' : 'Removed from favorites'
      })
    }

    const downloadAudio = () => {
      const link = document.createElement('a')
      link.href = props.audio.url
      link.download = props.audio.title
      link.click()
      
      uiStore.showNotification({
        type: 'success',
        message: 'Download started'
      })
    }

    const shareAudio = () => {
      const shareUrl = window.location.href
      const text = `Listen to: ${props.audio.title}`
      
      if (navigator.share) {
        navigator.share({
          title: props.audio.title,
          text: text,
          url: shareUrl
        })
      } else {
        navigator.clipboard.writeText(`${text} - ${shareUrl}`)
        uiStore.showNotification({
          type: 'success',
          message: 'Link copied to clipboard!'
        })
      }
    }

    const formatTime = (seconds) => {
      if (!seconds || isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const updateEqualizer = (index, event) => {
      equalizerBands.value[index].gain = parseInt(event.target.value)
      // In a real app, you'd apply the EQ filter to the audio
      applyEqualizer()
    }

    const resetEqualizer = () => {
      equalizerBands.value.forEach(band => band.gain = 0)
      applyEqualizer()
    }

    const applyEqualizer = () => {
      // This would connect to Web Audio API in a real implementation
      console.log('Applying EQ:', equalizerBands.value)
    }

    const drawWaveform = () => {
      if (!waveformCanvas.value || !props.audio.waveform) return
      
      const canvas = waveformCanvas.value
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#3498db'
      
      // Simple waveform drawing (in real app, use Web Audio API)
      const waveform = props.audio.waveform || Array(100).fill(0.5)
      const barWidth = width / waveform.length
      
      waveform.forEach((value, index) => {
        const barHeight = value * height
        const x = index * barWidth
        const y = (height - barHeight) / 2
        
        ctx.fillRect(x, y, barWidth - 1, barHeight)
      })
    }

    onMounted(() => {
      // Initialize audio element
      if (audioElement.value) {
        audioElement.value.volume = volume.value / 100
        audioElement.value.playbackRate = playbackRate.value
      }

      // Draw waveform if enabled
      if (showWaveform.value) {
        drawWaveform()
      }

      // Add global keyboard shortcuts
      const handleKeydown = (event) => {
        if (event.target.tagName === 'INPUT') return
        
        switch (event.code) {
          case 'Space':
            event.preventDefault()
            togglePlayback()
            break
          case 'ArrowLeft':
            if (audioElement.value) {
              audioElement.value.currentTime = Math.max(0, audioElement.value.currentTime - 10)
            }
            break
          case 'ArrowRight':
            if (audioElement.value) {
              audioElement.value.currentTime = Math.min(duration.value, audioElement.value.currentTime + 10)
            }
            break
          case 'KeyM':
            toggleMute()
            break
        }
      }

      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      // Clean up
      if (audioElement.value) {
        audioElement.value.pause()
        audioElement.value = null
      }
    })

    watch(() => props.audio, () => {
      // Reset when audio changes
      isPlaying.value = false
      currentTime.value = 0
      duration.value = 0
      
      if (props.autoplay) {
        setTimeout(() => {
          if (audioElement.value) {
            audioElement.value.play()
            isPlaying.value = true
          }
        }, 100)
      }
    })

    watch(showWaveform, (newVal) => {
      if (newVal) {
        // Wait for DOM update
        setTimeout(drawWaveform, 100)
      }
    })

    return {
      audioElement,
      waveformCanvas,
      isPlaying,
      isMuted,
      currentTime,
      duration,
      volume,
      repeatMode,
      shuffle,
      playbackRate,
      showWaveform,
      showEqualizer,
      equalizerBands,
      progressPercentage,
      bufferPercentage,
      volumeIcon,
      repeatIcon,
      hasPrevious,
      hasNext,
      onLoadedMetadata,
      onTimeUpdate,
      onEnded,
      onCanPlayThrough,
      onError,
      togglePlayback,
      seekAudio,
      setVolume,
      toggleMute,
      toggleRepeat,
      toggleShuffle,
      togglePlaybackRate,
      previousTrack,
      nextTrack,
      toggleLike,
      downloadAudio,
      shareAudio,
      formatTime,
      formatDate,
      updateEqualizer,
      resetEqualizer,
      drawWaveform
    }
  }
}
</script>

<style scoped>
.music-player {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Compact Player */
.compact-player {
  padding: 1rem;
}

.compact-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.compact-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.compact-details {
  flex: 1;
}

.compact-title {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.compact-description {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.compact-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.compact-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.compact-progress .current-time,
.compact-progress .duration {
  font-size: 0.8rem;
  color: #7f8c8d;
  min-width: 35px;
}

/* Full Player */
.full-player {
  padding: 1.5rem;
}

.player-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.cover-art {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.track-info {
  flex: 1;
}

.track-title {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.track-description {
  margin: 0 0 1rem 0;
  color: #7f8c8d;
  line-height: 1.4;
}

.track-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #95a5a6;
  font-size: 0.9rem;
}

.separator {
  opacity: 0.5;
}

.likes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.player-actions {
  display: flex;
  gap: 0.5rem;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.control-buttons {
  display: flex;
  align-items: center;
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

.btn-icon:hover:not(:disabled) {
  background: #f8f9fa;
  color: #3498db;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.large {
  padding: 0.75rem;
  font-size: 1.2rem;
}

.btn-icon.active {
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.btn-icon.liked {
  color: #e74c3c;
}

.play-btn {
  background: #3498db;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
}

.play-btn:hover {
  background: #2980b9;
  transform: scale(1.05);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.time-current,
.time-duration {
  font-size: 0.9rem;
  color: #7f8c8d;
  min-width: 40px;
}

.progress-container {
  flex: 1;
  position: relative;
}

.progress-slider {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.progress-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.progress-bar {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background: #3498db;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.progress-buffer {
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
}

.playback-settings {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.playback-rate {
  font-size: 0.8rem;
  font-weight: 600;
}

.waveform-container {
  height: 60px;
  margin-bottom: 1rem;
}

.waveform {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #f8f9fa;
}

.equalizer {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.eq-bands {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100px;
  margin-bottom: 1rem;
}

.eq-band {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.eq-slider {
  writing-mode: bt-lr;
  width: 30px;
  height: 80px;
}

.eq-frequency {
  font-size: 0.7rem;
  color: #7f8c8d;
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

audio {
  display: none;
}

@media (max-width: 768px) {
  .full-player {
    padding: 1rem;
  }

  .player-header {
    flex-direction: column;
    text-align: center;
  }

  .cover-art {
    align-self: center;
  }

  .player-actions {
    align-self: center;
  }

  .player-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .progress-section {
    order: -1;
    width: 100%;
  }

  .volume-control {
    width: 100%;
    justify-content: center;
  }

  .eq-bands {
    height: 60px;
  }

  .eq-slider {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .compact-player {
    padding: 0.75rem;
  }

  .compact-controls {
    flex-direction: column;
    gap: 0.75rem;
  }

  .compact-progress {
    width: 100%;
  }
}
</style>