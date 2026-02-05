<template>
  <div class="orders-container">
    <h2>All Orders</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <table class="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.user_id }}</td>
            <td>Rs. {{ order.total_amount }}</td>
            <td>{{ order.status }}</td>
            <td>{{ order.payment_method }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>
              <select v-model="order.status" @change="updateStatus(order)">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../axios/Axios";

export default {
  name: "AdminOrders",
  data() {
    return {
      orders: [],
      loading: false,
    };
  },
  methods: {
    async fetchOrders() {
      try {
        this.loading = true;
        const res = await api.get("/orders");
        this.orders = res.data.orders;
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        alert("Error fetching orders.");
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(order) {
      try {
        await api.put(`/orders/${order.id}/status`, {
          status: order.status,
        });
        alert(`Order #${order.id} status updated to "${order.status}".`);
      } catch (err) {
        console.error("Status update failed:", err);
        alert("Failed to update order status.");
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.orders-container {
  padding: 20px;
  max-width: 100%;
  overflow-x: auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.orders-table th,
.orders-table td {
  padding: 12px 10px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
}

.orders-table th {
  background-color: #f2f2f2;
  color: #333;
}

.orders-table select {
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
}

.loading {
  text-align: center;
  font-weight: bold;
  padding: 20px;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .orders-table {
    font-size: 12px;
  }

  .orders-table th,
  .orders-table td {
    padding: 8px;
  }

  .orders-table select {
    font-size: 12px;
  }
}
</style>
