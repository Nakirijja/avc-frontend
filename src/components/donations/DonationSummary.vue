<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content donation-summary-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2>Donation Details</h2>
          <div class="donation-id">#{{ donation.id }}</div>
        </div>
        <div class="header-actions">
          <button class="btn-icon" @click="printSummary" title="Print Summary">
            <i class="fas fa-print"></i>
          </button>
          <button class="btn-icon" @click="downloadReceipt" title="Download Receipt">
            <i class="fas fa-download"></i>
          </button>
          <button class="close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="modal-body">
        <!-- Donation Overview -->
        <div class="overview-section">
          <div class="amount-display">
            <div class="amount">UGX {{ donation.amount.toLocaleString() }}</div>
            <div class="status-badge" :class="donation.status">
              <i :class="getStatusIcon(donation.status)"></i>
              {{ donation.status }}
            </div>
          </div>
          
          <div class="donation-meta">
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>Donated on {{ formatDate(donation.date) }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>Recorded {{ formatRelativeTime(donation.createdAt) }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-money-bill-wave"></i>
              <span>Via {{ getMethodLabel(donation.method) }}</span>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <!-- Donor Information -->
          <div class="info-card">
            <h3 class="card-title">
              <i class="fas fa-user"></i>
              Donor Information
            </h3>
            <div class="donor-details">
              <div class="detail-row">
                <label>Name:</label>
                <span class="donor-name">{{ donation.donorName || 'Anonymous' }}</span>
              </div>
              <div class="detail-row" v-if="donation.donorEmail">
                <label>Email:</label>
                <span class="donor-email">{{ donation.donorEmail }}</span>
              </div>
              <div class="detail-row" v-if="donation.donorPhone">
                <label>Phone:</label>
                <span class="donor-phone">{{ donation.donorPhone }}</span>
              </div>
              <div class="detail-row">
                <label>Type:</label>
                <span class="donor-type">{{ donation.donor ? 'Registered User' : 'Guest Donor' }}</span>
              </div>
              <div class="detail-row" v-if="donation.anonymous">
                <label>Visibility:</label>
                <span class="anonymous-badge">
                  <i class="fas fa-eye-slash"></i>
                  Anonymous Donation
                </span>
              </div>
            </div>
          </div>

          <!-- Payment Details -->
          <div class="info-card">
            <h3 class="card-title">
              <i class="fas fa-credit-card"></i>
              Payment Details
            </h3>
            <div class="payment-details">
              <div class="detail-row">
                <label>Method:</label>
                <span class="payment-method">
                  <i :class="getMethodIcon(donation.method)"></i>
                  {{ getMethodLabel(donation.method) }}
                </span>
              </div>
              <div class="detail-row" v-if="donation.transactionId">
                <label>Transaction ID:</label>
                <span class="transaction-id">{{ donation.transactionId }}</span>
              </div>
              <div class="detail-row" v-if="donation.referenceNumber">
                <label>Reference:</label>
                <span class="reference-number">{{ donation.referenceNumber }}</span>
              </div>
              <div class="detail-row">
                <label>Amount:</label>
                <span class="amount-detail">UGX {{ donation.amount.toLocaleString() }}</span>
              </div>
              <div class="detail-row" v-if="donation.processingFee">
                <label>Processing Fee:</label>
                <span class="fee-amount">UGX {{ donation.processingFee.toLocaleString() }}</span>
              </div>
              <div class="detail-row total-row">
                <label>Net Amount:</label>
                <span class="net-amount">UGX {{ netAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Donation Purpose -->
          <div class="info-card" v-if="donation.purpose || donation.campaign">
            <h3 class="card-title">
              <i class="fas fa-bullseye"></i>
              Donation Purpose
            </h3>
            <div class="purpose-details">
              <div class="detail-row" v-if="donation.campaign">
                <label>Campaign:</label>
                <span class="campaign-name">{{ donation.campaign }}</span>
              </div>
              <div class="detail-row" v-if="donation.purpose">
                <label>Purpose:</label>
                <span class="purpose-text">{{ donation.purpose }}</span>
              </div>
              <div class="detail-row" v-if="donation.restricted">
                <label>Restrictions:</label>
                <span class="restricted-badge">
                  <i class="fas fa-lock"></i>
                  Restricted Use
                </span>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="info-card">
            <h3 class="card-title">
              <i class="fas fa-info-circle"></i>
              Additional Information
            </h3>
            <div class="additional-details">
              <div class="detail-row">
                <label>Notes:</label>
                <span class="notes-text">{{ donation.notes || 'No additional notes' }}</span>
              </div>
              <div class="detail-row" v-if="donation.dedication">
                <label>Dedication:</label>
                <span class="dedication-text">{{ donation.dedication }}</span>
              </div>
              <div class="detail-row">
                <label>Receipt Sent:</label>
                <span class="receipt-status" :class="donation.receiptSent ? 'sent' : 'pending'">
                  <i :class="donation.receiptSent ? 'fas fa-check' : 'fas fa-clock'"></i>
                  {{ donation.receiptSent ? 'Sent' : 'Pending' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="timeline-section" v-if="donation.timeline && donation.timeline.length > 0">
          <h3 class="section-title">Donation Timeline</h3>
          <div class="timeline">
            <div 
              v-for="event in donation.timeline" 
              :key="event.timestamp"
              class="timeline-event"
            >
              <div class="event-icon" :class="event.type">
                <i :class="getTimelineIcon(event.type)"></i>
              </div>
              <div class="event-content">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-description">{{ event.description }}</div>
                <div class="event-time">{{ formatDateTime(event.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <div class="action-buttons">
            <button 
              class="btn btn-primary"
              @click="sendThankYou"
              :disabled="donation.thankYouSent"
            >
              <i class="fas fa-envelope"></i>
              {{ donation.thankYouSent ? 'Thank You Sent' : 'Send Thank You' }}
            </button>
            
            <button 
              class="btn btn-outline"
              @click="issueReceipt"
              :disabled="donation.receiptSent"
            >
              <i class="fas fa-receipt"></i>
              {{ donation.receiptSent ? 'Receipt Issued' : 'Issue Receipt' }}
            </button>
            
            <button 
              class="btn btn-outline"
              @click="updateStatus"
              v-if="isAdmin"
            >
              <i class="fas fa-edit"></i>
              Update Status
            </button>

            <button 
              class="btn btn-outline"
              @click="contactDonor"
              v-if="donation.donorEmail"
            >
              <i class="fas fa-comment"></i>
              Contact Donor
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

export default {
  name: 'DonationSummary',
  props: {
    donation: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'update'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const uiStore = useUIStore()

    const isAdmin = computed(() => authStore.isAdmin)

    const netAmount = computed(() => {
      return props.donation.amount - (props.donation.processingFee || 0)
    })

    const getStatusIcon = (status) => {
      const icons = {
        'completed': 'fas fa-check-circle',
        'pending': 'fas fa-clock',
        'failed': 'fas fa-times-circle',
        'refunded': 'fas fa-undo',
        'cancelled': 'fas fa-ban'
      }
      return icons[status] || 'fas fa-info-circle'
    }

    const getMethodIcon = (method) => {
      const icons = {
        'mobile_money': 'fas fa-mobile-alt',
        'bank_transfer': 'fas fa-university',
        'cash': 'fas fa-money-bill-wave',
        'cheque': 'fas fa-money-check',
        'other': 'fas fa-credit-card'
      }
      return icons[method] || 'fas fa-credit-card'
    }

    const getMethodLabel = (method) => {
      const labels = {
        'mobile_money': 'Mobile Money',
        'bank_transfer': 'Bank Transfer',
        'cash': 'Cash',
        'cheque': 'Cheque',
        'other': 'Other'
      }
      return labels[method] || method
    }

    const getTimelineIcon = (eventType) => {
      const icons = {
        'created': 'fas fa-plus-circle',
        'processed': 'fas fa-cog',
        'completed': 'fas fa-check-circle',
        'receipt_sent': 'fas fa-receipt',
        'thank_you_sent': 'fas fa-envelope',
        'refunded': 'fas fa-undo'
      }
      return icons[eventType] || 'fas fa-circle'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatRelativeTime = (dateString) => {
      const now = new Date()
      const date = new Date(dateString)
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days} days ago`
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`
      return formatDate(dateString)
    }

    const printSummary = () => {
      uiStore.showNotification({
        type: 'success',
        message: 'Printing donation summary...'
      })
      // In real implementation, this would trigger print styles
      window.print()
    }

    const downloadReceipt = () => {
      uiStore.showNotification({
        type: 'success',
        message: 'Downloading donation receipt...'
      })
      // In real implementation, this would generate and download a PDF
    }

    const sendThankYou = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedDonation = {
          ...props.donation,
          thankYouSent: true,
          timeline: [
            ...(props.donation.timeline || []),
            {
              type: 'thank_you_sent',
              title: 'Thank You Sent',
              description: 'Thank you email sent to donor',
              timestamp: new Date().toISOString()
            }
          ]
        }
        
        emit('update', updatedDonation)
        uiStore.showNotification({
          type: 'success',
          message: 'Thank you email sent successfully!'
        })
      } catch (error) {
        uiStore.showNotification({
          type: 'error',
          message: 'Failed to send thank you email'
        })
      }
    }

    const issueReceipt = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedDonation = {
          ...props.donation,
          receiptSent: true,
          timeline: [
            ...(props.donation.timeline || []),
            {
              type: 'receipt_sent',
              title: 'Receipt Issued',
              description: 'Official receipt generated and sent',
              timestamp: new Date().toISOString()
            }
          ]
        }
        
        emit('update', updatedDonation)
        uiStore.showNotification({
          type: 'success',
          message: 'Receipt issued successfully!'
        })
      } catch (error) {
        uiStore.showNotification({
          type: 'error',
          message: 'Failed to issue receipt'
        })
      }
    }

    const updateStatus = () => {
      // This would open a status update modal in real implementation
      uiStore.showNotification({
        type: 'info',
        message: 'Opening status update...'
      })
    }

    const contactDonor = () => {
      if (props.donation.donorEmail) {
        window.open(`mailto:${props.donation.donorEmail}?subject=Regarding your donation to AVC Choir`, '_blank')
      }
    }

    // Ensure donation has a timeline
    onMounted(() => {
      if (!props.donation.timeline) {
        const defaultTimeline = [
          {
            type: 'created',
            title: 'Donation Created',
            description: 'Donation record was created',
            timestamp: props.donation.createdAt || props.donation.date
          }
        ]
        
        if (props.donation.status === 'completed') {
          defaultTimeline.push({
            type: 'completed',
            title: 'Payment Completed',
            description: 'Payment was successfully processed',
            timestamp: props.donation.updatedAt || props.donation.date
          })
        }
        
        props.donation.timeline = defaultTimeline
      }
    })

    return {
      isAdmin,
      netAmount,
      getStatusIcon,
      getMethodIcon,
      getMethodLabel,
      getTimelineIcon,
      formatDate,
      formatDateTime,
      formatRelativeTime,
      printSummary,
      downloadReceipt,
      sendThankYou,
      issueReceipt,
      updateStatus,
      contactDonor
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.donation-summary-modal {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.header-content h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.donation-id {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.header-actions {
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
  color: #3498db;
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
  padding: 0 2rem 2rem;
}

.overview-section {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.amount-display {
  margin-bottom: 1.5rem;
}

.amount {
  font-size: 3rem;
  font-weight: bold;
  color: #2ecc71;
  margin-bottom: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.failed {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.refunded {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.cancelled {
  background: #e2e3e5;
  color: #383d41;
}

.donation-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.meta-item i {
  width: 16px;
  color: #3498db;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
}

.info-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #3498db;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.card-title i {
  color: #3498db;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.detail-row label {
  font-weight: 500;
  color: #2c3e50;
  min-width: 120px;
}

.detail-row span {
  color: #7f8c8d;
  text-align: right;
  flex: 1;
}

.donor-name {
  font-weight: 600;
  color: #2c3e50;
}

.anonymous-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.payment-method {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.transaction-id, .reference-number {
  font-family: 'Courier New', monospace;
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.amount-detail, .fee-amount {
  font-weight: 600;
}

.total-row {
  border-top: 2px solid #3498db;
  padding-top: 1rem;
  margin-top: 1rem;
}

.net-amount {
  font-weight: bold;
  font-size: 1.1rem;
  color: #2ecc71;
}

.restricted-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.notes-text, .dedication-text {
  font-style: italic;
}

.receipt-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.receipt-status.sent {
  background: #d4edda;
  color: #155724;
}

.receipt-status.pending {
  background: #fff3cd;
  color: #856404;
}

.timeline-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-event {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.event-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.event-icon.created { background: #3498db; }
.event-icon.processed { background: #f39c12; }
.event-icon.completed { background: #2ecc71; }
.event-icon.receipt_sent { background: #9b59b6; }
.event-icon.thank_you_sent { background: #e74c3c; }
.event-icon.refunded { background: #95a5a6; }

.event-content {
  flex: 1;
}

.event-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.event-description {
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.event-time {
  color: #95a5a6;
  font-size: 0.8rem;
}

.action-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  border-color: #2980b9;
}

.btn-outline {
  background: white;
  color: #3498db;
  border-color: #3498db;
}

.btn-outline:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .donation-summary-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .modal-body {
    padding: 0 1rem 1rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .donation-meta {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .amount {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-row label {
    min-width: auto;
  }

  .detail-row span {
    text-align: left;
  }
}

@media print {
  .modal-overlay {
    position: static;
    background: white;
    padding: 0;
  }

  .donation-summary-modal {
    max-width: none;
    max-height: none;
    box-shadow: none;
    border-radius: 0;
  }

  .header-actions,
  .action-section {
    display: none;
  }
}
</style>