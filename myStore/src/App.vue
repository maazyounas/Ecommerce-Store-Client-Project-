<script setup>
import Hero from "@/components/home/Hero.vue";
import FlashSale from "./components/home/FlashSale.vue";
import CategorySection from "./components/home/CategorySection.vue";
import RecommendProduct from "./components/home/RecommendProduct.vue";
import Header from "./components/home/Header.vue";
</script>

<template>
 <!-- <Header />
  <Hero />
  <h1 class="text-center text-2xl font-bold my-4">Flash Sale</h1>
  <FlashSale />
  <h1 class="text-center text-2xl font-bold my-4">Categories</h1>
  <CategorySection />
  <h1 class="text-center text-2xl font-bold my-4">Recommended Products</h1>
  <RecommendProduct />
  -->
<router-view :key="$route.fullPath" />
</template>


<style scoped>
body{
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #EFF0F5;
}
h1{
  width: 90%;
  margin: auto;
  color:#424242;
  font-size: 22px;
  padding-top: 10px ;
  margin-top: 10px;
}
@media screen and (max-width: 600px) {
  h1 {
    font-size: 20px;
  }
  
}
</style>
