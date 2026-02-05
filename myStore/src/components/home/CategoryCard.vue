<template>
  <div class="category-card" @click="goToCategory">
    <div class="image-wrapper">
      <img :src="image" :alt="title" />
    </div>
    <div class="card-content">
      <p class="title">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryCard",
  props: {
    title: String,
    image: {
      type: String,
      default: "https://placehold.co/230x200?text=No+Image"
    }
  },
  methods: {
    goToCategory() {
      this.$router.push({
        path: "/ProductListing",
        query: { category: this.title }
      });
    }
  }
};
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  width: 160px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}


.category-card:hover {
   transform: translateY(-5px);
}

.image-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
  flex-shrink: 0;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category-card:hover .image-wrapper {
  box-shadow: 0 8px 20px rgba(255, 107, 0, 0.25);
}

.category-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.card-content {
  text-align: center;
  margin-top: 1rem;
  width: 160px;
}

.title {
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  font-weight: 600;
  color: #1a1d2b;
  transition: color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.category-card:hover .title {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 600px) {
  .category-card {
    width: 130px;
  }

  .image-wrapper {
    width: 130px;
    height: 130px;
  }

  .card-content {
    width: 130px;
  }

  .title {
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .category-card {
    width: 110px;
  }

  .image-wrapper {
    width: 110px;
    height: 110px;
  }

  .card-content {
    width: 110px;
  }

  .title {
    font-size: 0.85rem;
  }
}

</style>
