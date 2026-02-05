<!-- ProductTitleCard.vue -->
<template>
  <div class="product-container" v-if="product">
    <div class="product-left">
      <div class="image-area">
        <div class="main-image">
          <img :src="activeImage || product.thumbnail" alt="Preview Image" />
        </div>
        <div class="thumbnail-list">
          <img
            v-for="(img, index) in sliderImages"
            :key="index"
            :src="img"
            :alt="`Preview ${index + 1}`"
            @mouseover="activeImage = img"
          />
        </div>
      </div>
    </div>

    <div class="product-details">
      <h2 class="product-title">{{ product.title }}</h2>

      <div class="rating-block">
        <p>
          <i
            v-for="star in 5"
            :key="star"
            :class="['fa-star', parseInt(averageRating) >= star ? 'fas' : 'far']"
          ></i>
        </p>
        <span class="rating-value">Rating ({{ totalReviews }})</span>
        <span class="question-count">{{ totalQuestions }} Answered Questions</span>
      </div>

      <div class="info-block brand-info">
        Brand Name: <span class="brand">{{ product.brand }}</span>
      </div>

      <div class="price-info" v-if="product.original_price > 0">
        <div class="current-price">Rs. {{ product.current_price }}</div>
        <span class="original-price">Rs. {{ product.original_price }}</span>
        <span class="discount-badge">
          -{{ calculateDiscount(product.original_price, product.current_price) }}%
        </span>
      </div>

      <div class="quantity-selector">
        <p>Quantity</p>
        <button class="qty-btn" @click="decreaseQty">-</button>
        <input type="number" v-model.number="quantity" min="1" />
        <button class="qty-btn" @click="increaseQty">+</button>
      </div>

      <div class="purchase-buttons">
        <button class="buy-btn" @click="buyNow">Buy Now</button>
        <button class="cart-btn" @click="addToCart">Add to Cart</button>
      </div>
    </div>

    <div class="product-right">
      <div class="info-section" v-for="(info, idx) in deliveryOptions" :key="idx">
        <div class="info-left">
          <p>{{ info.title }}</p>
          <p>
            <i :class="info.icon"></i>
            <span>{{ info.description }}</span>
          </p>
        </div>
        <div class="info-right">
          <a href="#">Change</a>
        </div>
      </div>

      <div class="info-section mini">
        <div class="info-left">
          <p><i class="fas fa-undo"></i><span>14 days easy return</span></p>
        </div>
        <div class="info-left">
          <p><i class="fas fa-shield-alt"></i><span>1 year warranty</span></p>
        </div>
      </div>

      <div class="info-section help-section">
        <p class="info-left">
          <i class="fas fa-info-circle"></i>
          <span>
            For more information, please visit our
            <a href="#" style="color: rgb(56, 56, 194)">Help Center</a>.
          </span>
        </p>
        <div class="info-right">
          <a href="#">Learn More</a>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-text">Loading product details...</div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "ProductTitleCard",
  data() {
    return {
      averageRating: 0,
      totalReviews: 0,
      totalQuestions: 0,
      product: null,
      sliderImages: [],
      activeImage: null,
      quantity: 1,
      deliveryOptions: [
        {
          title: "Delivery Options",
          icon: "fas fa-map-marker-alt",
          description: "Sindh, Karachi - Gulshan-e-Iqbal, Block 15",
        },
        {
          title: "Payment Options",
          icon: "fas fa-credit-card",
          description: "Cash on Delivery",
        },
        {
          title: "Standard Delivery",
          icon: "fas fa-shipping-fast",
          description: "3-5 days",
        },
      ],
    };
  },
  created() {
    this.fetchProductData();
  },
  methods: {
    async fetchProductData() {
      const productId = this.$route.params.id;
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/details/${productId}`
        );
        const data = await res.json();
        this.averageRating = data.averageRating || 0;
        this.totalReviews = data.totalReviews || 0;
        this.totalQuestions = data.totalQuestions || 0;
        this.product = data.product;
        this.sliderImages = data.images?.map((img) => img.image_url) || [];
        this.activeImage = this.sliderImages[0] || this.product.thumbnail;
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    },
    calculateDiscount(original, current) {
      if (!original || !current) return 0;
      return Math.round(((original - current) / original) * 100);
    },
    async addToCart() {
      const productId = parseInt(this.$route.params.id);
      try {
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        const userData = await userRes.json();

        if (!userRes.ok || !userData.user?.id) {
          toast.error("Please login to add products to cart.");
          this.$router.push("/login");
          return;
        }

        const userId = userData.user.id;

        const res = await fetch("http://localhost:5000/api/carts/add", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            userId,
            quantity: this.quantity,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Added to cart!");
        } else {
          toast.error(data.message || "Failed to add to cart.");
        }
      } catch (err) {
        toast.error("Server error. Try again later.");
      }
    },
    async buyNow() {
      try {
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        const userData = await userRes.json();

        if (!userRes.ok || !userData.user?.id) {
          toast.error("Please login to proceed with purchase.");
          this.$router.push("/login");
          return;
        }

        this.$router.push({
          path: "/checkOut",
          query: {
            productid: this.$route.params.id,
            quantity: this.quantity,
          },
        });
      } catch (err) {
        toast.error("Server error. Try again later.");
      }
    },
    increaseQty() {
      this.quantity++;
    },
    decreaseQty() {
      if (this.quantity > 1) this.quantity--;
    },
  },
};
</script>

<style scoped>
.product-container {
  width: 90%;
  max-width: 1400px;
  display: flex;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px auto;
}

.product-left,
.product-details,
.product-right {
  padding: 20px;
}

.product-left {
  width: 30%;
  background: #f8f8f8;
}

.image-area {
  display: flex;
  flex-direction: column;
}

.main-image {
  width: 100%;
  height: 400px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.main-image img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
}

.thumbnail-list img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid transparent;
  object-fit: cover;
  cursor: pointer;
  transition: 0.3s;
}

.thumbnail-list img:hover {
  transform: scale(1.05);
  border-color: #ff6b00;
}

.product-details {
  width: 40%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
}

.rating-block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0;
}

.rating-block i {
  color: #ffd700;
}

.rating-value {
  color: #ff6b00;
  font-weight: 500;
}

.question-count {
  color: #757575;
}

.info-block {
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.brand {
  font-weight: 600;
  color: #ff6b00;
}

.price-info {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b00;
}

.original-price {
  text-decoration: line-through;
  color: #757575;
  font-size: 16px;
}

.discount-badge {
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.qty-btn:hover {
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
  color: white;
}

.quantity-selector input {
  width: 60px;
  height: 36px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.purchase-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.buy-btn,
.cart-btn {
  flex: 1;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
}

.buy-btn {
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
}

.cart-btn {
  background: linear-gradient(135deg, #333, #111);
}

.buy-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #ff5a00, #e02200);
}

.cart-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #444, #222);
}

.product-right {
  width: 30%;
  background: #fafafa;
}

.info-section {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 20px;
}

.info-left {
  flex: 1;
}

.info-left p {
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
}

.info-left p:first-child {
  font-weight: 600;
}

.info-left i {
  color: #ff6b00;
  font-size: 18px;
}

.info-right a {
  color: #ff6b00;
  font-weight: 600;
}

.info-right a:hover {
  color: #ff2a00;
  text-decoration: underline;
}

.mini {
  flex-direction: column;
  gap: 10px;
}

.loading-text {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

@media screen and (max-width: 1024px) {
  .product-container {
    flex-direction: column;
  }

  .product-left,
  .product-details,
  .product-right {
    width: 100%;
  }

  .main-image {
    height: 300px;
  }
}

@media screen and (max-width: 768px) {
  .thumbnail-list img {
    width: 60px;
    height: 60px;
  }

  .purchase-buttons {
    flex-direction: column;
  }

  .info-section {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
