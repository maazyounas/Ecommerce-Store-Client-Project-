<template>
  <div class="description-container">
    <div v-if="product" v-html="product.description" class="description-content"></div>
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ProductDescription",
  data() {
    return {
      product: null,
    };
  },
  created() {
    const productId = this.$route.params.id;
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then((res) => {
        this.product = res.data;
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  },
};
</script>

<style scoped>
.description-container {
  width: 90%;
  max-width: 1400px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
}

.description-content h1,
.description-content h2,
.description-content h3 {
  color: #ff6b00;
  margin-top: 20px;
  margin-bottom: 10px;
}

.description-content p {
  margin: 10px 0;
  font-size: 16px;
  color: #444;
}

.description-content ul,
.description-content ol {
  padding-left: 20px;
  margin: 10px 0;
}

.description-content li {
  margin-bottom: 8px;
}

.description-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.description-content strong {
  color: #222;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #757575;
}
</style>
