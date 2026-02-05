<template>
  <div class="section-card">
    <h2><i class="fas fa-star"></i> My Reviews</h2>

    <div v-if="loading">Loading...</div>
    <div v-else-if="reviews.length === 0">
      <p>You haven't reviewed any products yet.</p>
    </div>
    <div v-else>
      <div v-for="review in reviews" :key="review.id" class="review">
        <h3>{{ review.product_title }}</h3>
        <p><strong>Rating:</strong> {{ review.rating }} / 5</p>
        <p><strong>Comment:</strong> {{ review.comment }}</p>
        <div v-if="review.images.length" class="images">
          <img
            v-for="img in review.images"
            :key="img.id"
            :src="img.image_url"
            alt="Review Image"
            class="review-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyReview",
  data() {
    return {
      reviews: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      const userData = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      const userId = userData.data.user.id;
      const res = await axios.get(`http://localhost:5000/api/reviews/user/${userId}`);
      this.reviews = res.data;
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.section-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

h2 {
  font-size: 22px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2c3e50;
}

h2 i {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.review {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  margin-top: 20px;
}

.review h3 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #111827;
}

.review p {
  margin: 4px 0;
  color: #4b5563;
  font-size: 15px;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.review-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.review-img:hover {
  transform: scale(1.05);
}

/* Empty message styling */
.section-card > div:nth-child(3) {
  text-align: center;
  font-size: 16px;
  color: #6b7280;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .section-card {
    padding: 16px;
  }

  .review-img {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .review h3 {
    font-size: 16px;
  }

  .review p {
    font-size: 14px;
  }

  .review-img {
    width: 70px;
    height: 70px;
  }
}

</style>

