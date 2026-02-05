<template>
  <div class="hero-container">
    <a v-if="currentHero.link" :href="currentHero.link" class="hero-link">
      <img
        :key="currentIndex"
        class="hero-image"
        :src="currentHero.image_url"
        :srcset="`${currentHero.image_url} 1x, ${currentHero.image_url} 2x`"
        :alt="currentHero.title"
      />
    </a>
    <img
      v-else
      class="hero-image"
      :src="currentHero.image_url"
      :srcset="`${currentHero.image_url} 1x, ${currentHero.image_url} 2x`"
      :alt="currentHero.title"
    />

    <!-- Navigation buttons -->
    <button class="hero-btn prev-btn" @click="prevImage">
      ‹
    </button>
    <button class="hero-btn next-btn" @click="nextImage">
      ›
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Hero",
  data() {
    return {
      heroes: [],
      currentIndex: 0,
      intervalId: null,
    };
  },
  mounted() {
    this.fetchHeroes();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    async fetchHeroes() {
      try {
        const res = await axios.get("http://localhost:5000/api/heroes");
        this.heroes = res.data;
        if (this.heroes.length > 0) {
          this.startSlider();
        }
      } catch (err) {
        console.error("Failed to fetch hero images:", err);
      }
    },
    startSlider() {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.heroes.length;
      }, 3000);
    },
    prevImage() {
      this.currentIndex =
        (this.currentIndex - 1 + this.heroes.length) % this.heroes.length;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.heroes.length;
    },
  },
  computed: {
    currentHero() {
      return this.heroes[this.currentIndex] || {};
    },
  },
};
</script>

<style scoped>
    
    .hero-container {
      position: relative;
      width: 100%;
      height: 70vh;
      overflow: hidden;
    }
    
    .hero-link, .hero-image-wrapper {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .hero-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: opacity 0.8s ease;
      border-radius: inherit;
      background-color: #0a0a1a;
    }
    
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.8s ease;
    }
    
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
    }
    
    .hero-link:hover .hero-image {
      transform: scale(1.03);
    }
    
    .hero-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
      border: none;
      font-size: 2.5rem;
      padding: 0.8rem 1.2rem;
      cursor: pointer;
      z-index: 10;
      border-radius: 50%;
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .hero-btn:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-50%) scale(1.1);
    }
    
    .prev-btn {
      left: 20px;
    }
    
    .next-btn {
      right: 20px;
    }
    
    .image-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;
      z-index: 5;
      text-align: center;
    }
    
    .image-info h3 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    
    .image-info p {
      font-size: 1.1rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
    }
    
    
    /* Responsive tweaks */
    @media (max-width: 1024px) {
      .hero-container {
        height: 60vh;
      }
      
      .hero-btn {
        font-size: 2rem;
        width: 50px;
        height: 50px;
      }
      
      
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .container {
        padding: 1.5rem;
      }
      
      .hero-container {
        height: 50vh;
        border-radius: 12px;
      }
      
      .hero-btn {
        font-size: 1.8rem;
        width: 45px;
        height: 45px;
      }
      
     
    }
    
    @media (max-width: 480px) {
      .hero-container {
        height: 40vh;
        border-radius: 10px;
      }
      
      .hero-btn {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
        padding: 0.5rem;
      }
      
      .image-info {
        padding: 1rem;
      }
      
    }
  </style>