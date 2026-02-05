<template>
  <Header />
  <div class="checkout-wrapper">
    <div class="left-side">
      <ShippingInfo
        :name="userInfo.name"
        :phone="userInfo.phone"
        :address="userInfo.address"
      />
      <PackageItem :productId="productid" :quantity="quantity" />
    </div>
    <div class="right-side">
      <OrderSummary
        :price="currentPrice * quantity"
        :quantity="quantity"
        :productId="productid"
      />
    </div>
  </div>
  <Footer />
</template>

<script>
import axios from "axios";
import ShippingInfo from "./ShippingInfo.vue";
import PackageItem from "./PackageItem.vue";
import OrderSummary from "./OrderSummary.vue";
import Header from "../home/Header.vue";
import Footer from "../home/Footer.vue";

export default {
  components: {
    ShippingInfo,
    PackageItem,
    OrderSummary,
    Header,
    Footer,
  },
  data() {
    return {
      userInfo: {
        name: "",
        phone: "",
        address: "",
      },
      productid: null,
      quantity: null,
      currentPrice: 0, // ✅ Added this to hold product price
    };
  },
  created() {
    this.productid = parseInt(this.$route.query.productid);
    this.quantity = parseInt(this.$route.query.quantity);

    this.fetchUserData();
    this.getProduct();
  },
  methods: {
    async fetchUserData() {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });

        const { name, phone, address } = res.data;
        this.userInfo = { name, phone, address };
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    },

    async getProduct() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${this.productid}`
        );

        const { current_price } = res.data;
        this.currentPrice = current_price; // ✅ Corrected assignment
      } catch (err) {
        console.error("Failed to fetch product data:", err);
      }
    },
  },
};
</script>


<style scoped>
.checkout-wrapper {
  width: 90%;
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  flex-wrap: wrap;
  margin: auto;
}
.left-side {
  flex: 1;
  min-width: 300px;
}
.right-side {
  width: 320px;
}
@media screen and (max-width: 768px) {
  .checkout-wrapper {
    flex-direction: column;
  }
  .right-side {
    width: 100%;
  }
}
</style>
