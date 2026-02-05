<template>
  <div>
    <Header />
    <div class="product-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h3>Category</h3>
        <ul>
          <li
            v-for="(cat, index) in allCategories"
            :key="index"
            :class="{ active: cat === selectedCategory }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </li>
        </ul>
      </aside>

      <!-- Product Grid -->
      <main class="product-area">
        <div class="product-grid">
          <CardFlashSale
            v-for="(item, index) in filteredProducts"
            :key="index"
            :product="item"
          />
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import CardFlashSale from "../home/CardFlashSale.vue";
import Header from "../home/Header.vue";
import Footer from "../home/Footer.vue";

export default {
  name: "ProductListing",
  components: { CardFlashSale, Header, Footer },
  data() {
    return {
      products: [],
      categories: new Set(),
      selectedCategory: "All",
    };
  },
  computed: {
    allCategories() {
      return ["All", ...Array.from(this.categories)];
    },
    filteredProducts() {
      if (this.selectedCategory === "All") return this.products;
      return this.products.filter(
        (p) => p.category === this.selectedCategory
      );
    },
  },
created() {
  const query = this.$route.query.q;
  const categoryFromQuery = this.$route.query.category;
  this.selectedCategory = categoryFromQuery || "All";

  if (query) {
    this.searchProducts(query);
  } else {
    this.loadAllProducts();
  }

  this.fetchCategories();
},

watch: {
  '$route.query.q'(newQuery) {
    if (newQuery) {
      this.searchProducts(newQuery);
    } else {
      this.loadAllProducts();
    }
  },
  '$route.query.category'(newCategory) {
    this.selectedCategory = newCategory || "All";
  }
},

methods: {
  fetchCategories() {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => {
        const names = data.map(cat => cat.name);
        this.categories = new Set(names);
      });
  },

  loadAllProducts() {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        this.products = data;
        data.forEach(item => this.categories.add(item.category));
      });
  },

  searchProducts(query) {
    fetch(`http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        this.products = data;
      });
  }
}



};
</script>

<style scoped>
.product-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
}

/* Sidebar */
.sidebar {
  width: 220px;
  min-width: 180px;
  height: 70vh;
  background-color: #fafafa;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}
.sidebar h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px 12px;
  margin-bottom: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}
.sidebar li:hover,
.sidebar li.active {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: #fff;
}

/* Product Area */
.product-area {
  flex: 1;
  min-width: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding-right: 10px;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }

  .product-layout {
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  .sidebar {
    height: 50vh;
  }
}

</style>
