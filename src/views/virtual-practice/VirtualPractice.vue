<template>
  <div class="virtual-practice-page">
    <div class="container-fluid pt-5">
      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-calendar-check fa-2x text-primary mb-2"></i>
              <h3>{{ stats.upcomingPractices || 0 }}</h3>
              <p class="text-muted mb-0">Upcoming Practices</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-users fa-2x text-success mb-2"></i>
              <h3>{{ stats.totalAttendance || 0 }}</h3>
              <p class="text-muted mb-0">Total Attendance</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-clock fa-2x text-info mb-2"></i>
              <h3>{{ stats.averageAttendance || 0 }}%</h3>
              <p class="text-muted mb-0">Avg Attendance Rate</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-music fa-2x text-warning mb-2"></i>
              <h3>{{ stats.completedPractices || 0 }}</h3>
              <p class="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Upcoming Practices -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="fas fa-calendar me-2"></i>Upcoming Practice Sessions
              </h5>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm" @click="refreshPractices">
                  <i class="fas fa-refresh me-1"></i>Refresh
                </button>
                <button class="btn btn-primary btn-sm" v-if="isAdmin" @click="createPractice">
                  <i class="fas fa-plus me-1"></i>Schedule Practice
                </button>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted mt-2">Loading practice sessions...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="upcomingPractices.length === 0" class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5>No upcoming practices scheduled</h5>
                <p class="text-muted">Check back later or schedule a new practice session</p>
                <button class="btn btn-primary mt-2" v-if="isAdmin" @click="createPractice">
                  <i class="fas fa-plus me-2"></i>Schedule First Practice
                </button>
              </div>

              <!-- Practices List -->
              <div v-else class="list-group">
                <div v-for="practice in upcomingPractices" :key="practice.id" 
                     class="list-group-item list-group-item-action border-0 mb-2 rounded shadow-sm">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-2">
                        <h6 class="mb-0 text-primary">{{ practice.title }}</h6>
                        <span class="badge ms-2" :class="getPracticeStatusClass(practice.status)">
                          {{ practice.status }}
                        </span>
                      </div>
                      <p class="mb-2 text-muted small">
                        <i class="fas fa-clock me-1"></i>
                        {{ formatDateTime(practice.date) }}
                      </p>
                      <p class="mb-2 small">{{ practice.description }}</p>
                      <div class="d-flex gap-3 text-muted small">
                        <span><i class="fas fa-users me-1"></i> {{ practice.total_attendees || 0 }} attending</span>
                        <span v-if="practice.duration">
                          <i class="fas fa-hourglass me-1"></i> {{ formatDuration(practice.duration) }}
                        </span>
                        <span v-if="practice.is_user_attending" class="text-success">
                          <i class="fas fa-check-circle me-1"></i> You're attending
                        </span>
                      </div>
                    </div>
                    <div class="d-flex flex-column gap-2 ms-3">
                      <button class="btn btn-primary btn-sm" 
                              @click="joinPractice(practice)"
                              :disabled="!practice.resource_link">
                        <i class="fas fa-video me-1"></i>
                        {{ practice.resource_link ? 'Join' : 'No Link' }}
                      </button>
                      <button class="btn btn-outline-success btn-sm" 
                              @click="markAttendance(practice)"
                              :disabled="practice.is_user_attending">
                        <i class="fas fa-user-check me-1"></i>
                        {{ practice.is_user_attending ? 'Attending' : 'Mark Attendance' }}
                      </button>
                      <button class="btn btn-outline-secondary btn-sm" @click="viewPracticeDetails(practice)">
                        <i class="fas fa-info-circle me-1"></i>Details
                      </button>
                      <button v-if="isAdmin" class="btn btn-outline-warning btn-sm" @click="editPractice(practice)">
                        <i class="fas fa-edit me-1"></i>Edit
                      </button>
                    </div>
                  </div>

                  <!-- Practice Resources -->
                  <div v-if="practice.sheet_music" class="mt-3 pt-3 border-top">
                    <h6 class="small text-muted mb-2">Practice Resources:</h6>
                    <div class="d-flex gap-2">
                      <a :href="practice.sheet_music" class="btn btn-outline-info btn-sm" target="_blank">
                        <i class="fas fa-music me-1"></i>Sheet Music
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Tools & Attendance -->
        <div class="col-lg-4">
          <!-- Recent Attendance -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0"><i class="fas fa-user-check me-2"></i>Recent Attendance</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" 
                    v-for="att in recentAttendance" :key="att.id">
                  <span>{{ att.member.username }}</span>
                  <span class="text-muted small">{{ formatDateTime(att.timestamp) }}</span>
                </li>
                <li v-if="recentAttendance.length === 0" class="list-group-item text-center text-muted small">
                  No recent attendance found
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Practice Form Modal -->
    <PracticeForm v-if="showPracticeForm" @close="showPracticeForm = false" @saved="refreshPractices"/>
  </div>
</template>

<script>
import PracticeForm from "./PracticeForm.vue";
import { apiService } from "@/services/api";

export default {
  name: "VirtualPractice",
  components: { PracticeForm },
  data() {
    return {
      loading: false,
      upcomingPractices: [],
      completedPractices: [],
      recentAttendance: [],
      isAdmin: false,
      showPracticeForm: false,
      stats: {}
    };
  },
  mounted() {
    this.initializePage();
  },
  methods: {
    async initializePage() {
      await this.checkAdminStatus();
      this.refreshPractices();
      this.loadRecentAttendance();
    },

    async refreshPractices() {
      this.loading = true;
      try {
        const response = await apiService.virtualPractice.getPractices();
        const practices = response.data.results || response.data;

        this.upcomingPractices = practices.filter(p => p.status === "upcoming");
        this.completedPractices = practices.filter(p => p.status === "completed");

        // Compute basic stats
        this.stats.upcomingPractices = this.upcomingPractices.length;
        this.stats.completedPractices = this.completedPractices.length;
      } catch (error) {
        console.error("Error loading practices:", error);
        this.upcomingPractices = [];
        this.completedPractices = [];
      } finally {
        this.loading = false;
      }
    },

    async loadRecentAttendance() {
      try {
        const response = await apiService.virtualPractice.getRecentAttendance();
        this.recentAttendance = response.data.results || [];
        this.stats.totalAttendance = this.recentAttendance.length;
      } catch (error) {
        console.error("Error loading recent attendance:", error);
        this.recentAttendance = [];
      }
    },

    async checkAdminStatus() {
      const user = apiService.auth.getCurrentUser();
      this.isAdmin = user?.role && ["admin", "choirmaster"].includes(user.role);
    },

    async markAttendance(practice) {
      try {
        await apiService.virtualPractice.markAttendance(practice.id);
        practice.is_user_attending = true;
        practice.total_attendees = (practice.total_attendees || 0) + 1;
        this.loadRecentAttendance();
      } catch (error) {
        console.error("Error marking attendance:", error);
        alert("Unable to mark attendance. Please login or try again.");
      }
    },

    joinPractice(practice) {
      if (practice.resource_link) window.open(practice.resource_link, "_blank");
      else alert("No video link available for this practice.");
    },

    viewPracticeDetails(practice) {
      alert(`Practice Details:\nTitle: ${practice.title}\nDescription: ${practice.description}`);
    },

    createPractice() {
      this.showPracticeForm = true;
      this.$emit("edit-practice", null);
    },

    editPractice(practice) {
      this.showPracticeForm = true;
      this.$emit("edit-practice", practice);
    },

    formatDateTime(dateTimeStr) {
      return new Date(dateTimeStr).toLocaleString();
    },

    formatDuration(minutes) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs ? hrs + "h " : ""}${mins}m`;
    },

    getPracticeStatusClass(status) {
      switch (status) {
        case "upcoming": return "badge bg-primary";
        case "completed": return "badge bg-success";
        case "cancelled": return "badge bg-danger";
        default: return "badge bg-secondary";
      }
    }
  }
};
</script>

<style scoped>
.virtual-practice-page {
  padding-top: 2rem;
}
.card-header {
  font-weight: 600;
}
.badge {
  text-transform: capitalize;
}
.list-group-item {
  cursor: default;
}
</style>
