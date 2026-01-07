<!-- src/components/common/LeadershipCard.vue -->
<template>
  <article class="leadership-card">
    <div class="card-image">
      <img 
        :src="leader.avatar" 
        :alt="`Portrait of ${leader.name}`" 
        class="leader-avatar"
        loading="lazy"
        @error="handleImageError"
      >
      <div class="social-links" v-if="hasSocialLinks">
        <a 
          v-if="leader.social?.email" 
          :href="`mailto:${leader.social.email}`"
          class="social-link"
          :aria-label="`Send email to ${leader.name}`"
          @click="trackSocialClick('email')"
        >
          <i class="fas fa-envelope" aria-hidden="true"></i>
        </a>
        <a 
          v-if="leader.social?.phone" 
          :href="`tel:${leader.social.phone}`"
          class="social-link"
          :aria-label="`Call ${leader.name}`"
          @click="trackSocialClick('phone')"
        >
          <i class="fas fa-phone" aria-hidden="true"></i>
        </a>
        <a 
          v-if="leader.social?.linkedin" 
          :href="leader.social.linkedin"
          class="social-link"
          :aria-label="`Visit ${leader.name}'s LinkedIn profile`"
          target="_blank"
          rel="noopener noreferrer"
          @click="trackSocialClick('linkedin')"
        >
          <i class="fab fa-linkedin" aria-hidden="true"></i>
        </a>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="leader-name">{{ leader.name }}</h3>
      <p class="leader-position">{{ leader.position }}</p>
      <p class="leader-bio">{{ leader.bio }}</p>
      
      <div class="leader-stats" v-if="hasStats">
        <div 
          v-for="(value, key) in leader.stats" 
          :key="key" 
          class="stat"
          :aria-label="`${value} ${formatStatLabel(key)}`"
        >
          <div class="stat-value">{{ value }}</div>
          <div class="stat-label">{{ formatStatLabel(key) }}</div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'LeadershipCard',
  props: {
    leader: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.name && value.position && value.bio && value.avatar
      }
    }
  },
  emits: ['social-click'],
  setup(props, { emit }) {
    const hasSocialLinks = computed(() => {
      return props.leader.social && Object.keys(props.leader.social).length > 0
    })

    const hasStats = computed(() => {
      return props.leader.stats && Object.keys(props.leader.stats).length > 0
    })

    const formatStatLabel = (key) => {
      const labels = {
        years: 'Years',
        projects: 'Projects',
        members: 'Members',
        concerts: 'Concerts'
      }
      return labels[key] || key
    }

    const trackSocialClick = (platform) => {
      emit('social-click', {
        leaderName: props.leader.name,
        platform,
        timestamp: new Date().toISOString()
      })
    }

    const handleImageError = (event) => {
      event.target.src = '/assets/images/avatars/default-avatar.jpg'
    }

    return {
      hasSocialLinks,
      hasStats,
      formatStatLabel,
      trackSocialClick,
      handleImageError
    }
  }
}
</script>

<style scoped>
.leadership-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  position: relative;
}

.leadership-card:focus-within {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

.leadership-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 250px;
  overflow: hidden;
  background: #f8f9fa;
}

.leader-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.leadership-card:hover .leader-avatar {
  transform: scale(1.05);
}

.social-links {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.leadership-card:hover .social-links,
.leadership-card:focus-within .social-links {
  opacity: 1;
}

.social-link {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.95);
  color: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.social-link:hover,
.social-link:focus {
  background: #3498db;
  color: white;
  transform: scale(1.1);
  outline: none;
}

.card-content {
  padding: 2rem;
}

.leader-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.2;
}

.leader-position {
  margin: 0 0 1rem 0;
  color: #3498db;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.3;
}

.leader-bio {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.leader-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .leadership-card,
  .leader-avatar,
  .social-link {
    transition: none;
  }
  
  .leadership-card:hover {
    transform: none;
  }
  
  .leadership-card:hover .leader-avatar {
    transform: none;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .card-content {
    padding: 1.5rem;
  }

  .leader-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .social-links {
    opacity: 1; /* Always show on mobile for accessibility */
  }
  
  .leader-name {
    font-size: 1.1rem;
  }
  
  .leader-bio {
    font-size: 0.9rem;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .leadership-card {
    border: 2px solid #2c3e50;
  }
  
  .social-link {
    border: 2px solid #3498db;
  }
}

/* Print styles */
@media print {
  .leadership-card {
    box-shadow: none;
    border: 1px solid #ddd;
    break-inside: avoid;
  }
  
  .social-links {
    display: none;
  }
}
</style>