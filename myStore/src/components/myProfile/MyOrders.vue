<template>
  <div class="orders">
    <h2 class="title">
      <i class="fas fa-shopping-bag"></i> My Orders
    </h2>

    <div v-if="loading" class="loading">
      <div class="spinner-large"></div>
      <p>Loading your orders...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <i class="fas fa-box-open"></i>
      <h3>No Orders Yet</h3>
      <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
    </div>

    <div v-else v-for="order in orders" :key="order.id" class="order-card">
      <div class="order-header">
        <span><strong>Order ID:</strong> {{ order.id }}</span>
        <span class="status" :class="order.status.toLowerCase()">{{ order.status }}</span>
      </div>

      <div class="order-details">
        <p><strong>Date:</strong> {{ formatDate(order.created_at) }}</p>
        <p><strong>Total Amount:</strong> Rs. {{ order.total_amount }}</p>
        <p><strong>Items:</strong> {{ order.items?.length || 0 }}</p>
        
        <div v-if="!order.items || order.items.length === 0" class="no-items-message">
          <i class="fas fa-box"></i>
          <p>No items found for this order</p>
        </div>
        
        <div v-else class="items-list">
          <div v-for="item in order.items" :key="item.product_id" class="item-row">
            <img 
              :src="item.image || 'https://placehold.co/80x80?text=No+Image'" 
              :alt="item.name"
              class="item-image"
            />
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-brand" v-if="item.brand">{{ item.brand }}</p>
              <p class="item-qty">Qty: {{ item.quantity }} × Rs. {{ item.price }}</p>
              <p class="item-total">Subtotal: Rs. {{ item.quantity * item.price }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="order-actions">
        <button v-if="!['shipped', 'delivered', 'cancelled'].includes(order.status)" @click="cancelOrder(order.id)" class="cancel-btn">Cancel Order</button>

        <button v-if="order.status === 'delivered'" @click="openReviewModal(order)" class="review-btn">Add Review</button>

        <!-- 🆕 Return Button -->
        <button v-if="order.status === 'delivered'" @click="openReturnModal(order)" class="return-btn">Request Return</button>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReview" class="modal">
      <div class="modal-content">
        <h3>Add Review</h3>
        <label>Rating:
          <select v-model="review.rating">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <label>Comment:
          <textarea v-model="review.comment"></textarea>
        </label>
        <input type="file" @change="handleImageUpload" multiple />
        <button :disabled="isSubmitting" @click="submitReview">
          <span v-if="isSubmitting"><span class="spinner"></span>Submitting...</span>
          <span v-else>Submit</span>
        </button>
        <button @click="closeReviewModal">Close</button>
      </div>
    </div>

    <!-- 🆕 Return Modal -->
    <div v-if="showReturn" class="modal">
      <div class="modal-content">
        <h3>Request Return</h3>
        <label>Reason for return:
          <textarea v-model="returnReason" placeholder="Enter your reason..."></textarea>
        </label>
<button :disabled="isSubmitting" @click="submitReturn">
  <span v-if="isSubmitting">
    <span class="spinner"></span> Submitting...
  </span>
  <span v-else>Submit Return</span>
</button>
        <button @click="closeReturnModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../axios/Axios.js";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "vue3-toastify";

export default {
  name: "MyOrders",
  data() {
    return {
      orders: [],
      loading: true,
      showReview: false,
      showReturn: false, // 🆕
      currentOrder: null,
      isSubmitting: false,
      review: {
        rating: 5,
        comment: "",
        images: [],
      },
      returnReason: "", // 🆕
    };
  },

  async mounted() {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("User ID not found");
        this.orders = [];
        return;
      }
      
      const res = await api.get(`/orders/${userId}`);
      console.log("Orders response:", res.data);
      this.orders = res.data || [];
    } catch (err) {
      console.error("Failed to load orders:", err);
      this.orders = [];
    } finally {
      this.loading = false;
    }
  },

  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },

    async cancelOrder(orderId) {
      try {
        await api.put(`/orders/${orderId}`);
        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = "cancelled";
          toast.success("Order cancelled successfully");
        }
      } catch (err) {
        console.error("Cancel order error:", err);
        toast.error(err.response?.data?.error || "Cancel failed");
      }
    },

    openReviewModal(order) {
      this.currentOrder = order;
      this.review = { rating: 5, comment: "", images: [] };
      this.showReview = true;
    },

    closeReviewModal() {
      this.showReview = false;
    },

    handleImageUpload(event) {
      this.review.images = Array.from(event.target.files);
    },

    async submitReturn() {
      this.isSubmitting = true;
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          toast.error("User not found. Please login again.");
          return;
        }

        await api.post("/returns", {
          orderId: this.currentOrder.id,
          userId: userId,
          reason: this.returnReason,
          status: "pending",
        });

        toast.success("Return request submitted.");

        // Reset fields
        this.returnReason = "";
        this.currentOrder = null;

        // Close the modal
        setTimeout(() => {
          this.showReturn = false;
        }, 500);
      } catch (err) {
        console.error("Return request failed:", err);
        toast.error("Return request failed.");
      } finally {
        this.isSubmitting = false;
      }
    },

    // 🆕 Return Logic
    openReturnModal(order) {
      this.currentOrder = order;
      this.returnReason = "";
      this.showReturn = true;
    },

    closeReturnModal() {
      this.showReturn = false;
    },

  },
};
</script>


<style scoped>
.orders {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: "Segoe UI", sans-serif;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title i {
  color: #f57224;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f57224;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f9f9f9;
  border-radius: 12px;
  margin-top: 20px;
}

.empty-state i {
  font-size: 64px;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  max-width: 400px;
  margin: 0 auto;
}

.order-card {
  background-color: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s;
}

.order-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
}

.status.pending {
  background-color: #ffc107;
  color: #212529;
}

.status.shipped {
  background-color: #17a2b8;
  color: white;
}

.status.delivered {
  background-color: #28a745;
  color: white;
}

.status.cancelled {
  background-color: #dc3545;
  color: white;
}

.order-details p,
.order-details li {
  font-size: 15px;
  color: #333;
}

.items-list {
  margin-top: 16px;
  border-top: 1px solid #e8e8e8;
  padding-top: 16px;
}

.item-row {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: background 0.2s;
}

.item-row:hover {
  background: #f0f0f0;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.item-brand {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.item-qty {
  font-size: 14px;
  color: #555;
  margin: 0;
}

.item-total {
  font-size: 14px;
  font-weight: 600;
  color: #f57224;
  margin: 0;
}

.no-items-message {
  text-align: center;
  padding: 30px;
  color: #999;
  background: #f9f9f9;
  border-radius: 8px;
  margin-top: 16px;
}

.no-items-message i {
  font-size: 32px;
  margin-bottom: 10px;
  display: block;
}

.no-items-message p {
  margin: 0;
  font-size: 14px;
}

.order-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cancel-btn,
.review-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.cancel-btn {
  background-color: #dc3545;
  color: #fff;
}
.cancel-btn:hover {
  background-color: #c82333;
}

.review-btn {
  background-color: #28a745;
  color: #fff;
}
.review-btn:hover {
  background-color: #218838;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  padding: 25px 30px;
  width: 100%;
  max-width: 480px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-bottom: 15px;
  font-size: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 8px 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.modal-content textarea {
  resize: vertical;
  height: 80px;
}

.modal-content input[type="file"] {
  margin-top: 10px;
  width: 100%;
}

.modal-content button {
  margin-top: 15px;
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;
}

.modal-content button:first-of-type {
  background-color: #007bff;
  color: white;
}
.modal-content button:first-of-type:hover {
  background-color: #0056b3;
}

.modal-content button:last-of-type {
  background-color: #6c757d;
  color: white;
}
.modal-content button:last-of-type:hover {
  background-color: #5a6268;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ✅ Responsive Styles */
@media (max-width: 600px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .cancel-btn,
  .review-btn {
    width: 100%;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-content button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}

</style>
