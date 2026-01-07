<template>
  <div class="container py-5">
    <!-- Page Header -->
    <h1 class="mb-4">Notifications</h1>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-6 mb-2">
        <input
          v-model="search"
          @input="loadNotifications"
          type="text"
          class="form-control"
          placeholder="Search notifications..."
        >
      </div>
      <div class="col-md-6 mb-2">
        <select v-model="filterIsRead" @change="loadNotifications" class="form-select">
          <option value="">All</option>
          <option :value="true">Read</option>
          <option :value="false">Unread</option>
        </select>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="list-group">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['list-group-item', 'd-flex', 'justify-content-between', notification.is_read ? '' : 'list-group-item-warning']"
      >
        <div>
          <h6 class="mb-1">{{ notification.title }}</h6>
          <p class="mb-1">{{ notification.message }}</p>
          <small v-if="notification.link">
            <a :href="notification.link" target="_blank">View Details</a>
          </small>
          <br>
          <small class="text-muted">{{ formatDate(notification.created_at) }}</small>
        </div>
        <div class="d-flex flex-column align-items-end">
          <button
            v-if="!notification.is_read"
            @click="markAsRead(notification.id)"
            class="btn btn-sm btn-primary mb-1"
          >
            Mark as Read
          </button>
          <button
            @click="deleteNotification(notification.id)"
            class="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
      <div v-if="notifications.length === 0" class="text-center py-4">
        No notifications found.
      </div>
    </div>

    <!-- Pagination -->
    <nav aria-label="Page navigation" class="mt-3 d-flex justify-content-between align-items-center">
      <button
        class="btn btn-outline-secondary"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-outline-secondary"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >Next</button>
    </nav>

    <!-- Feedback Alerts -->
    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Notifications",
  data() {
    return {
      notifications: [],
      search: "",
      filterIsRead: "",
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async loadNotifications(page = 1) {
      try {
        const params = { page, page_size: this.pageSize };
        if (this.search) params.search = this.search;
        if (this.filterIsRead !== "") params.is_read = this.filterIsRead;

        const res = await axios.get("/api/v1/notifications/notifications/", { params });
        this.notifications = res.data.results;
        this.totalPages = Math.ceil(res.data.count / this.pageSize);
        this.currentPage = page;
      } catch (err) {
        this.errorMessage = "Failed to load notifications.";
        console.error(err);
      }
    },
    async markAsRead(id) {
      try {
        await axios.patch(`/api/v1/notifications/notifications/${id}/`, { is_read: true });
        this.successMessage = "Notification marked as read!";
        this.loadNotifications(this.currentPage);
      } catch (err) {
        this.errorMessage = "Failed to mark as read.";
        console.error(err);
      }
    },
    async deleteNotification(id) {
      if (!confirm("Are you sure you want to delete this notification?")) return;
      try {
        await axios.delete(`/api/v1/notifications/notifications/${id}/`);
        this.successMessage = "Notification deleted!";
        this.loadNotifications(this.currentPage);
      } catch (err) {
        this.errorMessage = "Failed to delete notification.";
        console.error(err);
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.loadNotifications(page);
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleString() : "-";
    },
  },
  mounted() {
    this.loadNotifications();
  },
};
</script>

<style scoped>
.list-group-item-warning {
  font-weight: 500;
}
</style>
