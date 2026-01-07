<!-- src/views/choir/Attendance.vue -->
<template>
  <div class="attendance-page">
    <div class="container-fluid pt-5">
      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-users fa-2x text-primary mb-2"></i>
              <h3>{{ stats.totalMembers }}</h3>
              <p class="text-muted mb-0">Total Members</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-user-check fa-2x text-success mb-2"></i>
              <h3>{{ stats.presentToday }}</h3>
              <p class="text-muted mb-0">Present Today</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-user-times fa-2x text-danger mb-2"></i>
              <h3>{{ stats.absentToday }}</h3>
              <p class="text-muted mb-0">Absent Today</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-chart-line fa-2x text-info mb-2"></i>
              <h3>{{ stats.attendanceRate }}%</h3>
              <p class="text-muted mb-0">Overall Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Attendance Form -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Mark Attendance - {{ currentDate }}</h5>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-secondary" @click="$router.push('/dashboard')">
                    <i class="fas fa-arrow-left me-1"></i>Dashboard
                  </button>
                  <button class="btn btn-primary" @click="markAllPresent" :disabled="loading">
                    <i class="fas fa-check-double me-1"></i>Mark All Present
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted mt-2">Loading attendance data...</p>
              </div>

              <!-- Attendance Table -->
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Voice Part</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in members" :key="member.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style="width: 35px; height: 35px; font-size: 0.8rem;">
                            {{ getUserInitial(member.user) }}
                          </div>
                          <div>
                            <strong>{{ member.user || 'Unknown' }}</strong>
                            <br>
                            <small class="text-muted">{{ member.email || 'No email' }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ member.voice_type || 'Not set' }}</span>
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ member.role || 'Member' }}</span>
                      </td>
                      <td>
                        <span class="badge" :class="getAttendanceStatus(member).class">
                          {{ getAttendanceStatus(member).text }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-success" 
                                  @click="markAttendance(member, true)"
                                  :disabled="processingAttendance[member.id]">
                            <i class="fas fa-check"></i> Present
                          </button>
                          <button class="btn btn-outline-danger" 
                                  @click="markAttendance(member, false)"
                                  :disabled="processingAttendance[member.id]">
                            <i class="fas fa-times"></i> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="!loading && members.length === 0" class="text-center py-4">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5>No choir members found</h5>
                <p class="text-muted">Add choir members to start tracking attendance</p>
                <button class="btn btn-primary" @click="refreshData">
                  <i class="fas fa-refresh me-1"></i>Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Attendance & Summary -->
        <div class="col-lg-4">
          <!-- Recent Attendance -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-history me-2"></i>Recent Attendance
              </h5>
            </div>
            <div class="card-body">
              <div v-if="recentAttendance.length === 0" class="text-center text-muted py-3">
                <i class="fas fa-clipboard-list fa-2x mb-2"></i>
                <p>No attendance records yet</p>
              </div>
              <div v-else>
                <div v-for="record in recentAttendance" :key="record.id" 
                     class="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                  <div>
                    <strong>{{ record.member }}</strong>
                    <br>
                    <small class="text-muted">{{ formatDate(record.date) }}</small>
                  </div>
                  <div class="text-end">
                    <span class="badge" :class="record.present ? 'bg-success' : 'bg-danger'">
                      {{ record.present ? 'Present' : 'Absent' }}
                    </span>
                    <br>
                    <small class="text-muted">{{ record.member_voice }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Member Statistics -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-pie me-2"></i>Voice Part Distribution
              </h5>
            </div>
            <div class="card-body">
              <div v-if="voiceDistribution.length === 0" class="text-center text-muted py-3">
                <p>No member data</p>
              </div>
              <div v-else>
                <div v-for="voice in voiceDistribution" :key="voice.type" 
                     class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                  <div>
                    <span class="badge bg-info me-2">{{ voice.type }}</span>
                    <small>{{ voice.count }} members</small>
                  </div>
                  <small class="text-muted">{{ voice.percentage }}%</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/services/api'

export default {
  name: 'AttendanceView',
  data() {
    return {
      members: [],
      recentAttendance: [],
      loading: false,
      processingAttendance: {}, // Track attendance marking per member
      stats: {
        totalMembers: 0,
        presentToday: 0,
        absentToday: 0,
        attendanceRate: 0
      }
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    voiceDistribution() {
      const distribution = {}
      this.members.forEach(member => {
        const voiceType = member.voice_type || 'Other'
        distribution[voiceType] = (distribution[voiceType] || 0) + 1
      })
      
      return Object.entries(distribution).map(([type, count]) => ({
        type,
        count,
        percentage: ((count / this.members.length) * 100).toFixed(1)
      }))
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
          this.loadRecentAttendance()
        ])
        this.calculateStats()
      } catch (error) {
        console.error('Error loading attendance data:', error)
        this.$notify({
          type: 'error',
          title: 'Loading Error',
          text: 'Failed to load attendance data. Please try again.'
        })
      } finally {
        this.loading = false
      }
    },
    
    async loadMembers() {
      try {
        const response = await apiService.choir.getMembers()
        this.members = response.data.results || response.data || []
        this.stats.totalMembers = this.members.length
      } catch (error) {
        console.error('Error loading members:', error)
        this.members = []
        throw error
      }
    },
    
    async loadRecentAttendance() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const response = await apiService.choir.getAttendance({ 
          ordering: '-date',
          page_size: 10 
        })
        this.recentAttendance = response.data.results || response.data || []
      } catch (error) {
        console.error('Error loading recent attendance:', error)
        this.recentAttendance = []
        throw error
      }
    },
    
    getAttendanceStatus(member) {
      const today = new Date().toISOString().split('T')[0]
      const todayRecord = this.recentAttendance.find(record => 
        record.member_id === member.id && record.date === today
      )
      
      if (todayRecord) {
        return todayRecord.present 
          ? { text: 'Present', class: 'bg-success' }
          : { text: 'Absent', class: 'bg-danger' }
      }
      
      return { text: 'Not Marked', class: 'bg-warning' }
    },
    
    async markAttendance(member, present) {
      this.$set(this.processingAttendance, member.id, true)
      
      try {
        const today = new Date().toISOString().split('T')[0]
        const attendanceData = {
          member: member.id,
          date: today,
          present: present,
          notes: `Marked ${present ? 'present' : 'absent'} via dashboard`
        }
        
        // Check if record exists for today
        const existingRecord = this.recentAttendance.find(record => 
          record.member_id === member.id && record.date === today
        )
        
        let response
        if (existingRecord) {
          response = await apiService.choir.updateAttendance(existingRecord.id, attendanceData)
        } else {
          response = await apiService.choir.markAttendance(attendanceData)
        }
        
        // Update local state
        if (existingRecord) {
          Object.assign(existingRecord, response.data)
        } else {
          this.recentAttendance.unshift(response.data)
        }
        
        this.calculateStats()
        
        this.$notify({
          type: 'success',
          title: 'Attendance Updated',
          text: `${member.user} marked as ${present ? 'present' : 'absent'}`
        })
        
      } catch (error) {
        console.error('Error marking attendance:', error)
        this.$notify({
          type: 'error',
          title: 'Update Failed',
          text: 'Failed to update attendance. Please try again.'
        })
      } finally {
        this.$set(this.processingAttendance, member.id, false)
      }
    },
    
    async markAllPresent() {
      if (!confirm('Mark all members as present for today?')) return
      
      try {
        const today = new Date().toISOString().split('T')[0]
        const promises = this.members.map(member => {
          const attendanceData = {
            member: member.id,
            date: today,
            present: true,
            notes: 'Marked present via bulk action'
          }
          return apiService.choir.markAttendance(attendanceData)
        })
        
        await Promise.all(promises)
        await this.loadRecentAttendance()
        this.calculateStats()
        
        this.$notify({
          type: 'success',
          title: 'Bulk Update Complete',
          text: `All ${this.members.length} members marked as present`
        })
        
      } catch (error) {
        console.error('Error in bulk attendance update:', error)
        this.$notify({
          type: 'error',
          title: 'Bulk Update Failed',
          text: 'Some attendance records failed to update. Please check individually.'
        })
      }
    },
    
    calculateStats() {
      const today = new Date().toISOString().split('T')[0]
      let presentCount = 0
      
      this.members.forEach(member => {
        const todayRecord = this.recentAttendance.find(record => 
          record.member_id === member.id && record.date === today
        )
        if (todayRecord && todayRecord.present) {
          presentCount++
        }
      })
      
      this.stats.presentToday = presentCount
      this.stats.absentToday = this.members.length - presentCount
      this.stats.attendanceRate = this.members.length > 0 
        ? Math.round((presentCount / this.members.length) * 100)
        : 0
    },
    
    getUserInitial(userString) {
      return userString ? userString.charAt(0).toUpperCase() : 'U'
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    
    async refreshData() {
      await this.loadData()
    }
  }
}
</script>

<style scoped>
.attendance-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 80px;
}

.avatar-placeholder {
  font-weight: bold;
  font-size: 0.8rem;
}

.table td {
  vertical-align: middle;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .attendance-page {
    padding-top: 70px;
  }
  
  .container-fluid {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .btn-group-sm {
    display: flex;
    flex-direction: column;
  }
  
  .btn-group-sm .btn {
    margin-bottom: 2px;
  }
}
</style>