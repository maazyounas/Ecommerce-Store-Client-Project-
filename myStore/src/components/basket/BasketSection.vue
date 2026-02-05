<template>
  <Header />
  <div class="container">
    <!-- LEFT SECTION -->
    <div class="container-left">
      <div class="container-left-top">
        <!-- ✅ Select All -->
        <input type="checkbox" v-model="selectAll" @change="toggleAllSelection" />
        <label>Select All ({{ selectedItems.length }} item(s))</label> <!-- ✅ Show selected count -->

        <!-- ✅ Delete Selected -->
        <button @click="deleteSelectedItems">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>

      <!-- ✅ Product Cards -->
      <div class="container-left-card">
        <BasketCard
          v-for="item in cartItems"
          :key="item.productId"
          :item="item"
          :selected="selectedItems.includes(item.productId)"
          @item-removed="removeFromCart"
          @quantity-updated="updateLocalQuantity"
          @toggle-selection="toggleItemSelection"
          class="card"
        />
      </div>
    </div>

    <!-- RIGHT SECTION -->
    <div class="container-right">
      <!-- ✅ User Address -->
      <div class="location">
        <p class="location-title">
          <i class="fas fa-map-marker-alt"></i>
          {{ userAddress || 'Add Shipping Address' }}
        </p>
      </div>

      <hr class="divider" />

      <!-- ✅ Order Summary -->
      <div class="summary">
        <h3 class="summary-title">Order Summary</h3>

        <div class="summary-row">
          <span>Subtotal ({{ totalQuantity }} item{{ totalQuantity > 1 ? 's' : '' }})</span>
          <span>Rs. {{ subtotal }}</span>
        </div>

        <div class="summary-row">
          <span>Delivery Charges</span>
          <span>Rs. 135</span>
        </div>

        <hr />

        <div class="summary-total">
          <strong>Total</strong>
          <strong class="total-amount">Rs. {{ subtotal + 135 }}</strong>
        </div>

        <button class="checkout-btn" @click="proceedToCheckout">
          PROCEED TO CHECKOUT ({{ totalQuantity }})
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "../home/Header.vue";
import Footer from "../home/Footer.vue";
import BasketCard from "./BasketCard.vue";

export default {
  name: "CardSection",
  components: {
    Header,
    Footer,
    BasketCard,
  },
  data() {
    return {
      cartItems: [],
      selectedItems: [], // ✅ Track selected product IDs
      selectAll: false, // ✅ Select all checkbox
      userAddress: "", // ✅ Fetched from /users/address
    };
  },
  computed: {
    subtotal() {
      return this.cartItems
        .filter((item) => this.selectedItems.includes(item.productId))
        .reduce((total, item) => total + item.currentPrice, 0);
    },
    totalQuantity() {
      return this.cartItems
        .filter((item) => this.selectedItems.includes(item.productId))
        .reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    async fetchCartItems() {
      try {
        const res = await fetch("http://localhost:5000/api/carts/getproduct", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        this.cartItems = data;
        this.selectedItems = data.map((item) => item.productId); // ✅ All selected by default
        this.selectAll = true;
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    },
    proceedToCheckout() {
      this.$router.push({
  path: '/Payment',
  query: {
    total: this.subtotal + 135,
    items: JSON.stringify(
      this.cartItems
        .filter((item) => this.selectedItems.includes(item.productId))
        .map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.currentPrice,
        }))
    ),
    totalQuantity: this.totalQuantity,
  }
});

    },
    async fetchUserAddress() {
      try {
        const res = await fetch("http://localhost:5000/api/users/address", {
          credentials: "include",
        });
        const data = await res.json();
        this.userAddress = data.address;
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    },
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
      this.selectedItems = this.selectedItems.filter((id) => id !== productId);
    },
    updateLocalQuantity({ productId, newQuantity }) {
      const item = this.cartItems.find((i) => i.productId === productId);
      if (item) {
        const unitPrice = item.currentPrice / item.quantity;
        item.quantity = newQuantity;
        item.currentPrice = unitPrice * newQuantity;
      }
    },
    toggleAllSelection() {
      if (this.selectAll) {
        this.selectedItems = this.cartItems.map((item) => item.productId);
      } else {
        this.selectedItems = [];
      }
    },
    toggleItemSelection(productId) {
      if (this.selectedItems.includes(productId)) {
        this.selectedItems = this.selectedItems.filter((id) => id !== productId);
      } else {
        this.selectedItems.push(productId);
      }

      this.selectAll = this.selectedItems.length === this.cartItems.length;
    },
    async deleteSelectedItems() {
      const promises = this.selectedItems.map(async (id) => {
        await fetch(`http://localhost:5000/api/carts/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
      });

      await Promise.all(promises);
      this.cartItems = this.cartItems.filter((item) => !this.selectedItems.includes(item.productId));
      this.selectedItems = [];
      this.selectAll = false;
    },
  },
  mounted() {
    this.fetchCartItems();
    this.fetchUserAddress();
  },
};
</script>



<style scoped>
* {
  box-sizing: border-box;
}
.card{
  background-color: #ffffff;
}
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.container {
  display: flex;
  flex-direction: column; /* Mobile: column layout */
  width: 90%;
  padding: 10px;
  background-color: #f4f4f4;
  gap: 10px;
  margin: auto;
}

/* Left Section */
.container-left {
  width: 100%;
}

.container-left-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 12px;
  color: #757575;
  flex-wrap: wrap;
  gap: 10px;
}

.container-left-top input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #f85606;
  transform: scale(1.2);
}

.container-left-top label {
  font-size: 14px;
}

.container-left-top button {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #757575;
  cursor: pointer;
}

/* Cards */
.container-left-card {
  width: 100%;
}

.card {
  margin-bottom: 10px;
  background-color: #fff;
  width: 100%;
}

/* Right Section */
.container-right {
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 380px;
}

.location-title {
  font-size: 14px;
  color: #757575;
  padding-bottom: 10px;
}

.location-title i {
  color: #f85606;
  margin-right: 5px;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 10px 0;
  padding: 0;
}

.summary h4 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #212121;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 10px 0;
  margin-bottom: 8px;
  color: #212121;
}

.voucher {
  display: flex;
  flex-direction: column; /* Mobile: stack input & button */
  gap: 10px;
  margin: 10px 0;
}

.voucher input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  width: 100%;
}

.apply-btn {
  background-color: #2196f3;
  color: #fff;
  border: none;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-weight: bold;
  padding: 10px 0;
}

.total-amount {
  color: #f85606;
}

.checkout-btn {
  width: 100%;
  background-color: #f85606;
  color: #fff;
  border: none;
  padding: 12px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

/* ✅ Desktop View */
@media screen and (min-width: 768px) {
  .container {
    flex-direction: row;
  }

  .container-left {
    width: 70%;
  }

  .container-right {
    width: 30%;
  }

  .voucher {
    flex-direction: row;
    align-items: center;
  }

  .apply-btn {
    width: auto;
    margin-left: 5px;
  }
}


</style>
