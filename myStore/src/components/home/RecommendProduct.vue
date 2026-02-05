<template>
  <div class="recommend-product">
    <div class="section-header">
      <h2>Recommended For You</h2>
      <p>Products curated just for your taste</p>
    </div>

    <div class="recommend-product-cards">
      <RecommendProductCard
        v-for="product in visibleProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="see-more" v-if="visibleCount < products.length">
      <button @click="loadMore">
        <span>See More</span>
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import RecommendProductCard from "./RecommendProductCard.vue";
import axios from "axios";

export default {
  name: "RecommendProduct",
  components: {
    RecommendProductCard,
  },
  data() {
    return {
      products: [],
      visibleCount: 8, // show first 8 initially
    };
  },
  computed: {
    visibleProducts() {
      return this.products.slice(0, this.visibleCount);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        this.products = res.data;
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    },
    loadMore() {
      this.visibleCount += 8;
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.recommend-product {
  background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  width: 100%;
  margin: 0px auto;
  padding: 30px;
  
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
}

.section-header h2::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  height: 4px;
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
  border-radius: 2px;
}

.section-header p {
  font-size: 1.1rem;
  color: #666;
  margin-top: 20px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.recommend-product-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 280px);
  gap: 24px;
  justify-content: center;
}

.see-more {
  text-align: center;
  margin-top: 40px;
}

.see-more button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 14px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.see-more button:hover {
  transform: translateY(-3px);
  gap: 15px;
}

@media (max-width: 600px) {
  .recommend-product-cards {
    grid-template-columns: repeat(auto-fill, 170px);
    gap: 16px;
  }

  .see-more button {
    width: 100%;
    justify-content: center;
  }
  .section-header h2 {
    font-size: 1.9rem;
  }
  .section-header h2::after {
    width: 300px;
  }
}
</style>
