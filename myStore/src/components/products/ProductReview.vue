<template>
  <div class="container">
    <!-- Rating Summary -->
    <div class="mini-container rating-summary">
      <div class="review">
        <p class="rating">
          {{ averageRating.toFixed(1) }} <span>/5</span>
        </p>
        <p class="stars">
          <i
            v-for="(icon, index) in renderStars(averageRating)"
            :key="index"
            :class="icon"
          ></i>
        </p>
        <p class="review-count">{{ totalReviews }} Reviews</p>
      </div>

      <div class="review-stars">
        <div class="five-star" v-for="star in [5, 4, 3, 2, 1]" :key="star">
          <div class="stars-combo">
            <i class="fas fa-star" v-for="n in star" :key="n"></i>
          </div>
          <div class="rating-bar-container">
            <div
              class="rating-bar"
              :style="{ width: starPercentages[star] + '%' }"
            ></div>
          </div>
          <div class="rating-count">
            <p>{{ ratingsCount[star] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sort & Filter -->
    <div class="mini-container">
      <div class="comment-header">
        <p class="section-title">Product Reviews</p>
        <div class="sort-filter">
          <label>
            <i class="fas fa-sort"></i>
            Sort:
            <select v-model="selectedSort" class="sort-select">
              <option value="high-to-low">High to Low</option>
              <option value="low-to-high">Low to High</option>
            </select>
          </label>
          <label>
            <i class="fas fa-filter"></i>
            Filter:
            <select v-model="selectedRatingFilter" class="sort-select">
              <option value="all">All</option>
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
              <option value="2">2 Star</option>
              <option value="1">1 Star</option>
            </select>
          </label>
        </div>
      </div>
    </div>

    <!-- User Reviews -->
    <UserReview
      v-for="(review, index) in filteredReviews"
      :key="index"
      :rating="review.rating"
      :username="review.user_name"
      :comment="review.comment"
      :images="review.image_urls"
    />
  </div>
</template>

<script>
import UserReview from "./UserReview.vue";
import axios from "axios";

export default {
  name: "ProductReview",
  components: { UserReview },
  data() {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingsCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      reviews: [],
      filteredReviews: [],
      selectedSort: "high-to-low",
      selectedRatingFilter: "all",
    };
  },
  computed: {
    productId() {
      return this.$route.params.id;
    },
    starPercentages() {
      const total = Object.values(this.ratingsCount).reduce((a, b) => a + b, 0);
      const percentages = {};
      for (let i = 1; i <= 5; i++) {
        percentages[i] = total ? (this.ratingsCount[i] / total) * 100 : 0;
      }
      return percentages;
    },
  },
  watch: {
    selectedRatingFilter: 'applyFilter',
    selectedSort: 'applyFilter',
  },
  mounted() {
    this.fetchReviewStats();
    this.fetchReviewDetails();
  },
  methods: {
    async fetchReviewStats() {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/reviews/detail/${this.productId}`
        );
        this.averageRating = data.averageRating;
        this.totalReviews = data.totalReviews;
        this.ratingsCount = data.starCounts;
      } catch (error) {
        console.error("Failed to fetch review stats:", error);
      }
    },
    async fetchReviewDetails() {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/reviews/productReviewDetail/${this.productId}`
        );
        this.reviews = data;
        this.filteredReviews = data;
      } catch (error) {
        console.error("Failed to fetch review details:", error);
      }
    },
    applyFilter() {
      let filtered = [...this.reviews];
      if (this.selectedRatingFilter !== "all") {
        const star = Number(this.selectedRatingFilter);
        filtered = filtered.filter(r => r.rating === star);
      }
      if (this.selectedSort === "high-to-low") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        filtered.sort((a, b) => a.rating - b.rating);
      }
      this.filteredReviews = filtered;
    },
    renderStars(rating) {
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5 ? 1 : 0;
      const empty = 5 - full - half;
      return [
        ...Array(full).fill("fas fa-star"),
        ...Array(half).fill("fas fa-star-half-alt"),
        ...Array(empty).fill("far fa-star"),
      ];
    },
  },
};
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.mini-container {
  width: 100%;
  margin-top: 20px;
}

.rating-summary {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.review {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.rating {
  font-size: 40px;
  font-weight: bold;
  color: #ff6b00;
}

.rating span {
  font-size: 20px;
  color: #757575;
}

.stars {
  font-size: 25px;
  color: #ffcc00;
  margin: 5px 0;
}

.review-count {
  font-size: 14px;
  color: #999;
}

.review-stars {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.five-star {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars-combo i {
  font-size: 14px;
  color: #ffcc00;
}

.rating-bar-container {
  flex: 1;
  background-color: #eee;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.rating-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  transition: width 0.3s ease;
}

.rating-count {
  width: 30px;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.comment-header {
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.sort-filter {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.sort-filter label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.sort-filter i {
  margin-right: 6px;
  color: #ff6b00;
}


.sort-select {
  margin-left: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 13px;
  background: #fdfdfd;
  color: #333;
  transition: border 0.3s;
}

.sort-select:focus {
  border-color: #ff6b00;
  outline: none;
}

@media screen and (max-width: 600px) {
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .sort-filter {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .sort-filter label {
    width: 100%;
    justify-content: space-between;
  }

  .sort-select {
    width: 50%;
  }
}

.comment-header p {
  font-size: 14px;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.comment-header p i {
  margin-right: 5px;
  color: #ff6b00;
}



@media screen and (max-width: 768px) {
  .mini-container {
    flex-direction: column;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .sort-select {
    width: 100%;
  }
}
</style>
