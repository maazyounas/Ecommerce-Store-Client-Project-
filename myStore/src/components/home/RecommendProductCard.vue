<template>
  <div
    class="card-flash-sale"
    @click="$router.push({ name: 'ProductDescriptionView', params: { id: product.id } })"
    v-if="product"
  >
    <img :src="product.thumbnail || fallbackImage" :alt="product.title" />
    <div class="card-content">
  <div class="title-row">
    <p class="title">{{ product.title }}</p>
  </div>

  <div class="price-row">
    
    <p class="original-price" v-if="product.original_price > 0">
      Rs. {{ product.original_price }}
    </p>
    <p class="current-price">Rs. {{ product.current_price }}</p>
  </div>

  <p class="category">{{ product.category }}</p>
</div>

  </div>
</template>

<script>
export default {
  name: "RecommendProductCard",
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
};
</script>

<style scoped>
.card-flash-sale {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 106, 0, 0.15);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 380px;
  position: relative;
}

.card-flash-sale:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 35px rgba(255, 106, 0, 0.2);
  background: linear-gradient(0deg, #fff, #fffbe6);
}

.card-flash-sale img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #f2f2f2;
  flex-shrink: 0;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.title-row {
  display: flex;
  justify-content: flex-start;
  min-height: 48px;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1d2b;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ff4500;
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
}

.category {
   text-align: center;
  font-size: 0.9rem;
  padding: 6px 12px;
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
  border-radius: 12px;
  color: white;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .card-flash-sale {
    width: 170px;
    height: 300px;
  }

  .card-flash-sale img {
    height: 140px;
  }

  .card-content {
    padding: 12px;
    gap: 8px;
  }

  .title {
    font-size: 0.9rem;
  }

  .title-row {
    min-height: 40px;
  }

  .current-price {
    font-size: 1rem;
  }

  .original-price {
    font-size: 0.85rem;
  }

  .category {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style>
