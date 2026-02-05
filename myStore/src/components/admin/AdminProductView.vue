<template>
  <div class="admin-product-view">
    <aside class="sidebar">
      <h3>Categories</h3>
      <ul>
        <li
          :class="{ active: selectedCategory === null }"
          @click="selectCategory(null)"
        >
          <span class="category-icon">📦</span>
          All Products
        </li>
        
        <li v-for="cat in categories" :key="cat.id" class="parent-category">
          <div
            :class="{ active: selectedCategory === cat.id }"
            @click="selectCategory(cat.id, cat.name)"
            class="category-item"
          >
            <span class="category-icon">🏷️</span>
            {{ cat.name }}
            <span v-if="cat.subcategories && cat.subcategories.length > 0" class="badge">
              {{ cat.subcategories.length }}
            </span>
          </div>
          
          <!-- Subcategories -->
          <ul v-if="cat.subcategories && cat.subcategories.length > 0" class="subcategory-list">
            <li
              v-for="sub in cat.subcategories"
              :key="sub.id"
              :class="{ active: selectedCategory === sub.id }"
              @click.stop="selectCategory(sub.id, sub.name)"
              class="subcategory-item"
            >
              <span class="subcategory-connector">└─</span>
              {{ sub.name }}
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <main class="main">
      <h2>{{ selectedCategoryName || 'All Products' }}</h2>

      <input
        type="text"
        v-model="searchQuery"
        class="search"
        placeholder="🔍 Search by title..."
      />

      <div class="grid">
        <div class="card" v-for="product in filteredProducts" :key="product.id">
          <img :src="product.thumbnail" alt="Product image" class="thumbnail" />
          <div class="info">
            <h3>{{ product.title }}</h3>
            <p>Brand: {{ product.brand }}</p>
            <p>
              Price: ₹{{ product.current_price }}
              <del v-if="product.original_price">₹{{ product.original_price }}</del>
            </p>
            <p>Stock: {{ product.stock }}</p>
            <p>Category: {{ product.category }}</p>
          </div>
          <div class="actions">
            <button class="edit" @click="editProduct(product)">Edit</button>
            <button class="delete" @click="deleteProduct(product.id)">Delete</button>
          </div>
        </div>
      </div>
    </main>
    <!-- After the product list grid -->


  </div>
  <AdminUpdateProduct
  v-if="selectedProductId"
  :productId="selectedProductId"
  @updated="closeUpdateForm"
  ref="updateForm"
/>
</template>

<script>
import axios from "axios";
import AdminUpdateProduct from "./AdminUpdateProduct.vue";
export default {
  name: "AdminProductView",
  components: {
      AdminUpdateProduct
  },
  data() {
    return {
      products: [],
      categories: [],
      searchQuery: "",
      selectedCategory: null,
      selectedCategoryName: "",
      selectedProductId: null,
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) =>
        product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        this.products = res.data;
        this.selectedCategoryName = "";
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      }
    },
    async fetchProductsByCategory(categoryId) {
      try {
        // Find the selected category
        const selectedCat = this.categories.find(cat => cat.id === categoryId);
        
        // If it's a parent category with subcategories, fetch products from parent and all children
        if (selectedCat && selectedCat.subcategories && selectedCat.subcategories.length > 0) {
          // Get all category IDs (parent + subcategories)
          const categoryIds = [categoryId, ...selectedCat.subcategories.map(sub => sub.id)];
          
          // Fetch products for all categories
          const promises = categoryIds.map(id => 
            axios.get(`http://localhost:5000/api/products/category/${id}`).catch(() => ({ data: [] }))
          );
          
          const results = await Promise.all(promises);
          
          // Combine all products and remove duplicates
          const allProducts = results.flatMap(res => res.data);
          const uniqueProducts = Array.from(
            new Map(allProducts.map(p => [p.id, p])).values()
          );
          
          this.products = uniqueProducts;
        } else {
          // Regular category or subcategory - fetch products normally
          const res = await axios.get(
            `http://localhost:5000/api/products/category/${categoryId}`
          );
          this.products = res.data;
        }
      } catch (error) {
        console.error("❌ Failed to load products by category:", error.message);
      }
    },
    async fetchCategories() {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        this.categories = res.data;
      } catch (err) {
        console.error("❌ Failed to fetch categories", err);
      }
    },
    async selectCategory(categoryId, categoryName = "") {
      this.selectedCategory = categoryId;
      this.selectedCategoryName = categoryName;
      if (categoryId === null) {
        this.fetchProducts();
      } else {
        await this.fetchProductsByCategory(categoryId);
      }
    },
    async deleteProduct(id) {
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        this.products = this.products.filter((p) => p.id !== id);
      } catch (err) {
        console.error("❌ Failed to delete product", err);
      }
    },
 editProduct(product) {
      this.selectedProductId = product.id;
        this.$nextTick(() => {
    const el = this.$refs.updateForm?.$el || this.$refs.updateForm;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
    },
    closeUpdateForm() {
      this.selectedProductId = null;
      this.fetchProducts(); // refresh product list after update
    }
  },
};
</script>

<style scoped>
.admin-product-view {
  display: flex;
  max-width: 1400px;
  margin: 30px auto;
  padding: 20px;
  gap: 24px;
  flex-wrap: wrap;
  background-color: #fafafa;
}

.sidebar {
  width: 280px;
  min-width: 200px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.sidebar h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #0f172a;
  font-weight: 700;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
  letter-spacing: -0.5px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.parent-category {
  margin-bottom: 4px;
}

.category-item {
  padding: 12px 14px;
  margin-bottom: 4px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.category-item:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.category-item.active {
  background-color: #ff6b00;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

.category-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.badge {
  margin-left: auto;
  background: rgba(255, 107, 0, 0.1);
  color: #ff6b00;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 50px;
  min-width: 24px;
  text-align: center;
}

.category-item.active .badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Subcategories */
.subcategory-list {
  padding-left: 16px;
  margin-top: 4px;
  margin-bottom: 8px;
}

.subcategory-item {
  padding: 10px 12px;
  margin-bottom: 2px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.subcategory-connector {
  color: #cbd5e1;
  font-weight: 600;
  font-size: 12px;
}

.subcategory-item:hover {
  background-color: #f1f5f9;
  color: #334155;
  transform: translateX(2px);
}

.subcategory-item:hover .subcategory-connector {
  color: #ff6b00;
}

.subcategory-item.active {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #ff6b00;
  font-weight: 600;
  border-left: 3px solid #ff6b00;
  padding-left: 9px;
}

.subcategory-item.active .subcategory-connector {
  color: #ff6b00;
}

.sidebar li {
  padding: 12px 14px;
  margin-bottom: 6px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar li:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.sidebar li.active {
  background-color: #ff6b00;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

.main {
  flex: 1;
  min-width: 0;
}

.main h2 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #222;
}

.search {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 24px;
  font-size: 15px;
  background-color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f4f4f4;
}

.info {
  padding: 14px;
  flex: 1;
}

.info h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #222;
  font-weight: 600;
}

.info p {
  font-size: 13px;
  margin: 4px 0;
  color: #555;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.edit {
  background-color: #007bff;
  color: white;
}

.edit:hover {
  background-color: #0056b3;
}

.delete {
  background-color: #ff6b00;
  color: white;
}

.delete:hover {
  background-color: #c82333;
}

/* ✅ Mobile & Tablet */
@media (max-width: 768px) {
  .admin-product-view {
    flex-direction: column;
    padding: 16px;
  }

  .sidebar {
    width: 100%;
    border: none;
    border-radius: 10px;
    border-bottom: 1px solid #ddd;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: none;
  }

  .sidebar ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .sidebar li {
    flex: 1 1 auto;
    text-align: center;
    font-size: 13px;
  }

  .main h2 {
    font-size: 20px;
  }

  .search {
    font-size: 14px;
    padding: 10px;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .thumbnail {
    height: 150px;
  }
}


</style>
