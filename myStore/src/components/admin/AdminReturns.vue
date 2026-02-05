<template>
  <div class="returns-container">
    <h2 class="returns-title">All Return Requests</h2>

    <div class="table-wrapper">
      <table class="returns-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ret in returns" :key="ret.id">
            <td>{{ ret.id }}</td>
            <td>{{ ret.order_id }}</td>
            <td>{{ ret.user_id }}</td>
            <td>{{ ret.reason }}</td>
            <td>
              <span
                :class="{
                  status: true,
                  approved: ret.status === 'approved',
                  rejected: ret.status === 'rejected',
                  pending: ret.status === 'pending',
                }"
              >
                {{ ret.status }}
              </span>
            </td>
            <td>
              <select v-model="ret.status" @change="updateStatus(ret)">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '../axios/Axios';
export default {
  name: 'AdminReturns',
  data() {
    return {
      returns: [],
    };
  },
  methods: {
    async fetchReturns() {
      try {
        const res = await api.get('/returns', {
          withCredentials: true,
        });
        this.returns = res.data;
      } catch (err) {
        console.error('Error fetching returns:', err);
      }
    },
    async updateStatus(ret) {
      try {
        await api.put(
          `/returns/${ret.id}`,
          { status: ret.status },
          {
            withCredentials: true,
          }
        );
        alert('Status updated successfully');
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update status');
      }
    },
  },
  mounted() {
    this.fetchReturns();
  },
};
</script>

<style scoped>
.returns-container {
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
}

.returns-title {
  font-size: 24px;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.returns-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.returns-table th,
.returns-table td {
  padding: 14px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.returns-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #333;
}

.returns-table select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.2s;
}

.returns-table select:focus {
  border-color: #ff6b00;
}

.status {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
  display: inline-block;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status.approved {
  background-color: #d4edda;
  color: #155724;
}

.status.rejected {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
