<template>
  <div class="event-details">
    <h2>{{ event.title }}</h2>
    <p><strong>Type:</strong> {{ event.type }}</p>
    <p><strong>Status:</strong> {{ event.status }}</p>
    <p><strong>Start:</strong> {{ formatDate(event.startDate) }}</p>
    <p><strong>End:</strong> {{ formatDate(event.endDate) }}</p>
    <p><strong>Location:</strong> {{ event.location }}</p>
    <p><strong>Description:</strong> {{ event.description }}</p>

    <div v-if="event.schedule.length">
      <h3>Schedule</h3>
      <ul>
        <li v-for="(item, index) in event.schedule" :key="index">
          <strong>{{ item.time }}:</strong> {{ item.activity }} <em v-if="item.description">({{ item.description }})</em>
        </li>
      </ul>
    </div>

    <div v-if="event.additionalNotes">
      <h3>Additional Notes</h3>
      <p>{{ event.additionalNotes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  props: { event: { type: Object, required: true } },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
}
</script>

<style scoped>
.event-details {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
