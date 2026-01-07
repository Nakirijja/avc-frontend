<template>
  <div
    class="modal fade"
    id="choirMemberModal"
    tabindex="-1"
    aria-labelledby="choirMemberModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="choirMemberModalLabel">
            {{ member?.username || "Choir Member Details" }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-md-4 text-center mb-3">
              <img
                v-if="member?.profile_picture"
                :src="member.profile_picture"
                alt="Profile Picture"
                class="img-fluid rounded-circle shadow-sm"
              />
              <div v-else class="placeholder rounded-circle bg-secondary p-5">
                No Image
              </div>
            </div>
            <div class="col-md-8">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <strong>Full Name:</strong> {{ member?.first_name }} {{ member?.last_name }}
                </li>
                <li class="list-group-item">
                  <strong>Email:</strong> {{ member?.email }}
                </li>
                <li class="list-group-item" v-if="member?.phone_number">
                  <strong>Phone:</strong> {{ member.phone_number }}
                </li>
                <li class="list-group-item" v-if="member?.profile?.section">
                  <strong>Section:</strong> {{ member.profile.section_display }}
                </li>
                <li class="list-group-item" v-if="member?.profile?.join_date">
                  <strong>Join Date:</strong> {{ formatDate(member.profile.join_date) }}
                </li>
                <li class="list-group-item" v-if="member?.profile?.emergency_contact">
                  <strong>Emergency Contact:</strong> {{ member.profile.emergency_contact }}
                </li>
                <li class="list-group-item" v-if="member?.profile?.bio">
                  <strong>Bio:</strong> {{ member.profile.bio }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('edit-member', member)"
          >
            Edit Member
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChoirMemberModal",
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeModal() {
      const modalEl = this.$refs.modalRef;
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }
      this.$emit("close");
    },
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.placeholder {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
}
</style>
