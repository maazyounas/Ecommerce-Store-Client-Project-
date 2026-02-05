<template>
  <div class="flash-sale">
    <div class="flash-sale-header">
      <span>On Sale Now!</span>
      <button class="view-all-btn" @click="viewAll">View All</button>
    </div>

    <div class="flash-sale-cards">
      <CardFlashSale
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script>
import CardFlashSale from "./CardFlashSale.vue";

export default {
  name: "FlashSale",
  components: {
    CardFlashSale,
  },
  data() {
    return {
      products: [],
    };
  },
  async created() {
    try {
      const res = await fetch("http://localhost:5000/api/products/");
      const data = await res.json();
      this.products = data;
    } catch (error) {
      console.error("❌ Failed to load flash sale products:", error);
    }
  },
  methods: {
    viewAll() {
      this.$router.push({ name: 'FlashSaleAllProducts' }); // Change this route name as needed
    },
  },
};
</script>

<style scoped>
.flash-sale {
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  width: 100%;
  overflow: hidden;
}

.flash-sale-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
}

.flash-sale-header span {
  font-size: 1.3rem;
  font-weight: 700;
}

.view-all-btn {
  background: white;
  color: #ff6b00;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  display: none;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 107, 0, 0.2);
}

.flash-sale-cards {
  display: flex;
  flex-wrap: nowrap;
  padding: 25px;
  gap: 25px;
  overflow-x: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.flash-sale-cards::-webkit-scrollbar {
  display: none;
}


@media (max-width: 768px) {
  .flash-sale-cards {
    gap: 15px;
    padding: 20px;
  }
  .flash-sale-cards > * {
    flex: 0 0 70%;
    max-width: 70%;
  }
}

@media (max-width: 480px) {
  .view-all-btn {
    padding: 8px 18px;
    font-size: 0.9rem;
  }
  
}
</style>
