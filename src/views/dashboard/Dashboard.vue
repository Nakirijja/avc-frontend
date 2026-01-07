<!-- src/views/dashboard/Dashboard.vue -->
<template>
  <div class="dashboard-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-3">Loading dashboard data...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Stats Cards -->
      <div class="row mb-5">
        <div class="col-md-3 mb-3" v-for="stat in stats" :key="stat.title">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h6 class="card-title text-muted mb-2">{{ stat.title }}</h6>
                  <h3 class="mb-0">{{ stat.value }}</h3>
                  <small 
                    :class="{
                      'text-success': stat.changeType === 'positive',
                      'text-danger': stat.changeType === 'negative',
                      'text-muted': !stat.change
                    }"
                  >
                    {{ stat.change }}
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <i :class="stat.icon" class="text-primary fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions + Recent Activity -->
      <div class="row">
        <!-- Quick Actions -->
        <div class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-bolt me-2"></i>Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-sm-6 col-md-4" v-for="action in quickActions" :key="action.title">
                  <div class="quick-action-card text-center p-3 border rounded shadow-sm h-100">
                    <i :class="action.icon" class="text-primary fa-2x mb-3"></i>
                    <h6 class="fw-semibold">{{ action.title }}</h6>
                    <p class="text-muted small mb-2">{{ action.description }}</p>
                    <router-link :to="action.link" class="btn btn-sm btn-outline-primary w-100">
                      Access
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-clock me-2"></i>Recent Activity
              </h5>
            </div>
            <div class="card-body">
              <div v-if="recentActivity.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-2x mb-3"></i>
                <p>No recent activity</p>
              </div>
              <div v-else>
                <div v-for="activity in recentActivity" :key="activity.id" class="activity-item d-flex mb-3">
                  <div class="activity-icon me-3">
                    <i :class="activity.icon" class="text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 small">{{ activity.message }}</p>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
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
  name: 'DashboardView',
  data() {
    return {
      user: null,
      loading: true,
      stats: [],
      quickActions: [
        { title: 'Choir Members', description: 'Manage choir members', icon: 'fas fa-users', link: '/choir-members' },
        { title: 'Attendance', description: 'Track attendance', icon: 'fas fa-clipboard-check', link: '/attendance' },
        { title: 'Virtual Practice', description: 'Online rehearsals', icon: 'fas fa-video', link: '/virtual-practice' },
        { title: 'Events', description: 'View events', icon: 'fas fa-calendar', link: '/events' },
        { title: 'Donations', description: 'Manage donations', icon: 'fas fa-donate', link: '/donations' },
        { title: 'Gallery', description: 'Photo gallery', icon: 'fas fa-images', link: '/gallery' }
      ],
      recentActivity: []
    }
  },
  async mounted() {
    await this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      try {
        // Load real data from API
        const statsResponse = await apiService.dashboard.getStats()
        const activityResponse = await apiService.dashboard.getActivity()

        // Transform backend data to match frontend expectations
        this.stats = this.transformStatsData(statsResponse.data)
        this.recentActivity = activityResponse.data.recent_activity || []
        
      } catch (error) {
        console.error('Dashboard API Error:', error)
        this.useFallbackData()
      } finally {
        this.loading = false
      }
    },

    transformStatsData(apiData) {
      return [
        { 
          title: 'Total Members', 
          value: apiData.total_members?.toString() || '0', 
          change: `+${apiData.new_members || 0} this month`,
          changeType: 'positive',
          icon: 'fas fa-users' 
        },
        { 
          title: 'Upcoming Events', 
          value: apiData.upcoming_events?.toString() || '0', 
          change: apiData.next_event || 'Next: None',
          changeType: 'neutral',
          icon: 'fas fa-calendar' 
        },
        { 
          title: 'Donations', 
          value: `UGX ${(apiData.total_donations || 0).toLocaleString()}`,
          change: `${apiData.donation_change || '+0%'} from last month`,
          changeType: apiData.donation_change?.includes('-') ? 'negative' : 'positive',
          icon: 'fas fa-donate' 
        },
        { 
          title: 'Attendance Rate', 
          value: `${apiData.attendance_rate || '0'}%`, 
          change: `Last practice: ${apiData.last_attendance || '0%'}`,
          changeType: 'neutral',
          icon: 'fas fa-clipboard-check' 
        }
      ]
    },

    useFallbackData() {
      console.log('Using fallback data - API not available')
      this.stats = [
        { title: 'Total Members', value: '45', change: '+2 this month', changeType: 'positive', icon: 'fas fa-users' },
        { title: 'Upcoming Events', value: '3', change: 'Next: Concert', changeType: 'neutral', icon: 'fas fa-calendar' },
        { title: 'Donations', value: 'UGX 1,250,000', change: '+10% from last month', changeType: 'positive', icon: 'fas fa-donate' },
        { title: 'Attendance Rate', value: '87%', change: 'Last practice: 90%', changeType: 'neutral', icon: 'fas fa-clipboard-check' }
      ]
      this.recentActivity = [
        { id: 1, message: 'New member registered: John Doe', time: '2 hours ago', icon: 'fas fa-user-plus' },
        { id: 2, message: 'Donation received: UGX 50,000', time: 'Yesterday', icon: 'fas fa-donate' },
        { id: 3, message: 'Event created: Christmas Concert', time: '2 days ago', icon: 'fas fa-calendar' }
      ]
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Fix for navbar overlap */
.dashboard-content {
  padding-top: 80px; /* Adjust this value based on your navbar height */
}

/* Alternative: If you prefer using margin */
/* .dashboard-content {
  margin-top: 80px;
} */

.quick-action-card {
  transition: all 0.3s ease;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.activity-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-content {
    padding-top: 70px; /* Slightly less padding on mobile */
  }
}
</style>