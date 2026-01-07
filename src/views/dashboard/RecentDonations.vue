<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4>Recent Donations</h4>
        <small class="text-muted">Track and manage recent donations</small>
      </div>
      <div class="d-flex gap-2">
        <select v-model="dateRange" class="form-select form-select-sm">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="ytd">Year to Date</option>
          <option value="all">All Time</option>
        </select>
        <button class="btn btn-primary btn-sm" @click="exportDonations"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>

    <!-- Donations Table -->
    <div class="table-responsive card mb-3">
      <table class="table table-striped table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th>Donor</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in filteredDonations" :key="donation.id">
            <td>{{ donation.donorName || 'Anonymous' }}<br><small class="text-muted">{{ donation.donorEmail }}</small></td>
            <td>UGX {{ donation.amount.toLocaleString() }}</td>
            <td>{{ getMethodLabel(donation.method) }}</td>
            <td>{{ formatDate(donation.date) }}</td>
            <td><span :class="['badge', 'text-white', statusClass(donation.status)]">{{ donation.status }}</span></td>
            <td class="d-flex gap-1">
              <button class="btn btn-outline-secondary btn-sm" @click="viewDonation(donation)"><i class="fas fa-eye"></i></button>
              <button class="btn btn-outline-success btn-sm" v-if="donation.status === 'completed'" @click="sendThankYou(donation)"><i class="fas fa-envelope"></i></button>
              <button class="btn btn-outline-primary btn-sm" v-if="donation.status === 'completed'" @click="issueReceipt(donation)"><i class="fas fa-receipt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredDonations.length === 0" class="text-center p-3">No donations found.</div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'RecentDonations',
  setup() {
    const dateRange = ref('30d')
    const donations = ref([
      { id:1, donorName:'Sarah Johnson', donorEmail:'sarah@example.com', amount:50000, method:'mobile_money', date:'2024-01-15', status:'completed', notes:'Monthly donation'},
      { id:2, donorName:'Anonymous', donorEmail:'', amount:25000, method:'cash', date:'2024-01-14', status:'completed', notes:'Church collection'},
      { id:3, donorName:'Michael Brown', donorEmail:'michael@example.com', amount:100000, method:'bank_transfer', date:'2024-01-13', status:'pending', notes:'Concert sponsorship'},
      { id:4, donorName:'Emily Davis', donorEmail:'emily@example.com', amount:75000, method:'mobile_money', date:'2024-01-12', status:'completed', notes:'In memory of John Davis'}
    ])

    const filteredDonations = computed(() => donations.value) // simple, can add search and date filtering

    const getMethodLabel = (method) => ({
      'mobile_money':'Mobile Money','bank_transfer':'Bank Transfer','cash':'Cash','cheque':'Cheque','other':'Other'
    }[method] || method)

    const statusClass = (status) => ({
      completed:'bg-success', pending:'bg-warning text-dark', failed:'bg-danger'
    }[status] || 'bg-secondary')

    const formatDate = date => new Date(date).toLocaleDateString()

    const viewDonation = donation => alert('View: '+donation.donorName)
    const sendThankYou = donation => alert('Thank you email sent to '+donation.donorName)
    const issueReceipt = donation => alert('Receipt issued for '+donation.donorName)
    const exportDonations = () => alert('Exported!')

    return { dateRange, filteredDonations, getMethodLabel, statusClass, formatDate, viewDonation, sendThankYou, issueReceipt, exportDonations }
  }
}
</script>

<style scoped>
.badge { padding: 0.35em 0.65em; }
</style>
