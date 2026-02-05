<template>
  <div class="review-container">
    <div class="review-date">
      <p class="stars">
        <i 
          v-for="n in rating" 
          :key="n" 
          class="fas fa-star"
        ></i>
      </p>
      <p class="review-time">
        <time>{{ date }}</time>
      </p>
    </div>

    <div class="user-name">
      <p class="username">{{ username }}</p>
      <p class="verify">
        <i class="fas fa-shield-alt"></i> Verified Purchase
      </p>
    </div>

    <div class="user-comment">
      <p>{{ comment }}</p>
    </div>

    <div class="user-images" v-if="images && images.length">
      <img 
        v-for="(img, index) in images" 
        :key="index" 
        :src="img" 
        :alt="'Image ' + (index + 1)" 
        @click="toggleImage(img)"
      />
    </div>

    <div v-if="selectedImage" class="preview-box" @click="toggleImage(selectedImage)">
      <img :src="selectedImage" alt="Selected" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  username: String,
  comment: String,
  rating: Number,
  date: String,
  images: Array
})

import { ref } from 'vue'

const selectedImage = ref(null)

function toggleImage(img) {
  selectedImage.value = selectedImage.value === img ? null : img
}
</script>

<style scoped>
.review-container {    
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  padding: 16px;
  transition: all 0.3s ease;
}

.review-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stars i {
  color: #FFD700;
  margin-right: 2px;
  font-size: 14px;
}

.review-time {
  color: #999;
  font-size: 12px;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.username {
  font-weight: 600;
  color: #424242;
}

.verify {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.verify i {
  margin-right: 4px;
}

.user-comment {
  color: #212121;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.user-images {
  display: flex;
  gap: 10px;
  padding-top: 10px;
  flex-wrap: wrap;
}

.user-images img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.user-images img:hover {
  transform: scale(1.08);
}

.preview-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease-in-out;
}

.preview-box img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media screen and (max-width: 600px) {
  .user-images img {
    width: 40px;
    height: 40px;
  }

  .user-comment {
    font-size: 13px;
  }
}
</style>
