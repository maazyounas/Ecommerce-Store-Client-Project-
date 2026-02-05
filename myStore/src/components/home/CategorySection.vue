<template>
  <div class="category-section">
    <div class="category-header">
      <h2>Explore Categories</h2>
      <p>Find your favorite items by browsing through our diverse range of product categories.</p>
    </div>
    <div class="category-cards">
      <div v-for="category in categories" :key="category.id" class="category-wrapper">
        <CategoryCard
          :title="category.name"
          :image="category.image_url"
        />
        <!-- Display subcategories if they exist -->
        <div v-if="category.subcategories && category.subcategories.length > 0" class="subcategories-container">
          <div class="subcategory-chips">
            <span v-for="subcategory in category.subcategories" :key="subcategory.id" class="subcategory-chip">
              {{ subcategory.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CategoryCard from './CategoryCard.vue';

export default {
  name: "CategorySection",
  components: {
    CategoryCard
  },
  data() {
    return {
      categories: []
    };
  },
  async created() {
    try {
      const res = await axios.get("/api/categories");
      this.categories = res.data.categories || res.data; 
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }
};
</script>

<style scoped>
.category-section {
  background-color: #fff;
  width: 100%;
  margin: 0 auto;
  padding: 7rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-header {
  text-align: center;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.category-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: #1a1d2b;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.category-header h2:after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  border-radius: 2px;
}

.category-header p {
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: #5a5d70;
  margin-top: 1rem;
  line-height: 1.6;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  justify-content: center;
  gap: 2rem;
  padding: 0 1rem;
}

.category-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.subcategories-container {
  margin-top: 0.75rem;
  width: 160px;
}

.subcategory-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.subcategory-chip {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%);
  color: #ff6b00;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  border: 1px solid #ffd4b3;
  cursor: pointer;
  transition: all 0.2s ease;
}

.subcategory-chip:hover {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(255, 107, 0, 0.3);
}

@media screen and (max-width: 600px) {
  .category-cards {
    grid-template-columns: repeat(auto-fill, 130px);
    gap: 1.5rem;
  }

  .subcategories-container {
    width: 130px;
  }

  .category-header h2:after {
    width: 230px;
  }
  
  .subcategory-chip {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
}

@media screen and (max-width: 400px) {
  .category-cards {
    grid-template-columns: repeat(auto-fill, 110px);
    gap: 1rem;
  }

  .subcategories-container {
    width: 110px;
  }
}
</style>
