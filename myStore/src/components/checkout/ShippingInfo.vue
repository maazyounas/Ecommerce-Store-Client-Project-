<template>
  <div class="shipping-info">
    <div class="info-header">
      <h4>Shipping & Billing</h4>
      <span class="edit">EDIT</span>
    </div>
    <p class="name">{{ name }} &nbsp; <span class="phone">{{ phone }}</span></p>
    <p class="home-badge">🏠 HOME</p>
    <p class="address">{{ address }}</p>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    phone: String,
    address: String,
  },
};
</script>


<style scoped>
.shipping-info {
  background-color: #fff;
  padding: 16px;
  font-size: 14px;
  color: #333;
  border: 1px solid #ddd;
}
.info-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.edit {
  color: #2196f3;
  cursor: pointer;
  font-size: 12px;
}
.name {
  font-weight: 600;
}
.phone {
  color: #555;
}
.home-badge {
  display: inline-block;
  background-color: #f44336;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 6px 0;
}
.address {
  color: #666;
}
</style>
