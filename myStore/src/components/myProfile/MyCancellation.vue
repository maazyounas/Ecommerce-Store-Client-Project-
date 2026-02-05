<template>
  <div class="return-section">
    <h2 class="section-title">
      <i class="fas fa-undo-alt"></i>
      My Cancellations
    </h2>

    <div v-if="loading" class="loading">
      <span class="loader"></span> Loading your return orders...
    </div>

    <div v-else-if="returns.length === 0" class="empty-message">
      <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No returns" />
      <p>You haven’t returned any items yet.</p>
    </div>

    <div v-else>
      <ul class="return-list">
        <li v-for="order in returns" :key="order.id" class="return-card">
          <div class="order-info">
            <h3>Order #{{ order.id }}</h3>
            <p><strong>Status:</strong> {{ order.status }}</p>
            <p><strong>Payment:</strong> {{ order.payment_method }}</p>
            <p><strong>Date:</strong> {{ new Date(order.created_at).toLocaleDateString() }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyReturn",
  data() {
    return {
      returns: [],
      loading: true,
    };
  },
  async created() {
    try {
      const userData = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      const userId = userData.data.user.id;
      const response = await axios.get(`http://localhost:5000/api/orders/return/${userId}`);
      this.returns = response.data;
    } catch (error) {
      console.error("Failed to fetch return orders", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.return-section {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  max-width: 1000px;
  margin: 2rem auto;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f1f1f;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.section-title i {
  color: #ff6b00;
}

.loading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #555;
}

.loader {
  width: 16px;
  height: 16px;
  border: 3px solid #ddd;
  border-top-color: #ff6b00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-message {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

.empty-message img {
  width: 120px;
  opacity: 0.7;
  margin-bottom: 1rem;
}

.return-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.return-card {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 1.2rem;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.return-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.order-info h3 {
  margin-bottom: 0.5rem;
  color: #222;
  font-size: 1.2rem;
}

.order-info p {
  margin: 6px 0;
  color: #444;
  font-size: 0.95rem;
}
</style>
