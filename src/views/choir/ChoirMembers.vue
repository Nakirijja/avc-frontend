<!-- src/views/choir/ChoirMembers.vue -->
<template>
  <div class="choir-members-page">
    <div class="container-fluid pt-5">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-3">Loading choir members...</p>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="fas fa-users fa-2x text-primary mb-2"></i>
                <h3>{{ stats.total_members || 0 }}</h3>
                <p class="text-muted mb-0">Total Members</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="fas fa-user-check fa-2x text-success mb-2"></i>
                <h3>{{ activeMembersCount }}</h3>
                <p class="text-muted mb-0">Active Members</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="fas fa-music fa-2x text-info mb-2"></i>
                <h3>{{ voicePartsCount.Soprano || 0 }}</h3>
                <p class="text-muted mb-0">Soprano</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="fas fa-microphone fa-2x text-warning mb-2"></i>
                <h3>{{ voicePartsCount.Alto || 0 }}</h3>
                <p class="text-muted mb-0">Alto</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="fas fa-users me-2"></i>Member Directory
                <span class="badge bg-primary ms-2">{{ filteredMembers.length }}</span>
              </h5>
              <div class="d-flex gap-2">
                <button class="btn btn-primary" @click="showAddMemberModal = true">
                  <i class="fas fa-plus me-1"></i>Add Member
                </button>
                <button class="btn btn-outline-secondary" @click="refreshData">
                  <i class="fas fa-refresh me-1"></i>Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by name or email..." 
                  v-model="searchQuery"
                >
              </div>
              <div class="col-md-3">
                <select class="form-select" v-model="filterVoice">
                  <option value="">All Voice Parts</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Tenor">Tenor</option>
                  <option value="Bass">Bass</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" v-model="filterRole">
                  <option value="">All Roles</option>
                  <option value="Member">Member</option>
                  <option value="Leader">Leader</option>
                  <option value="Conductor">Conductor</option>
                </select>
              </div>
              <div class="col-md-2">
                <select class="form-select" v-model="filterStatus">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Members Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Member</th>
                    <th>Voice Part</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Attendance Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in filteredMembers" :key="member.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style="width: 40px; height: 40px;">
                          {{ getUserInitial(member.user) }}
                        </div>
                        <div>
                          <strong class="d-block">{{ member.user || 'Unknown' }}</strong>
                          <small class="text-muted">{{ member.email || 'No email' }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge bg-info">{{ member.voice_type || 'Not set' }}</span>
                    </td>
                    <td>
                      <span class="badge" :class="getRoleBadgeClass(member.role)">
                        {{ member.role || 'Member' }}
                      </span>
                    </td>
                    <td>
                      <span class="text-nowrap">
                        {{ formatDate(member.joined_on) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2" style="height: 6px;">
                          <div class="progress-bar" 
                               :class="getAttendanceRateClass(member.attendance_percentage)"
                               :style="{ width: member.attendance_percentage + '%' }">
                          </div>
                        </div>
                        <small>{{ member.attendance_percentage || 0 }}%</small>
                      </div>
                    </td>
                    <td>
                      <span class="badge" :class="member.is_active ? 'bg-success' : 'bg-danger'">
                        <i class="fas fa-circle me-1" style="font-size: 0.5rem;"></i>
                        {{ member.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" 
                                @click="viewMemberProfile(member)"
                                title="View Profile">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-secondary" 
                                @click="editMember(member)"
                                title="Edit Member">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" 
                                @click="viewAttendance(member)"
                                title="View Attendance">
                          <i class="fas fa-clipboard-check"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-if="filteredMembers.length === 0 && !loading" class="text-center py-5">
              <i class="fas fa-users fa-3x text-muted mb-3"></i>
              <h5>No members found</h5>
              <p class="text-muted">Try adjusting your search criteria or add new members</p>
              <button class="btn btn-primary" @click="showAddMemberModal = true">
                <i class="fas fa-plus me-1"></i>Add First Member
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.totalPages > 1" class="d-flex justify-content-between align-items-center p-3 border-top">
              <div class="text-muted">
                Showing {{ pagination.startIndex }}-{{ pagination.endIndex }} of {{ pagination.totalItems }} members
              </div>
              <nav>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                    <button class="page-link" @click="changePage(pagination.currentPage - 1)">
                      Previous
                    </button>
                  </li>
                  <li v-for="page in pagination.pages" :key="page" 
                      class="page-item" :class="{ active: page === pagination.currentPage }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                    <button class="page-link" @click="changePage(pagination.currentPage + 1)">
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Member Modal (Placeholder for future implementation) -->
    <div v-if="showAddMemberModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Member</h5>
            <button type="button" class="btn-close" @click="showAddMemberModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Member addition functionality will be implemented here.</p>
            <p class="text-muted">This would connect to your backend to create new choir members.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddMemberModal = false">Close</button>
            <button type="button" class="btn btn-primary" disabled>Add Member</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/api'

export default {
  name: 'ChoirMembersView',
  data() {
    return {
      members: [],
      stats: {},
      loading: false,
      searchQuery: '',
      filterVoice: '',
      filterRole: '',
      filterStatus: '',
      showAddMemberModal: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        startIndex: 0,
        endIndex: 0,
        pages: []
      }
    }
  },
  computed: {
    activeMembersCount() {
      return this.members.filter(m => m.is_active).length
    },
    voicePartsCount() {
      const counts = {}
      this.members.forEach(member => {
        if (member.voice_type) {
          counts[member.voice_type] = (counts[member.voice_type] || 0) + 1
        }
      })
      return counts
    },
    filteredMembers() {
      let filtered = this.members
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(member => 
          (member.user && member.user.toLowerCase().includes(query)) ||
          (member.email && member.email.toLowerCase().includes(query)) ||
          (member.voice_type && member.voice_type.toLowerCase().includes(query))
        )
      }
      
      // Voice type filter
      if (this.filterVoice) {
        filtered = filtered.filter(member => member.voice_type === this.filterVoice)
      }
      
      // Role filter
      if (this.filterRole) {
        filtered = filtered.filter(member => member.role === this.filterRole)
      }
      
      // Status filter
      if (this.filterStatus) {
        const isActive = this.filterStatus === 'active'
        filtered = filtered.filter(member => member.is_active === isActive)
      }
      
      // Update pagination
      this.updatePagination(filtered.length)
      
      // Apply pagination
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = start + this.pagination.pageSize
      return filtered.slice(start, end)
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        await Promise.all([
          this.loadMembers(),
          this.loadMemberStats()
        ])
      } catch (error) {
        console.error('Error loading choir data:', error)
        this.$notify({
          type: 'error',
          title: 'Loading Error',
          text: 'Failed to load choir members data. Please try again.'
        })
      } finally {
        this.loading = false
      }
    },
    
    async loadMembers() {
      try {
        const response = await apiService.choir.getMembers()
        // Handle both paginated and non-paginated responses
        this.members = response.data.results || response.data || []
        
        // If response has pagination info, use it
        if (response.data.count !== undefined) {
          this.pagination.totalItems = response.data.count
        } else {
          this.pagination.totalItems = this.members.length
        }
        
      } catch (error) {
        console.error('Error loading members:', error)
        // Fallback mock data for demo
        this.members = [
          {
            id: 1,
            user: 'john.doe',
            email: 'john@avc.com',
            voice_type: 'Soprano',
            role: 'Member',
            joined_on: '2024-01-15',
            is_active: true,
            attendance_percentage: 85
          },
          {
            id: 2,
            user: 'jane.smith',
            email: 'jane@avc.com',
            voice_type: 'Alto',
            role: 'Leader',
            joined_on: '2023-11-20',
            is_active: true,
            attendance_percentage: 92
          },
          {
            id: 3,
            user: 'mike.johnson',
            email: 'mike@avc.com',
            voice_type: 'Tenor',
            role: 'Member',
            joined_on: '2024-02-10',
            is_active: false,
            attendance_percentage: 45
          }
        ]
        this.pagination.totalItems = this.members.length
        throw error
      }
    },
    
    async loadMemberStats() {
      try {
        const response = await apiService.choir.getMemberStats()
        this.stats = response.data
      } catch (error) {
        console.error('Error loading member stats:', error)
        // Use computed stats as fallback
        this.stats = {
          total_members: this.members.length,
          voice_distribution: this.voicePartsCount
        }
      }
    },
    
    updatePagination(totalItems) {
      this.pagination.totalItems = totalItems
      this.pagination.totalPages = Math.ceil(totalItems / this.pagination.pageSize)
      this.pagination.startIndex = Math.min(((this.pagination.currentPage - 1) * this.pagination.pageSize) + 1, totalItems)
      this.pagination.endIndex = Math.min(this.pagination.currentPage * this.pagination.pageSize, totalItems)
      
      // Generate page numbers
      const pages = []
      const maxVisiblePages = 5
      let startPage = Math.max(1, this.pagination.currentPage - Math.floor(maxVisiblePages / 2))
      let endPage = Math.min(this.pagination.totalPages, startPage + maxVisiblePages - 1)
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      this.pagination.pages = pages
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.currentPage = page
      }
    },
    
    getUserInitial(userString) {
      return userString ? userString.charAt(0).toUpperCase() : 'U'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    getRoleBadgeClass(role) {
      const roleClasses = {
        'Leader': 'bg-warning text-dark',
        'Conductor': 'bg-danger',
        'Member': 'bg-secondary'
      }
      return roleClasses[role] || 'bg-secondary'
    },
    
    getAttendanceRateClass(percentage) {
      if (percentage >= 80) return 'bg-success'
      if (percentage >= 60) return 'bg-warning'
      return 'bg-danger'
    },
    
    viewMemberProfile(member) {
      this.$notify({
        type: 'info',
        title: 'View Profile',
        text: `Viewing profile for ${member.user}`
      })
      // Navigate to member profile page
      this.$router.push(`/choir/members/${member.id}`)
    },
    
    editMember(member) {
      this.$notify({
        type: 'info',
        title: 'Edit Member',
        text: `Editing ${member.user}`
      })
      // Implement edit functionality
    },
    
    viewAttendance(member) {
      this.$notify({
        type: 'info',
        title: 'View Attendance',
        text: `Viewing attendance for ${member.user}`
      })
      this.$router.push(`/attendance?member=${member.id}`)
    },
    
    async refreshData() {
      await this.loadData()
      this.$notify({
        type: 'success',
        title: 'Data Refreshed',
        text: 'Choir members data has been updated'
      })
    }
  }
}
</script>

<style scoped>
.choir-members-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 80px;
}

.avatar-placeholder {
  font-weight: bold;
}

.table th {
  border-top: none;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress {
  min-width: 80px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .choir-members-page {
    padding-top: 70px;
  }
  
  .container-fluid {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .btn-group-sm .btn {
    margin-bottom: 2px;
  }
}
</style>