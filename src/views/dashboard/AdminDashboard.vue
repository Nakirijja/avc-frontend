<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1>Admin Dashboard</h1>
      <p>Manage your choir system efficiently</p>
    </div>

    <div class="admin-content">
      <!-- Admin Stats -->
      <div class="admin-stats">
        <StatsCard 
          title="Total Members"
          :value="adminStats.totalMembers"
          icon="fas fa-users"
          color="#3498db"
          :trend="12"
        />
        <StatsCard 
          title="Monthly Donations"
          :value="adminStats.monthlyDonations"
          icon="fas fa-donate"
          color="#2ecc71"
          prefix="UGX "
          :trend="8"
        />
        <StatsCard 
          title="Events This Month"
          :value="adminStats.monthlyEvents"
          icon="fas fa-calendar"
          color="#e74c3c"
          :trend="15"
        />
        <StatsCard 
          title="Attendance Rate"
          :value="adminStats.attendanceRate"
          icon="fas fa-clipboard-check"
          color="#f39c12"
          suffix="%"
          :trend="5"
        />
      </div>

      <!-- Quick Actions -->
      <div class="admin-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card" @click="navigateTo('members')">
            <div class="action-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <h3>Add Member</h3>
            <p>Register new choir members</p>
          </div>
          <div class="action-card" @click="navigateTo('events')">
            <div class="action-icon">
              <i class="fas fa-calendar-plus"></i>
            </div>
            <h3>Create Event</h3>
            <p>Schedule new events</p>
          </div>
          <div class="action-card" @click="navigateTo('reports')">
            <div class="action-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <h3>View Reports</h3>
            <p>Generate system reports</p>
          </div>
          <div class="action-card" @click="navigateTo('settings')">
            <div class="action-icon">
              <i class="fas fa-cog"></i>
            </div>
            <h3>System Settings</h3>
            <p>Configure system preferences</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="admin-sections">
        <div class="recent-section">
          <div class="section-header">
            <h2>Recent Members</h2>
            <router-link to="/dashboard/choir-members" class="view-all">View All</router-link>
          </div>
          <div class="members-list">
            <div v-for="member in recentMembers" :key="member.id" class="member-item">
              <img :src="member.avatar" :alt="member.name" class="member-avatar">
              <div class="member-info">
                <h4>{{ member.name }}</h4>
                <p>{{ member.voicePart }} • Joined {{ member.joinDate }}</p>
              </div>
              <div class="member-status" :class="member.status">
                {{ member.status }}
              </div>
            </div>
          </div>
        </div>

        <div class="recent-section">
          <div class="section-header">
            <h2>Recent Donations</h2>
            <router-link to="/dashboard/recent-donations" class="view-all">View All</router-link>
          </div>
          <div class="donations-list">
            <div v-for="donation in recentDonations" :key="donation.id" class="donation-item">
              <div class="donor-info">
                <h4>{{ donation.donor }}</h4>
                <p>{{ donation.date }} • {{ donation.method }}</p>
              </div>
              <div class="donation-amount">
                UGX {{ donation.amount.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Alerts -->
      <div class="alerts-section">
        <h2>System Alerts</h2>
        <div class="alerts-list">
          <div v-for="alert in systemAlerts" :key="alert.id" class="alert-item" :class="alert.type">
            <div class="alert-icon">
              <i :class="alert.icon"></i>
            </div>
            <div class="alert-content">
              <h4>{{ alert.title }}</h4>
              <p>{{ alert.message }}</p>
            </div>
            <div class="alert-time">{{ alert.time }}</div>
            <button class="alert-action" @click="handleAlert(alert)">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatsCard from '@/views/dashboard/StatsCard.vue'

export default {
  name: 'AdminDashboard',
  components: {
    StatsCard
  },
  setup() {
    const router = useRouter()

    const adminStats = ref({
      totalMembers: 156,
      monthlyDonations: 1250000,
      monthlyEvents: 8,
      attendanceRate: 85
    })

    const recentMembers = ref([
      {
        id: 1,
        name: 'Sarah Johnson',
        voicePart: 'Soprano',
        joinDate: '2 days ago',
        avatar: '/assets/images/avatars/sarah.jpg',
        status: 'active'
      },
      {
        id: 2,
        name: 'Michael Brown',
        voicePart: 'Tenor',
        joinDate: '1 week ago',
        avatar: '/assets/images/avatars/michael.jpg',
        status: 'pending'
      },
      {
        id: 3,
        name: 'Emily Davis',
        voicePart: 'Alto',
        joinDate: '2 weeks ago',
        avatar: '/assets/images/avatars/emily.jpg',
        status: 'active'
      }
    ])

    const recentDonations = ref([
      {
        id: 1,
        donor: 'John Smith',
        amount: 50000,
        date: 'Today',
        method: 'Mobile Money'
      },
      {
        id: 2,
        donor: 'Anonymous',
        amount: 25000,
        date: 'Yesterday',
        method: 'Cash'
      },
      {
        id: 3,
        donor: 'Sarah Johnson',
        amount: 100000,
        date: '3 days ago',
        method: 'Bank Transfer'
      }
    ])

    const systemAlerts = ref([
      {
        id: 1,
        type: 'warning',
        icon: 'fas fa-exclamation-triangle',
        title: 'Low Attendance',
        message: 'Last practice had only 60% attendance',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'info',
        icon: 'fas fa-info-circle',
        title: 'New Member Application',
        message: '3 new members awaiting approval',
        time: '1 day ago'
      },
      {
        id: 3,
        type: 'success',
        icon: 'fas fa-check-circle',
        title: 'Donation Received',
        message: 'Large donation received from corporate sponsor',
        time: '2 days ago'
      }
    ])

    const navigateTo = (section) => {
      const routes = {
        members: '/dashboard/choir-members',
        events: '/events',
        reports: '/dashboard/reports',
        settings: '/dashboard/settings'
      }
      router.push(routes[section])
    }

    const handleAlert = (alert) => {
      console.log('Handling alert:', alert)
      // Implement alert handling logic
    }

    onMounted(() => {
      // Fetch admin data
    })

    return {
      adminStats,
      recentMembers,
      recentDonations,
      systemAlerts,
      navigateTo,
      handleAlert
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem 0;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.admin-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.admin-actions {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.admin-actions h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  border-color: #3498db;
}

.action-card:hover .action-icon {
  background: rgba(255, 255, 255, 0.2);
}

.action-card:hover h3,
.action-card:hover p {
  color: white;
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  transition: background 0.3s ease;
}

.action-card h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.action-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.admin-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.recent-section {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
}

.view-all {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.members-list,
.donations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-item,
.donation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.member-info {
  flex: 1;
}

.member-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.member-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.member-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.member-status.active {
  background: #d4edda;
  color: #155724;
}

.member-status.pending {
  background: #fff3cd;
  color: #856404;
}

.donor-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.donor-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.donation-amount {
  font-weight: bold;
  color: #2ecc71;
}

.alerts-section {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.alerts-section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.warning {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.alert-item.info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.alert-item.success {
  background: #d4edda;
  border-left-color: #28a745;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.alert-item.warning .alert-icon {
  background: #ffc107;
  color: white;
}

.alert-item.info .alert-icon {
  background: #17a2b8;
  color: white;
}

.alert-item.success .alert-icon {
  background: #28a745;
  color: white;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.alert-content p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.alert-time {
  color: #95a5a6;
  font-size: 0.8rem;
}

.alert-action {
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.alert-action:hover {
  color: #2c3e50;
  background: rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .admin-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-stats {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .member-item,
  .donation-item,
  .alert-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}
</style>