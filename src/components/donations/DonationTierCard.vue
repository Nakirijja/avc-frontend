<template>
  <div 
    class="donation-tier-card" 
    :class="{ 
      'selected': selected, 
      'featured': tier.featured 
    }"
    @click="$emit('select', tier)"
  >
    <div class="tier-header">
      <h3 class="tier-name">{{ tier.name }}</h3>
      <div class="tier-amount">UGX {{ tier.amount.toLocaleString() }}</div>
    </div>
    
    <div class="tier-description" v-if="tier.description">
      {{ tier.description }}
    </div>
    
    <div class="tier-features" v-if="tier.features">
      <ul>
        <li v-for="(feature, index) in tier.features" :key="index">
          <i class="fas fa-check"></i> {{ feature }}
        </li>
      </ul>
    </div>
    
    <div class="tier-action">
      <button class="btn" :class="selected ? 'btn-primary' : 'btn-outline'">
        {{ selected ? 'Selected' : 'Select' }}
      </button>
    </div>
    
    <div class="featured-badge" v-if="tier.featured">
      <i class="fas fa-star"></i> Most Popular
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonationTierCard',
  props: {
    tier: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select']
}
</script>

<style scoped>
.donation-tier-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.donation-tier-card:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.donation-tier-card.selected {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.05);
}

.donation-tier-card.featured {
  border-color: #f39c12;
}

.tier-header {
  margin-bottom: 1rem;
}

.tier-name {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.tier-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.tier-description {
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.4;
  flex: 1;
}

.tier-features {
  margin-bottom: 1.5rem;
  text-align: left;
}

.tier-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tier-features li {
  padding: 0.25rem 0;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tier-features i {
  color: #2ecc71;
  font-size: 0.8rem;
}

.tier-action {
  margin-top: auto;
}

.featured-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #f39c12;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.featured-badge i {
  margin-right: 0.25rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
}

.btn-outline {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-outline:hover {
  background: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .donation-tier-card {
    padding: 1rem;
  }
  
  .tier-name {
    font-size: 1.1rem;
  }
  
  .tier-amount {
    font-size: 1.25rem;
  }
}
</style>