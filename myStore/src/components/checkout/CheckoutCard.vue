<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { defineProps } from 'vue';

const props = defineProps<{
  productId: number;
  quantity: number;
}>();

const product = ref<any>(null);

onMounted(async () => {
  try {
    console.log('checkout card  productid:', props.productId);
    const res = await axios.get(`http://localhost:5000/api/products/${props.productId}`);
    product.value = res.data;
  } catch (err) {
    console.error('Error fetching product:', err);
  }
});
</script>

<template>
  <div v-if="product" class="product-card">
    <img :src="product.thumbnail" alt="Product" class="product-thumbnail" />
    <div class="product-info">
      <h4>{{ product.title }}</h4>
      <p>{{ product.brand }}</p>
      <p>Stock: {{ product.stock }}</p>
      <div class="price-row">
        <span class="price">Rs. {{ product.current_price*quantity }}</span>
        <span class="original">Rs. {{ product.original_price*quantity }}</span>
      </div>
    </div>
    <p class="qty">Qty: {{ quantity }}</p>
  </div>
</template>


<style scoped>
.product-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  gap: 12px;
  transition: background 0.2s ease-in-out;
}

.product-thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.product-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.product-info .qty {
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.price-row .price {
  font-size: 1rem;
  color: #F85606;
  font-weight: 600;
}

.price-row .original {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

</style>
