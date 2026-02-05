<template>
  <div class="product-form-container">
    <h2 class="form-title">Update Product</h2>

    <form @submit.prevent="updateProduct" class="form-grid">
      <div class="form-group">
        <label>Title</label>
        <input v-model="product.title" type="text" required />
      </div>

      <div class="form-group">
        <label>Brand</label>
        <input v-model="product.brand" type="text" required />
      </div>

      <div class="form-group">
        <label>Stock</label>
        <input v-model.number="product.stock" type="number" required />
      </div>

      <div class="form-group">
        <label>Original Price</label>
        <input v-model.number="product.original_price" type="number" required />
      </div>

      <div class="form-group">
        <label>Current Price</label>
        <input v-model.number="product.current_price" type="number" required />
      </div>

      <div class="form-group full-width">
        <label>Description</label>
        <QuillEditor v-model:content="product.description" content-type="html" />
      </div>

      <div class="form-group full-width">
        <label>Category</label>
        <select v-model="product.category_id" required>
          <option disabled value="">Select a category</option>
          <template v-for="cat in categories" :key="cat.id">
            <option :value="cat.id" class="parent-option">
              {{ cat.name }}
              <span v-if="cat.subcategories && cat.subcategories.length > 0">
                ({{ cat.subcategories.length }} subcategories)
              </span>
            </option>
            <option 
              v-for="sub in cat.subcategories" 
              :key="sub.id" 
              :value="sub.id"
              class="child-option"
            >
              &nbsp;&nbsp;└─ {{ sub.name }}
            </option>
          </template>
        </select>
      </div>

      <div class="form-group full-width">
        <label>Thumbnail</label>
        <div class="thumb-preview" v-if="product.thumbnail">
          <img :src="product.thumbnail" alt="Thumbnail" />
        </div>
        <input type="file" @change="handleThumbnailUpload" />
      </div>

      <div class="form-group full-width">
        <button type="submit" class="submit-btn">
          Update Product
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '../axios/Axios';
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { uploadToCloudinary } from '@/utils/cloudinary';
import { toast } from 'vue3-toastify';
export default {
  name: 'AdminUpdateProduct',
  components: {
    QuillEditor
  },
  props: {
    productId: {
      type: Number,
      required: true
    }
  },
data() {
  return {
    product: {
      title: '',
      brand: '',
      stock: '',
      original_price: '',
      current_price: '',
      description: '',
      category_id: '',
      thumbnail: ''
    },
    richText: '', // 👈 store editor value here
    categories: [],
    selectedThumbnailFile: null
  };
},

  mounted() {
    this.fetchProductDetails();
    this.fetchCategories();
  },
  methods: {
    async fetchProductDetails() {
      try {
        const res = await api.get(`/products/${this.productId}`);
        this.product = res.data;
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      }
    },
    async fetchCategories() {
      try {
        const res = await api.get('/categories/admin/all');
        // Filter only parent categories (parent_id is null), they already have subcategories nested
        this.categories = res.data.filter(cat => cat.parent_id === null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    },
    handleThumbnailUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.selectedThumbnailFile = file;
      }
    },
async updateProduct() {
  try {
    let thumbnailUrl = this.product.thumbnail;

    // If user selected a new file, upload it to Cloudinary
    if (this.selectedThumbnailFile) {
      thumbnailUrl = await uploadToCloudinary(this.selectedThumbnailFile);
    }

    const updatedProduct = {
      title: this.product.title,
      brand: this.product.brand,
      stock: Number(this.product.stock),
      original_price: Number(this.product.original_price),
      current_price: Number(this.product.current_price),
      description: this.product.description,
      category_id: Number(this.product.category_id),
      thumbnail: thumbnailUrl,
    };

    await api.put(
      `/products/${this.productId}`,
      updatedProduct
    );

    toast.success('✅ Product updated successfully!');
    this.$emit('updated');

  } catch (err) {
    console.error('❌ Error updating product:', err);
    toast.error('❌ Failed to update product.');
  }
}


  }
};
</script>


<style scoped>
.product-form-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

input,
select,
textarea {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 15px;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #ff6b00;
  outline: none;
}

textarea {
  resize: vertical;
}

.thumb-preview img {
  height: 100px;
  width: auto;
  border-radius: 10px;
  margin-bottom: 10px;
  object-fit: cover;
  border: 1px solid #ddd;
}

select option.parent-option {
  font-weight: 600;
  color: #1a1a1a;
}

select option.child-option {
  color: #666;
  font-size: 0.95em;
  padding-left: 20px;
}

.submit-btn {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: #fff;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 107, 0, 0.2);
}
</style>


