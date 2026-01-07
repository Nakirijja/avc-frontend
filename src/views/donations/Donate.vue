<!-- src/views/donations/Donate.vue -->
<template>
  <div class="donate-page">
    <!-- Hero Section with Dynamic Background -->
    <section class="donate-hero text-white py-5" :style="heroStyle">
      <div class="hero-overlay" :style="overlayStyle"></div>
      <div class="container py-5 position-relative">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4 hero-title">Support Our Mission</h1>
            <p class="lead hero-subtitle">Your donation helps us continue creating beautiful music and serving our community</p>
            <div class="row mt-4">
              <div class="col-md-4">
                <div class="text-center stat-item">
                  <h4 class="fw-bold stat-number">UGX {{ summary.total_amount ? summary.total_amount.toLocaleString() : '0' }}</h4>
                  <p class="mb-0 stat-label">Total Raised</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center stat-item">
                  <h4 class="fw-bold stat-number">{{ summary.total_donations || 0 }}</h4>
                  <p class="mb-0 stat-label">Total Donations</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center stat-item">
                  <h4 class="fw-bold stat-number">{{ summary.unique_donors || 0 }}</h4>
                  <p class="mb-0 stat-label">Supporters</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 text-center">
            <i class="fas fa-heart fa-6x hero-icon"></i>
          </div>
        </div>
        
        <!-- Background Image Indicator Dots -->
        <div class="hero-indicators">
          <button 
            v-for="(image, index) in heroImages" 
            :key="index"
            class="indicator-dot"
            :class="{ active: currentImageIndex === index }"
            @click="setImage(index)"
            :aria-label="`Show background image ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- Rest of your template remains the same -->
    <div class="container py-5">
      <div class="row">
        <!-- Donation Options -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h3 class="card-title mb-0">Make a Donation</h3>
            </div>
            <div class="card-body">
              <!-- Donation Tiers -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5 class="mb-3">Select Donation Amount</h5>
                  <div class="d-flex flex-wrap gap-2">
                    <button 
                      v-for="tier in donationTiers" 
                      :key="tier.id"
                      class="btn"
                      :class="selectedTier === tier.id ? 'btn-primary' : 'btn-outline-primary'"
                      @click="selectTier(tier)"
                    >
                      UGX {{ tier.amount.toLocaleString() }}
                    </button>
                    <div class="input-group" style="width: 200px;">
                      <span class="input-group-text">UGX</span>
                      <input 
                        type="number" 
                        class="form-control" 
                        placeholder="Custom amount"
                        v-model="customAmount"
                        @focus="selectCustomAmount"
                        min="1"
                      >
                    </div>
                  </div>
                  <small class="text-danger" v-if="errors.amount">{{ errors.amount[0] }}</small>
                </div>
              </div>

              <!-- Donor Information -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Full Name *</label>
                  <input type="text" class="form-control" v-model="donorInfo.name" 
                         :class="{ 'is-invalid': errors.donor_name }" required>
                  <div class="invalid-feedback" v-if="errors.donor_name">
                    {{ errors.donor_name[0] }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email Address *</label>
                  <input type="email" class="form-control" v-model="donorInfo.email" 
                         :class="{ 'is-invalid': errors.donor_email }" required>
                  <div class="invalid-feedback" v-if="errors.donor_email">
                    {{ errors.donor_email[0] }}
                  </div>
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Message (Optional)</label>
                  <textarea class="form-control" rows="3" v-model="donorInfo.message" 
                            placeholder="Add a message of support..."></textarea>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="mb-4">
                <h5 class="mb-3">Payment Method *</h5>
                <div class="row">
                  <div class="col-md-3 mb-2" v-for="method in paymentMethods" :key="method.id">
                    <div class="payment-method-card text-center p-3 border rounded"
                         :class="{ 'border-primary': selectedMethod === method.id }"
                         @click="selectMethod(method.id)">
                      <i :class="method.icon" class="fa-2x mb-2"></i>
                      <p class="small mb-0">{{ method.name }}</p>
                    </div>
                  </div>
                </div>
                <small class="text-danger" v-if="errors.method">{{ errors.method[0] }}</small>
              </div>

              <!-- Mobile Money Phone Number (Conditional) -->
              <div v-if="selectedMethod === 'mobile_money'" class="mb-4">
                <label class="form-label">Phone Number *</label>
                <input type="tel" class="form-control" v-model="paymentDetails.phone" 
                       placeholder="e.g., 0751234567" required>
                <small class="text-muted">Enter your mobile money registered phone number</small>
              </div>

              <!-- Donation Button -->
              <button class="btn btn-primary btn-lg w-100 py-3" @click="processDonation" :disabled="processing">
                <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                {{ processing ? 'Processing...' : `Donate UGX ${getDonationAmount().toLocaleString()}` }}
              </button>
            </div>
          </div>
        </div>

        <!-- Impact Section -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Your Impact</h5>
            </div>
            <div class="card-body">
              <div class="impact-item d-flex align-items-center mb-3" v-for="impact in impacts" :key="impact.id">
                <i :class="impact.icon" class="text-primary fa-lg me-3"></i>
                <div>
                  <h6 class="mb-0">{{ impact.title }}</h6>
                  <small class="text-muted">{{ impact.description }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Donations -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Recent Supporters</h5>
            </div>
            <div class="card-body">
              <div v-if="recentDonations.length === 0" class="text-center text-muted py-3">
                <p>Be the first to support us!</p>
              </div>
              <div v-else>
                <div v-for="donation in recentDonations" :key="donation.id" class="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>{{ donation.display_name }}</strong>
                    <br>
                    <small class="text-muted">{{ formatDate(donation.date) }}</small>
                  </div>
                  <span class="badge bg-success">UGX {{ donation.amount.toLocaleString() }}</span>
                </div>
              </div>
              <div class="text-center mt-3">
                <button class="btn btn-sm btn-outline-primary" @click="loadRecentDonations">
                  <i class="fas fa-refresh me-1"></i>Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title text-success">
              <i class="fas fa-check-circle me-2"></i>Donation Successful!
            </h5>
          </div>
          <div class="modal-body text-center">
            <i class="fas fa-heart fa-3x text-success mb-3"></i>
            <h4>Thank You, {{ lastDonation.donor_name }}!</h4>
            <p class="lead">Your donation of <strong>UGX {{ lastDonation.amount ? lastDonation.amount.toLocaleString() : '0' }}</strong> has been received.</p>
            <p class="text-muted">We appreciate your support in our mission to create beautiful music.</p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-primary" @click="showSuccessModal = false">Continue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/api'

// Import local AVC images
import avcHero1 from '@/assets/images/avc/hero-1.jpg'
import avcHero2 from '@/assets/images/avc/hero-2.jpg'
import avcHero3 from '@/assets/images/avc/hero-3.jpg'
import avcHero4 from '@/assets/images/avc/hero-4.jpg'
import avcHero5 from '@/assets/images/avc/hero-5.jpg'

export default {
  name: 'DonateView',
  data() {
    return {
      selectedTier: null,
      customAmount: null,
      selectedMethod: 'mobile_money',
      processing: false,
      showSuccessModal: false,
      donorInfo: {
        name: '',
        email: '',
        message: ''
      },
      paymentDetails: {
        phone: ''
      },
      errors: {},
      summary: {
        total_amount: 0,
        total_donations: 0,
        unique_donors: 0
      },
      lastDonation: {},
      
      // Hero Background Images - Using local AVC images
      currentImageIndex: 0,
      heroImages: [
        {
          url: avcHero1,
          alt: 'AVC Choir performing at concert'
        },
        {
          url: avcHero2,
          alt: 'AVC members in rehearsal'
        },
        {
          url: avcHero3,
          alt: 'AVC community outreach event'
        },
        {
          url: avcHero4,
          alt: 'AVC choir in traditional attire'
        },
        {
          url: avcHero5,
          alt: 'AVC musical performance'
        }
      ],
      imageInterval: null,
      
      // Overlay options for different visibility levels
      overlayOptions: [
        'rgba(0, 0, 0, 0.3)',  // Light overlay
        'rgba(0, 0, 0, 0.4)',  // Medium overlay
        'rgba(0, 0, 0, 0.5)',  // Dark overlay
      ],
      currentOverlay: 0,
      
      donationTiers: [
        { id: 1, amount: 50000, name: 'Basic Support' },
        { id: 2, amount: 100000, name: 'Friend of Choir' },
        { id: 3, amount: 250000, name: 'Silver Sponsor' },
        { id: 4, amount: 500000, name: 'Gold Sponsor' },
        { id: 5, amount: 1000000, name: 'Platinum Sponsor' }
      ],
      paymentMethods: [
        { id: 'mobile_money', name: 'Mobile Money', icon: 'fas fa-mobile-alt' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: 'fas fa-university' },
        { id: 'credit_card', name: 'Credit Card', icon: 'fas fa-credit-card' },
        { id: 'cash', name: 'Cash', icon: 'fas fa-money-bill' }
      ],
      impacts: [
        {
          id: 1,
          icon: 'fas fa-music',
          title: 'Music Equipment',
          description: 'Help purchase instruments and sound equipment'
        },
        {
          id: 2,
          icon: 'fas fa-tshirt',
          title: 'Choir Uniforms',
          description: 'Support our members with performance attire'
        },
        {
          id: 3,
          icon: 'fas fa-bus',
          title: 'Transportation',
          description: 'Enable us to reach community events'
        },
        {
          id: 4,
          icon: 'fas fa-graduation-cap',
          title: 'Music Education',
          description: 'Fund workshops and training sessions'
        }
      ],
      recentDonations: []
    }
  },
  computed: {
    heroStyle() {
      return {
        backgroundImage: `url(${this.heroImages[this.currentImageIndex].url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transition: 'background-image 1s ease-in-out'
      }
    },
    overlayStyle() {
      return {
        backgroundColor: this.overlayOptions[this.currentOverlay]
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.loadDonationSummary(),
      this.loadRecentDonations()
    ])
    
    // Preload images for smoother transitions
    this.preloadImages()
    
    // Start background image rotation
    this.startImageRotation()
  },
  beforeUnmount() {
    // Clean up interval when component is destroyed
    this.stopImageRotation()
  },
  methods: {
    // Preload images for smoother transitions
    preloadImages() {
      this.heroImages.forEach(image => {
        const img = new Image()
        img.src = image.url
      })
    },
    
    // Hero Background Methods
    startImageRotation() {
      this.imageInterval = setInterval(() => {
        this.nextImage()
      }, 5000) // Change image every 5 seconds
    },
    
    stopImageRotation() {
      if (this.imageInterval) {
        clearInterval(this.imageInterval)
        this.imageInterval = null
      }
    },
    
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length
    },
    
    setImage(index) {
      this.currentImageIndex = index
      // Reset the interval when user manually selects an image
      this.stopImageRotation()
      this.startImageRotation()
    },
    
    // Overlay adjustment methods
    adjustOverlay(darker = true) {
      if (darker && this.currentOverlay < this.overlayOptions.length - 1) {
        this.currentOverlay++
      } else if (!darker && this.currentOverlay > 0) {
        this.currentOverlay--
      }
    },

    // Existing methods (keep all your existing methods the same)
    selectTier(tier) {
      this.selectedTier = tier.id
      this.customAmount = null
      this.clearErrors()
    },
    
    selectCustomAmount() {
      this.selectedTier = null
      this.clearErrors()
    },
    
    selectMethod(methodId) {
      this.selectedMethod = methodId
      this.clearErrors()
    },
    
    getDonationAmount() {
      if (this.customAmount) {
        return parseInt(this.customAmount)
      }
      if (this.selectedTier) {
        const tier = this.donationTiers.find(t => t.id === this.selectedTier)
        return tier ? tier.amount : 0
      }
      return 0
    },
    
    async processDonation() {
      this.clearErrors()
      
      const amount = this.getDonationAmount()
      if (amount <= 0) {
        this.errors.amount = ['Please select or enter a donation amount']
        return
      }

      if(!this.donorInfo.name){
        this.errors.donor_name = ['Full name is required']
        return
      }

      if(!this.selectedMethod) {
        this.errors.method = ['Please select a payment method']
        return
      }

      // Validate mobile money phone number
      if(this.selectedMethod == 'mobile_money' && !this.paymentDetails.phone) {
        alert('Please enter your phone number for mobile money payment')
        return
      }

      this.processing = true

      try {
        const donationData = {
          amount: amount,
          donor_name: this.donorInfo.name,
          donor_email: this.donorInfo.email,
          method: this.selectedMethod,
          notes: this.donorInfo.message
        }

        // Add phone number for mobile money payments
        if (this.selectedMethod === 'mobile_money') {
          donationData.phone_number = this.paymentDetails.phone
        }

        const response = await apiService.donations.createDonation(donationData)
        
        // Store last donation for success modal
        this.lastDonation = response.data
        
        // Show success modal
        this.showSuccessModal = true
        
        // Refresh data
        await Promise.all([
          this.loadDonationSummary(),
          this.loadRecentDonations()
        ])
        
        // Reset form after successful donation
        this.resetForm()
        
      } catch (error) {
        console.error('Donation error:', error)
        if (error.response?.data) {
          this.errors = error.response.data
        } else {
          alert('There was an error processing your donation. Please try again.')
        }
      } finally {
        this.processing = false
      }
    },
    
    async loadDonationSummary() {
      try {
        const response = await apiService.donations.getSummary()
        this.summary = response.data
      } catch (error) {
        console.error('Error loading donation summary:', error)
        this.summary = {
          total_amount: 0,
          total_donations: 0,
          unique_donors: 0
        }
      }
    },
    
    async loadRecentDonations() {
      const maxRetries = 3;
      const retryDelay = 1000;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await apiService.donations.getDonations();
          // Get first 5 donations for the recent supporters section
          this.recentDonations = response.data.results ? 
            response.data.results.slice(0, 5) : 
            response.data.slice(0, 5);
          return;
        } catch (error) {
          console.error(`Error loading recent donations (attempt ${attempt}/${maxRetries}):`, error);

          if(error.response?.status === 429 && attempt < maxRetries){
            await new Promise(resolve => setTimeout(resolve,retryDelay * attempt));
            continue;
          }

          // Fallback to empty array
          this.recentDonations = [];
          break;
        }
      }
    },
    
    resetForm() {
      this.selectedTier = null
      this.customAmount = null
      this.donorInfo = { name: '', email: '', message: '' }
      this.paymentDetails.phone = ''
      this.errors = {}
    },
    
    clearErrors() {
      this.errors = {}
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.donate-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  transition: background-color 0.5s ease;
}

.donate-hero .container {
  position: relative;
  z-index: 2;
}

.hero-title {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.25rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.5rem;
}

.stat-label {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
}

.hero-icon {
  filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.5));
  animation: float 3s ease-in-out infinite;
  opacity: 0.9;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator-dot.active {
  background: white;
  border-color: white;
  transform: scale(1.2);
}

/* Overlay control buttons (optional - you can remove if not needed) */
.overlay-controls {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 3;
  display: flex;
  gap: 0.5rem;
}

.overlay-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.payment-method-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method-card:hover {
  border-color: #0d6efd !important;
  transform: translateY(-2px);
}

.impact-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.impact-item:last-child {
  border-bottom: none;
}

.modal.show {
  backdrop-filter: blur(2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .donate-hero {
    min-height: 50vh;
    text-align: center;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-indicators {
    bottom: 1rem;
  }
  
  .stat-item {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .overlay-controls {
    top: 1rem;
    right: 1rem;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .donate-hero {
    background-attachment: scroll !important;
  }
  
  .hero-icon {
    animation: none;
  }
  
  .indicator-dot {
    transition: none;
  }
  
  .hero-overlay {
    transition: none;
  }
}
</style>