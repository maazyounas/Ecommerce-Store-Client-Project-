<template>
  <div class="container">
    <h2>Manage Hero Images</h2>

    <form @submit.prevent="handleSubmit" class="upload-form">
      <input type="text" v-model="title" placeholder="Enter Title" required />
      <input type="text" v-model="link" placeholder="Enter Link URL" required />
      <input
        type="file"
        @change="handleFileChange"
        accept="image/*"
        :key="inputKey"
      />
      <button :disabled="loading">
        {{ loading ? "Uploading..." : "Add Hero Image" }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>

    <div class="hero-list">
      <div v-for="hero in heroImages" :key="hero.id" class="hero-card">
        <img :src="hero.image_url" :alt="hero.title" />
        <h4>{{ hero.title }}</h4>
        <a :href="hero.link" target="_blank" rel="noopener">{{ hero.link }}</a>
        <button class="delete-btn" @click="deleteHeroImage(hero.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadToCloudinary } from "@/utils/cloudinary";
import api from "../axios/Axios";

export default {
  name: "HeroView",
  data() {
    return {
      heroImages: [],
      title: "",
      link: "",
      file: null,
      loading: false,
      error: "",
      success: "",
      inputKey: Date.now(), // used to reset file input
    };
  },
  methods: {
    async fetchHeroImages() {
      try {
        const response = await api.get("/heroes", { withCredentials: true });
        this.heroImages = response.data;
      } catch (err) {
        console.error("Error fetching hero images:", err);
        this.error = "Failed to load hero images.";
      }
    },
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    async handleSubmit() {
      if (!this.file) {
        this.error = "Please select an image.";
        return;
      }

      this.loading = true;
      this.error = "";
      this.success = "";

      try {
        const imageUrl = await uploadToCloudinary(this.file);

        await api.post(
          "/heroes",
          {
            image_url: imageUrl,
            title: this.title,
            link: this.link,
          },
          {
            withCredentials: true,
          }
        );

        this.success = "Hero image added successfully!";
        this.title = "";
        this.link = "";
        this.file = null;
        this.inputKey = Date.now(); // resets file input

        await this.fetchHeroImages(); // refresh the list
      } catch (err) {
        console.error("Submission error:", err);
        this.error = "Failed to upload hero image.";
      } finally {
        this.loading = false;
      }
    },
    async deleteHeroImage(id) {
      if (!confirm("Are you sure you want to delete this hero image?")) return;

      try {
        await api.delete(`/heroes/${id}`, {
          withCredentials: true,
        });
        await this.fetchHeroImages(); // refresh after deletion
      } catch (err) {
        console.error("Deletion failed:", err);
        this.error = "Failed to delete hero image.";
      }
    },
  },
  mounted() {
    this.fetchHeroImages();
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}
h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
.upload-form input,
.upload-form button {
  padding: 0.7rem;
  font-size: 1rem;
}
.upload-form button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.upload-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.upload-form button:hover:enabled,
.delete-btn:hover {
  transform: scale(1.02);
}
.error {
  color: red;
  margin-bottom: 1rem;
}
.success {
  color: green;
  margin-bottom: 1rem;
}
.hero-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
.hero-card {
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
}
.hero-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
}
.hero-card h4 {
  margin: 0.5rem 0;
}
.hero-card a {
  display: block;
  color: #007bff;
  word-break: break-all;
  margin-bottom: 0.5rem;
}
.delete-btn {
  background-color: #dc3545;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

/* ✅ Responsive styles */
@media (max-width: 600px) {
  .upload-form {
    flex-direction: column;
  }
  .hero-card img {
    height: 130px;
  }
}
</style>
