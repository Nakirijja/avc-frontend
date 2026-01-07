<template>
  <div class="practice-form-modal">
    <div class="modal-backdrop" @click="close"></div>
    <div class="modal-dialog">
      <div class="modal-content shadow-sm">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? "Edit Practice" : "Schedule Practice" }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input v-model="form.title" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Date & Time</label>
              <input v-model="form.date" type="datetime-local" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Duration (minutes)</label>
              <input v-model.number="form.duration" type="number" min="1" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Resource Link (optional)</label>
              <input v-model="form.resource_link" type="url" class="form-control" placeholder="https://..." />
            </div>

            <div class="mb-3">
              <label class="form-label">Sheet Music (optional)</label>
              <input type="file" @change="handleFileUpload" class="form-control" />
              <small v-if="form.sheet_music_name">{{ form.sheet_music_name }}</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select" required>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="close">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditMode ? "Update" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from "@/services/api";

export default {
  name: "PracticeForm",
  props: {
    practice: { type: Object, default: null } // For editing
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        date: "",
        duration: 60,
        resource_link: "",
        sheet_music: null,
        sheet_music_name: "",
        status: "upcoming"
      },
      isEditMode: false,
      loading: false
    };
  },
  mounted() {
    if (this.practice) this.loadPractice(this.practice);
  },
  methods: {
    loadPractice(practice) {
      this.isEditMode = true;
      this.form.title = practice.title;
      this.form.description = practice.description;
      this.form.date = practice.date?.slice(0, 16) || "";
      this.form.duration = practice.duration || 60;
      this.form.resource_link = practice.resource_link || "";
      this.form.status = practice.status || "upcoming";
      this.form.sheet_music_name = practice.sheet_music ? this.extractFileName(practice.sheet_music) : "";
    },

    extractFileName(url) {
      return url.split("/").pop();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.sheet_music = file;
        this.form.sheet_music_name = file.name;
      }
    },

    async submitForm() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("description", this.form.description);
        formData.append("date", this.form.date);
        formData.append("duration", this.form.duration);
        formData.append("resource_link", this.form.resource_link);
        formData.append("status", this.form.status);
        if (this.form.sheet_music) formData.append("sheet_music", this.form.sheet_music);

        if (this.isEditMode && this.practice?.id) {
          await apiService.virtualPractice.updatePractice(this.practice.id, formData);
        } else {
          await apiService.virtualPractice.createPractice(formData);
        }

        this.$emit("saved");
        this.close();
      } catch (error) {
        console.error("Error saving practice:", error);
        alert("Failed to save practice. Please check all fields and try again.");
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.practice-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}

.modal-backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}

.modal-dialog {
  position: relative;
  margin: 5% auto;
  max-width: 600px;
  z-index: 1051;
}

.modal-content {
  border-radius: 0.5rem;
}
</style>
