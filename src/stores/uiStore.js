import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    notifications: [],
    sidebarOpen: false,
    modal: {
      isOpen: false,
      component: null,
      props: {}
    }
  }),

  actions: {
    setLoading(loading) {
      this.isLoading = loading
    },

    showNotification(notification) {
      const id = Date.now()
      this.notifications.push({
        id,
        ...notification,
        timeout: setTimeout(() => {
          this.removeNotification(id)
        }, 5000)
      })
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(notif => {
        if (notif.id === id) {
          clearTimeout(notif.timeout)
          return false
        }
        return true
      })
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    openModal(component, props = {}) {
      this.modal = {
        isOpen: true,
        component,
        props
      }
    },

    closeModal() {
      this.modal = {
        isOpen: false,
        component: null,
        props: {}
      }
    }
  }
})