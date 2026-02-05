<template>
  <div>
    <Header />

    <div v-if="product">
      <ProductTitleCard :product="product" />
      
      <!-- Delivery Message -->
      <div class="delivery-message">
        <i class="fas fa-box-open"></i>
        <span>📦 Open parcel on delivery to ensure product quality and completeness</span>
      </div>

      <ProductDescription :product="product" />
      <ProductReview :productId="productId" />
      <ProductQuestion :productId="productId" />
    </div>
    <div v-else class="loading-text">
      Loading product details...
    </div>

    <Footer />
  </div>
</template>


<script>
import { ref, watch, onMounted } from 'vue';
import api from '../axios/Axios';

import Header from '../home/Header.vue';
import ProductTitleCard from '../products/ProductTitleCard.vue';
import ProductDescription from '../products/ProductDescription.vue';
import ProductReview from '../products/ProductReview.vue';
import ProductQuestion from '../products/ProductQuestion.vue';
import Footer from '../home/Footer.vue';

export default {
  name: "ProductDescriptionView",
  components: {
    Header,
    ProductTitleCard,
    ProductDescription,
    ProductReview,
    ProductQuestion,
    Footer
  },
  props: {
    productId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const product = ref(null);

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/details/${props.productId}`);
        product.value = res.data;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    // Fetch when mounted
    onMounted(fetchProduct);

    // Watch for productId changes
    watch(() => props.productId, fetchProduct);

    return {
      product
    };
  }
};
</script>




<style scoped>
.loading-text {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: #555;
}

.delivery-message {
  width: 90%;
  max-width: 1400px;
  margin: 20px auto;
  padding: 16px 24px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left: 4px solid #ff9800;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
  font-family: 'Segoe UI', sans-serif;
}

.delivery-message i {
  font-size: 24px;
  color: #ff9800;
  flex-shrink: 0;
}

.delivery-message span {
  font-size: 15px;
  color: #e65100;
  font-weight: 500;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .delivery-message {
    width: 95%;
    padding: 12px 16px;
    flex-direction: column;
    text-align: center;
  }
  
  .delivery-message span {
    font-size: 14px;
  }
}
</style>
