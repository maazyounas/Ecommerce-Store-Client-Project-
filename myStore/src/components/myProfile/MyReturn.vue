<template>
  <div class="returns-container">
    <h2 class="title">
      <i class="fas fa-undo-alt"></i> My Returns
    </h2>

    <div v-if="loading" class="loading">Loading returns...</div>

    <div v-else-if="returns.length === 0" class="empty">
      <p>You haven’t returned any items yet.</p>
    </div>

    <div v-else class="returns-grid">
      <div
        v-for="returnItem in returns"
        :key="returnItem.id"
        class="return-card"
      >
        <h3>#{{ returnItem.id }}</h3>
        <p>
  <strong>Status:</strong>
  <span :class="['status', returnItem.status.toLowerCase()]">{{ returnItem.status }}</span>
</p>

        <p><strong>Reason:</strong> {{ returnItem.reason }}</p>
        <p><strong>Requested At:</strong> {{ formatDate(returnItem.created_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../axios/Axios.js";

export default {
  name: "MyReturn",
  data() {
    return {
      returns: [],
      loading: true,
    };
  },
  methods: {
    async fetchReturns() {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("User ID not found in localStorage");
          this.returns = [];
          return;
        }
        
        const res = await api.get(`/returns/${userId}`);
        this.returns = res.data || [];
      } catch (err) {
        console.error("Failed to load returns:", err);
        this.returns = [];
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchReturns();
  },
};
</script>

<style scoped>
.returns-container {
  background-color: rgba(245, 245, 245, 0.95);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 1000px;
  margin: auto;
}

.title {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #222;
}
.title i {
  color: #ff6b00;
}


.loading,
.empty {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

.returns-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.return-card {
  border-left: 5px solid;
  border-image: linear-gradient(to bottom, #ff6b00, #ff2a00) 1;
  background: #fff;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;
}
.return-card:hover {
  transform: translateY(-3px);
}

.return-card h3 {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #444;
}

.return-card p {
  margin: 0.3rem 0;
  color: #555;
}

.status {
  font-weight: bold;
  margin-left: 5px;
}

.status.pending {
  color: #ff9800;
}

.status.approved {
  color: #28a745;
}

.status.rejected {
  color: #dc3545;
}

@media (max-width: 600px) {
  .returns-container {
    padding: 1rem;
  }

  .return-card {
    padding: 0.75rem;
  }
}

</style>
