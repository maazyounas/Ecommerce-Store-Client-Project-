<template>
  <div class="section-card">
    <h2><i class="fas fa-heart"></i> My Wishlist</h2>
    <p>You haven’t added any products to your wishlist yet.</p>
  </div>
</template>

<script>
export default {
  name: "MyWishlist",
};
</script>

<style scoped>
.section-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);
}
h2 {
  font-size: 22px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2c3e50;
}
h2 i{
  color: #ff6b00;
}
p {
  color: #757575;
}
</style>
