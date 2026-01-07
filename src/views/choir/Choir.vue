<template>
  <div class="choir-management-page">
    <!-- Improved Header Section -->
    <header class="page-header bg-white border-bottom py-4 mb-4">
      <div class="container-fluid">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div class="mb-3 mb-md-0">
            <h1 class="h2 mb-1 text-dark fw-bold">
              <i class="fas fa-users text-primary me-2"></i>Choir Management
            </h1>
            <p class="text-muted mb-0">Manage choir members, roles, and attendance</p>
          </div>
          <button 
            v-if="canAddMember" 
            class="btn btn-primary px-4"
            @click="openModal()"
          >
            <i class="fas fa-plus me-2"></i>Add Member
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container-fluid">
      <!-- Enhanced Stats Cards -->
      <section class="row g-3 mb-4">
        <div class="col-6 col-md-3" v-for="(value, key) in stats" :key="key">
          <div class="card stat-card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-3">
              <i :class="getStatIcon(key)" class="stat-icon text-primary mb-2"></i>
              <h3 class="stat-value fw-bold text-dark mb-1">{{ value }}</h3>
              <p class="stat-label text-muted small mb-0 text-uppercase">
                {{ formatStatLabel(key) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Improved Filters Section -->
      <section class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-center">
            <div class="col-12 col-md-auto">
              <label class="form-label small text-muted mb-1 fw-medium">Voice Type</label>
              <select v-model="filterVoice" class="form-select">
                <option value="all">All Voices</option>
                <option v-for="voice in voiceTypes" :key="voice" :value="voice">{{ voice }}</option>
              </select>
            </div>
            
            <div class="col-12 col-md-auto">
              <label class="form-label small text-muted mb-1 fw-medium">Role</label>
              <select v-model="filterRole" class="form-select">
                <option value="all">All Roles</option>
                <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>
            
            <div class="col-12 col-md">
              <label class="form-label small text-muted mb-1 fw-medium">Search Members</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0" 
                  placeholder="Search by name or username..." 
                  v-model="searchQuery"
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Members Table with Responsive Design -->
      <section class="card border-0 shadow-sm">
        <div class="card-header bg-light border-0 py-3">
          <h3 class="card-title h6 mb-0 fw-bold text-dark">
            <i class="fas fa-list me-2 text-primary"></i>Choir Members
          </h3>
        </div>
        
        <div class="card-body p-0">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted small">Loading choir members...</p>
          </div>

          <!-- Content when not loading -->
          <template v-else>
            <!-- Empty State -->
            <div v-if="filteredMembers.length === 0" class="text-center py-5">
              <i class="fas fa-users fa-2x text-muted mb-3"></i>
              <h4 class="text-muted">No members found</h4>
              <p class="text-muted">Try adjusting your search or filters</p>
            </div>

            <!-- Members List when there are members -->
            <template v-else>
              <!-- Desktop Table -->
              <div class="table-responsive d-none d-md-block">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col" class="ps-4">Member</th>
                      <th scope="col">Voice</th>
                      <th scope="col">Role</th>
                      <th scope="col">Joined</th>
                      <th scope="col">Attendance</th>
                      <th scope="col" class="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in filteredMembers" :key="member.id" class="member-row">
                      <td class="ps-4">
                        <div class="d-flex align-items-center">
                          <div class="member-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                            <i class="fas fa-user fa-sm"></i>
                          </div>
                          <div>
                            <div class="fw-medium text-dark">{{ member.user }}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge voice-badge bg-light text-dark border">
                          {{ member.voice_type }}
                        </span>
                      </td>
                      <td>
                        <span class="badge role-badge" :class="getRoleBadgeClass(member.role)">
                          {{ member.role }}
                        </span>
                      </td>
                      <td class="text-muted small">{{ formatDate(member.joined_on) }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="attendance-bar me-2 flex-grow-1">
                            <div 
                              class="attendance-progress" 
                              :style="{ width: member.attendance_percentage + '%' }"
                              :class="getAttendanceClass(member.attendance_percentage)"
                            ></div>
                          </div>
                          <span class="attendance-percentage small fw-medium">
                            {{ member.attendance_percentage }}%
                          </span>
                        </div>
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group btn-group-sm" role="group">
                          <button 
                            class="btn btn-outline-primary" 
                            @click="editMember(member)" 
                            v-if="canEditMember(member)"
                            title="Edit member"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button 
                            class="btn btn-outline-danger" 
                            @click="deleteMember(member)" 
                            v-if="canEditMember(member)"
                            title="Delete member"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="d-md-none">
                <div class="row g-3 p-3">
                  <div v-for="member in filteredMembers" :key="member.id" class="col-12">
                    <div class="card member-card border-0 shadow-sm">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                          <div class="d-flex align-items-center">
                            <div class="member-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                              <i class="fas fa-user fa-sm"></i>
                            </div>
                            <div>
                              <h6 class="fw-bold mb-0 text-dark">{{ member.user }}</h6>
                              <small class="text-muted">Member since {{ formatDate(member.joined_on) }}</small>
                            </div>
                          </div>
                          <div class="btn-group btn-group-sm" role="group">
                            <button 
                              class="btn btn-outline-primary btn-sm" 
                              @click="editMember(member)" 
                              v-if="canEditMember(member)"
                            >
                              <i class="fas fa-edit"></i>
                            </button>
                            <button 
                              class="btn btn-outline-danger btn-sm" 
                              @click="deleteMember(member)" 
                              v-if="canEditMember(member)"
                            >
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div class="row g-2">
                          <div class="col-6">
                            <small class="text-muted d-block">Voice</small>
                            <span class="badge voice-badge bg-light text-dark border">
                              {{ member.voice_type }}
                            </span>
                          </div>
                          <div class="col-6">
                            <small class="text-muted d-block">Role</small>
                            <span class="badge role-badge" :class="getRoleBadgeClass(member.role)">
                              {{ member.role }}
                            </span>
                          </div>
                          <div class="col-12 mt-2">
                            <small class="text-muted d-block mb-1">Attendance</small>
                            <div class="d-flex align-items-center">
                              <div class="attendance-bar me-2 flex-grow-1">
                                <div 
                                  class="attendance-progress" 
                                  :style="{ width: member.attendance_percentage + '%' }"
                                  :class="getAttendanceClass(member.attendance_percentage)"
                                ></div>
                              </div>
                              <span class="attendance-percentage small fw-medium">
                                {{ member.attendance_percentage }}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </section>
    </main>

    <!-- Modal Component -->
    <ChoirMemberModal 
      v-if="showModal" 
      :member="editingMember" 
      @close="closeModal" 
      @saved="reloadMembers" 
    />
  </div>
</template>

<script>
import ChoirMemberModal from '@/components/choir/ChoirMemberModal.vue'
import { apiService } from '@/services/api'

export default {
  name: 'ChoirView',
  components: { ChoirMemberModal },
  data() {
    return {
      loading: false,
      choirMembers: [],
      stats: {},
      filterVoice: 'all',
      filterRole: 'all',
      searchQuery: '',
      showModal: false,
      editingMember: null,
      voiceTypes: ['Soprano','Alto','Tenor','Bass','Other'],
      roles: ['Member','Leader','Conductor','Instrumentalist'],
      currentUser: null,
    }
  },
  computed: {
    filteredMembers() {
      return this.choirMembers.filter(member => {
        const matchesVoice = this.filterVoice === 'all' || member.voice_type === this.filterVoice
        const matchesRole = this.filterRole === 'all' || member.role === this.filterRole
        const matchesSearch = this.searchQuery === '' || member.user.toLowerCase().includes(this.searchQuery.toLowerCase())
        return matchesVoice && matchesRole && matchesSearch
      })
    },
    canAddMember() {
      return this.currentUser?.is_staff || this.currentUser?.is_superuser
    }
  },
  async mounted() {
    await this.loadCurrentUser()
    await this.loadChoirMembers()
    await this.loadStats()
  },
  methods: {
    async loadCurrentUser() {
      try {
        const res = await apiService.auth.getCurrentUser()
        this.currentUser = res.data
      } catch (e) {
        console.error('Failed to fetch user:', e)
      }
    },
    async loadChoirMembers() {
      this.loading = true
      try {
        const res = await apiService.choir.members.list()
        this.choirMembers = res.data.results || res.data
      } catch (e) {
        console.error('Failed to load members:', e)
      } finally {
        this.loading = false
      }
    },
    async loadStats() {
      try {
        const res = await apiService.choir.members.stats()
        this.stats = {
          total_members: res.data.total_members,
          ...res.data.voice_distribution.reduce((acc, item) => {
            acc[item.voice_type] = item.count
            return acc
          }, {})
        }
      } catch (e) {
        console.error('Failed to load stats:', e)
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    },
    formatStatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    getStatIcon(key) {
      switch(key) {
        case 'total_members': return 'fas fa-users'
        case 'Soprano':
        case 'Alto':
        case 'Tenor':
        case 'Bass': return 'fas fa-microphone-alt'
        default: return 'fas fa-user'
      }
    },
    canEditMember(member) {
      return this.currentUser?.is_staff || this.currentUser?.is_superuser
    },
    getRoleBadgeClass(role) {
      const classes = {
        'Leader': 'bg-warning text-dark',
        'Conductor': 'bg-info text-white',
        'Instrumentalist': 'bg-success text-white',
        'Member': 'bg-secondary text-white'
      }
      return classes[role] || 'bg-light text-dark'
    },
    getAttendanceClass(percentage) {
      if (percentage >= 90) return 'bg-success'
      if (percentage >= 70) return 'bg-warning'
      return 'bg-danger'
    },
    openModal(member = null) {
      this.editingMember = member
      this.showModal = true
    },
    closeModal() {
      this.editingMember = null
      this.showModal = false
    },
    editMember(member) {
      this.openModal(member)
    },
    async deleteMember(member) {
      if (!confirm(`Are you sure you want to delete ${member.user}?`)) return
      try {
        await apiService.choir.members.delete(member.id)
        this.choirMembers = this.choirMembers.filter(m => m.id !== member.id)
        alert(`${member.user} deleted successfully.`)
      } catch (e) {
        console.error('Delete failed:', e)
        alert('Failed to delete member.')
      }
    },
    async reloadMembers() {
      await this.loadChoirMembers()
      await this.loadStats()
      this.closeModal()
    }
  }
}
</script>

<style scoped>
/* ... (keep all the CSS styles from the previous version) ... */

.choir-management-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 80px;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  margin-top: -1rem;
  margin-left: -1rem;
  margin-right: -1rem;
}

.stat-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.75rem;
}

.stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.member-row:hover {
  background-color: #f8f9fa;
}

.member-avatar {
  width: 40px;
  height: 40px;
  font-size: 0.875rem;
}

.voice-badge, .role-badge {
  font-size: 0.75rem;
  font-weight: 500;
}

.attendance-bar {
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  min-width: 60px;
}

.attendance-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.attendance-percentage {
  min-width: 40px;
  text-align: right;
}

.member-card {
  transition: transform 0.2s ease-in-out;
}

.member-card:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .choir-management-page {
    padding-top: 70px;
  }
  
  .page-header {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}

.container-fluid {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (max-width: 576px) {
  .container-fluid {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>