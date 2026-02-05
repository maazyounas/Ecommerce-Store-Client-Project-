<template>
    <Header />
    <Hero />
    
    <FlashSale />
   
    <CategorySection />
    
    <RecommendProduct  />
    <Footer />

</template>

<script>
import CategorySection from '../home/CategorySection.vue';
import FlashSale from '../home/FlashSale.vue';
import Header from '../home/Header.vue';
import Hero from '../home/Hero.vue';
import RecommendProduct from '../home/RecommendProduct.vue';
import Footer from '../home/Footer.vue';

export default {
    name: "HomeView",
    components: {
        Header,
        Hero,
        FlashSale,
        CategorySection,
        RecommendProduct,
        Footer

    }
}
</script>
<style scoped>

</style>
