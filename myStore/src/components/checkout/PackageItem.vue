<script setup lang="ts">
import CheckoutCard from './CheckoutCard.vue'

// Define props
defineProps<{
  productId: number
  quantity: number
}>()
</script>

<template>
  <div class="package">
    <h4>Package 1 of 1</h4>
    <div class="delivery-option">
      <i class="fas fa-map-marker-alt"></i>
      <span>Rs. 160</span>
      <div>
        <p>Standard Delivery</p>
        <p class="guaranteed">Guaranteed by 12-16 Jul</p>
      </div>
    </div>

    <!-- Pass props to child -->
    <CheckoutCard :productId="productId" :quantity="quantity" />
  </div>
</template>

<style scoped>
.package {
  background-color: #fff;
  padding: 16px;
  margin-top: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
}
.delivery-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #2196f3;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}
.delivery-option i {
  color: #2196f3;
  margin-top: 3px;
}
.guaranteed {
  font-size: 12px;
  color: gray;
}
</style>
