<template>
  <div class="card stats-card h-100">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="icon-circle" :style="{ backgroundColor: color + '20', color: color }">
          <i :class="icon"></i>
        </div>
        <div v-if="trend !== null" :class="['badge', trendClass]">
          <i :class="trendIcon"></i> {{ Math.abs(trend) }}%
        </div>
      </div>
      <h3 class="card-title">{{ formattedValue }}</h3>
      <p class="card-text">{{ title }}</p>
      <div v-if="comparison" class="d-flex align-items-center">
        <small class="text-muted me-2">vs previous:</small>
        <span :class="comparisonClass">{{ comparison }}</span>
      </div>
      <div v-if="showProgress" class="mt-auto">
        <div class="progress mt-2" style="height: 6px;">
          <div class="progress-bar" :style="{ width: progressPercentage + '%', backgroundColor: color }"></div>
        </div>
        <small class="text-muted d-block text-center">{{ progressText }}</small>
      </div>
      <div v-if="actions && actions.length" class="mt-2 d-flex gap-2 justify-content-end">
        <button v-for="action in actions" :key="action.label" class="btn btn-sm btn-outline-secondary" @click="action.handler" :title="action.label">
          <i :class="action.icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'StatsCard',
  props: {
    title: { type: String, required: true },
    value: { type: [Number, String], required: true },
    icon: { type: String, required: true },
    color: { type: String, default: '#3498db' },
    trend: { type: Number, default: null },
    comparison: { type: String, default: '' },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    maxValue: { type: Number, default: null },
    showProgress: { type: Boolean, default: false },
    actions: { type: Array, default: () => [] }
  },
  setup(props) {
    const formattedValue = computed(() => typeof props.value === 'number' ? props.prefix + props.value.toLocaleString() + props.suffix : props.prefix + props.value + props.suffix)
    const trendClass = computed(() => props.trend > 0 ? 'bg-success text-white' : props.trend < 0 ? 'bg-danger text-white' : 'bg-secondary text-white')
    const trendIcon = computed(() => props.trend > 0 ? 'fas fa-arrow-up' : props.trend < 0 ? 'fas fa-arrow-down' : 'fas fa-minus')
    const comparisonClass = computed(() => props.comparison.includes('+') ? 'text-success' : props.comparison.includes('-') ? 'text-danger' : 'text-muted')
    const progressPercentage = computed(() => props.maxValue && typeof props.value === 'number' ? Math.min((props.value / props.maxValue) * 100, 100) : 0)
    const progressText = computed(() => props.maxValue && typeof props.value === 'number' ? `${props.value.toLocaleString()} / ${props.maxValue.toLocaleString()}` : '')
    
    return { formattedValue, trendClass, trendIcon, comparisonClass, progressPercentage, progressText }
  }
}
</script>

<style scoped>
.stats-card .icon-circle {
  width: 50px; height: 50px; border-radius: 12px; display: flex;
  align-items: center; justify-content: center; font-size: 1.25rem;
}
</style>
