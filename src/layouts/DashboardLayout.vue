<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="main-content" :class="{ 'sidebar-collapsed': !sidebarOpen }">
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/common/Sidebar.vue'
import { useUIStore } from '@/stores/uiStore'
import { computed } from 'vue'

export default {
  name: 'DashboardLayout',
  components: {
    Sidebar
  },
  setup() {
    const uiStore = useUIStore()
    const sidebarOpen = computed(() => uiStore.sidebarOpen)

    return {
      sidebarOpen
    }
  }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  background-color: #f8f9fa;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.content-wrapper {
  padding: 20px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>