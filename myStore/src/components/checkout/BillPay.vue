<template>
  <Header />
  <div class="billpay-container">
    <h2 class="heading">
      <i class="fas fa-receipt"></i> Payment & Billing
    </h2>

    <!-- Order Summary -->
    <div class="summary-box">
      <h3><i class="fas fa-list-ul"></i> Order Summary</h3>
      <div class="summary-row">
        <span>Items Total ({{ totalQuantity }})</span>
        <span>Rs. {{ totalWithoutShipping }}</span>
      </div>
      <div class="summary-row">
        <span>Shipping Fee</span>
        <span>Rs. 135</span>
      </div>
      <div class="summary-total">
        <span>Total</span>
        <span class="total-price">Rs. {{ total }}</span>
      </div>
    </div>

    <!-- Payment Method (Only COD) -->
    <div class="payment-methods">
      <h3><i class="fas fa-money-bill-wave"></i> Select Payment Method</h3>
      <div class="payment-option selected">
        <i class="fas fa-truck method-icon"></i>
        <span>Cash on Delivery</span>
      </div>
    </div>

    <!-- Pay Button -->
    <button class="pay-btn" @click="payNow">
      <i class="fas fa-wallet"></i> Pay Now with Cash on Delivery
    </button>
  </div>

  <!-- Congratulations Modal -->
  <div v-if="showCongrats" class="congrats-overlay" @click="closeCongrats">
    <div class="congrats-modal" @click.stop>
      <div class="congrats-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2>Congratulations! 🎉</h2>
      <p class="congrats-message">Your order has been placed successfully!</p>
      <div class="order-info">
        <p><strong>Order ID:</strong> #{{ orderId }}</p>
        <p><strong>Total:</strong> Rs. {{ total }}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
      </div>
      <p class="delivery-note">Your order will be delivered soon. Thank you for shopping with us!</p>
      <button class="congrats-btn" @click="goToHome">
        <i class="fas fa-home"></i> Continue Shopping
      </button>
    </div>
  </div>

  <Footer />
</template>

<script>
import Header from "../home/Header.vue";
import Footer from "../home/Footer.vue";
import api from "../axios/Axios.js";
import { toast } from "vue3-toastify";

export default {
  name: "BillPay",
  components: { Header, Footer },
  data() {
    return {
      total: 0,
      totalQuantity: 0,
      items: [],
      shippingFee: 135,
      showCongrats: false,
      orderId: null,
    };
  },
  computed: {
    totalWithoutShipping() {
      return this.total - this.shippingFee;
    },
  },
  created() {
    // Read query data from BasketSection
    this.total = parseFloat(this.$route.query.total || 0);
    this.totalQuantity = parseInt(this.$route.query.totalQuantity || 0);
    try {
      this.items = JSON.parse(this.$route.query.items || "[]");
      console.log("BillPay items received:", this.items);
    } catch (err) {
      console.error("Invalid items data:", err);
    }
  },
  methods: {
    async payNow() {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          toast.error("Please login first");
          this.$router.push("/login");
          return;
        }

        // Step 1: Create order
        const orderRes = await api.post("/orders/", {
          user_id: userId,
          total_amount: this.total,
          status: "pending",
          payment_method: "cash",
        });

        console.log("Order creation response:", orderRes.data);
        const orderId = orderRes.data.order?.id || orderRes.data.orderId;
        
        if (!orderId) {
          console.error("Order ID not found in response:", orderRes.data);
          toast.error("Failed to create order");
          return;
        }
        
        console.log("Order ID:", orderId);
        console.log("Items to save:", this.items);

        // Step 2: Create order items
        const itemsPayload = {
          order_id: orderId,
          items: this.items,
        };
        console.log("Sending to backend:", itemsPayload);
        
        const itemsResponse = await api.post("/order-items/", itemsPayload);
        console.log("Order items response:", itemsResponse.data);

        // Step 3: Delete cart items
        for (const item of this.items) {
          try {
            await api.delete(`/carts/${item.product_id}`);
          } catch (err) {
            console.warn(`Could not delete product ${item.product_id} from cart:`, err);
          }
        }

        // Store order ID and show congratulations modal
        this.orderId = orderId;
        this.showCongrats = true;
        toast.success("✅ Order placed successfully!");
      } catch (err) {
        console.error("Error placing order:", err);
        toast.error("❌ Something went wrong during payment.");
      }
    },
    closeCongrats() {
      this.showCongrats = false;
      this.$router.push("/");
    },
    goToHome() {
      this.showCongrats = false;
      this.$router.push("/");
    },
  },
};
</script>


<style scoped>
.billpay-container {
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  font-family: "Segoe UI", sans-serif;
}

.heading {
  font-size: 22px;
  margin-bottom: 24px;
  color: #222;
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-box {
  border: 1px solid #e0e0e0;
  padding: 18px;
  margin-bottom: 24px;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.summary-box h3 {
  font-size: 17px;
  margin-bottom: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-row,
.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 15px;
  color: #444;
}

.summary-total {
  font-weight: 600;
  font-size: 17px;
  border-top: 1px solid #ddd;
  margin-top: 10px;
  padding-top: 10px;
}

.total-price {
  color: #f85606;
}

.payment-methods {
  margin-bottom: 24px;
}

.payment-methods h3 {
  font-size: 17px;
  color: #333;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;
}

.payment-option.selected {
  background-color: #fff4ef;
  border-color: #f85606;
}

.method-icon {
  font-size: 22px;
  color: #28a745;
}

.pay-btn {
  width: 100%;
  background-color: #f85606;
  color: white;
  padding: 14px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.pay-btn:hover {
  background-color: #e04a00;
}

/* Congratulations Modal */
.congrats-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.congrats-modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 40px 30px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  position: relative;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.congrats-icon {
  font-size: 80px;
  color: #28a745;
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.congrats-modal h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 700;
}

.congrats-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.order-info {
  background: #f0f8ff;
  border-left: 4px solid #28a745;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: left;
}

.order-info p {
  margin: 8px 0;
  font-size: 15px;
  color: #333;
}

.order-info strong {
  color: #000;
  font-weight: 600;
}

.delivery-note {
  font-size: 14px;
  color: #777;
  margin: 16px 0 24px;
  line-height: 1.6;
}

.congrats-btn {
  background: linear-gradient(135deg, #f85606 0%, #ff7033 100%);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(248, 86, 6, 0.3);
}

.congrats-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 86, 6, 0.4);
}

@media (max-width: 600px) {
  .billpay-container {
    padding: 20px;
    border-radius: 12px;
  }

  .heading,
  .summary-box h3,
  .payment-methods h3 {
    font-size: 18px;
  }

  .summary-row,
  .summary-total {
    font-size: 14px;
  }

  .payment-option {
    padding: 10px;
    font-size: 15px;
  }

  .pay-btn {
    font-size: 15px;
    padding: 12px;
  }

  .congrats-modal {
    padding: 30px 20px;
  }

  .congrats-icon {
    font-size: 60px;
  }

  .congrats-modal h2 {
    font-size: 24px;
  }
}
</style>


