<template>
  <div
    class="card-flash-sale"
    v-if="product"
    @click="
      $router.push({
        name: 'ProductDescriptionView',
        params: { id: product.id },
      })
    "
  >
    <img
      :src="product.thumbnail || fallbackImage"
      :alt="product.title || 'Product image'"
    />

    <div class="card-content">
      <p class="title">{{ truncatedTitle }}</p>

      <p class="current-price">Rs. {{ product.current_price }}</p>

      <p class="original-price" v-if="product.original_price > 0">
        Rs. {{ product.original_price }}
        <span class="discount" v-if="product.discount">
          -{{ product.discount }}%
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardFlashSale",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fallbackImage:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    };
  },
  computed: {
  truncatedTitle() {
    if (!this.product.title) return "";
    const maxLength = 20; // limit to 20 characters
    return this.product.title.length > maxLength
      ? this.product.title.slice(0, maxLength) + "..."
      : this.product.title;
  }
}

};
</script>

<style scoped>
.card-flash-sale {
  flex: 0 0 auto;
  width: 230px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(255, 107, 107, 0.1);
}

.card-flash-sale:hover {
  transform: translateY(-10px) scale(1.03);
}

.card-flash-sale img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-flash-sale:hover img {
  transform: scale(1.1);
}

.card-content {
  padding: 15px;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.current-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f85606;
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
}

.discount {
  font-size: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 3px 8px;
  border-radius: 9px;
  font-weight: 700;
}
</style>
