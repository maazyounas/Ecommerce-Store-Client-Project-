<template>
  <div class="product-management">
    <h2>Add New Product</h2>

    <form @submit.prevent="submitProduct" class="form">
      <input v-model="product.title" placeholder="Product Title" required />
      <input v-model="product.brand" placeholder="Brand Name" required />

      <label>Category:</label>
      <select v-model="product.category_id" @change="onCategoryChange" required>
        <option disabled value="">Select Category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <!-- Show subcategories if selected category has them -->
      <div v-if="selectedCategorySubcategories.length > 0">
        <label>Subcategory (Optional):</label>
        <select v-model="product.subcategory_id">
          <option value="">Use Main Category</option>
          <option v-for="sub in selectedCategorySubcategories" :key="sub.id" :value="sub.id">
            {{ sub.name }}
          </option>
        </select>
      </div>

      <input
        type="number"
        v-model="product.stock"
        placeholder="Stock"
        required
        min="1"
      />
      <input
        type="number"
        v-model="product.original_price"
        placeholder="Original Price (e.g. 299.99)"
        
      />

      <input
        type="number"
        v-model="product.current_price"
        placeholder="Current Price (e.g. 199.99)"
        required
      />

      <label>Thumbnail:</label>
      <input type="file" @change="handleThumbnail" accept="image/*" required />

      <label>Gallery Images:</label>
      <input
        type="file"
        multiple
        @change="handleGalleryImages"
        accept="image/*"
      />

      <label>Description:</label>
      <QuillEditor
        class="editor"
        v-model:content="product.description"
        contentType="html"
        theme="snow"
      />

      <button type="submit" :disabled="uploading">
        {{ uploading ? "Uploading..." : "Add Product" }}
      </button>
    </form>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { uploadToCloudinary } from "@/utils/cloudinary.js";
import { toast } from "vue3-toastify";

export default {
  name: "AdminAddProduct",
  components: { QuillEditor },
  data() {
    return {
      product: {
        title: "",
        brand: "",
        category_id: "",
        subcategory_id: "",
        stock: null,
        original_price: null,
        current_price: null,
        thumbnail: null,
        gallery: [],
        description: "",
      },
      categories: [],
      selectedCategorySubcategories: [],
      uploading: false,
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await fetch("http://localhost:5000/api/categories/");
        const data = await res.json();
        this.categories = data;
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    },
    onCategoryChange() {
      // Find the selected category
      const selectedCategory = this.categories.find(
        cat => cat.id === Number(this.product.category_id)
      );
      
      // Update subcategories list
      if (selectedCategory && selectedCategory.subcategories) {
        this.selectedCategorySubcategories = selectedCategory.subcategories;
      } else {
        this.selectedCategorySubcategories = [];
      }
      
      // Reset subcategory selection
      this.product.subcategory_id = "";
    },
    handleThumbnail(e) {
      this.product.thumbnail = e.target.files[0];
    },
    handleGalleryImages(e) {
      this.product.gallery = Array.from(e.target.files);
    },
    async submitProduct() {
      this.uploading = true;

      try {
        // Upload thumbnail
        const thumbnailUrl = await uploadToCloudinary(this.product.thumbnail);

        // Upload gallery
        const galleryUrls = [];
        for (const file of this.product.gallery) {
          const url = await uploadToCloudinary(file);
          galleryUrls.push(url);
        }

        const productData = {
          title: this.product.title,
          brand: this.product.brand,
          category_id: Number(this.product.subcategory_id || this.product.category_id),
          stock: Number(this.product.stock),
          original_price: Number(this.product.original_price), // ✅
          current_price: Number(this.product.current_price),
          thumbnail: thumbnailUrl,
          gallery: galleryUrls,
          description: this.product.description,
        };

        // Send to backend
        const response = await fetch("http://localhost:5000/api/products/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error("❌ Server error");

        toast.success("✅ Product added successfully!");
        this.resetForm();
      } catch (err) {
        console.error("❌ Failed to submit product:", err);
        toast.error("❌ Failed to upload or save product.");
      } finally {
        this.uploading = false;
      }
    },
    resetForm() {
      this.product = {
        title: "",
        brand: "",
        category_id: "",
        subcategory_id: "",
        stock: null,
        original_price: null,
        current_price: null,
        thumbnail: null,
        gallery: [],
        description: "",
      };
      this.selectedCategorySubcategories = [];
    },
  },
};
</script>

<style scoped>
.product-management {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.product-management h2 {
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input,
select,
.editor .ql-container {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  width: 100%;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s;
}

input:focus,
select:focus,
.editor .ql-container:focus-within {
  border-color: #ff6b00;
  outline: none;
}

label {
  font-weight: 500;
  margin-top: 10px;
  color: #333;
}

button {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  color: white;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  filter: brightness(1.1);
}

.editor {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.editor .ql-toolbar {
  border-bottom: 1px solid #eee;
  background: #fafafa;
}

.editor .ql-container {
  min-height: 160px;
  font-size: 14px;
  background: white;
}

</style>
