<template>
  <header>
    <div class="header-container">
      <!-- Logo -->
      <div class="left-section">
        <div class="logo-text" @click="$router.push('/')">
          Reliable<span>Store</span>
        </div>
      </div>

      <div class="middle-section">
        <!-- Search Bar -->
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="submitSearch"
            placeholder="Search for products, brands and more"
          />

          <i class="fas fa-search" @click="submitSearch"></i>
        </div>
      </div>

      <div class="right-section">
        <!-- Cart Icon -->
        <div class="actions-container">
          <div class="cart-icon" @click="goToCard" v-if="user">
            <i class="fas fa-shopping-cart"></i>
          </div>

          <!-- Login Buttons & Profile Dropdown -->
          <!-- Login/Signup shown only if NOT logged in -->
          <div class="user-buttons" v-if="!user">
            <button class="login-button" @click="login">Login</button>
            <button class="signup-button" @click="signup">Sign Up</button>
          </div>

          <!-- Profile shown only if logged in -->
          <div class="user-buttons" v-else>
            <div class="dropdown-wrapper">
              <div class="circular-icon" @click="toggleDropdown">
                <i class="fas fa-user"></i>
              </div>
              <div class="dropdown-menu" v-if="showDropdown">
                <ul>
                  <li @click="goToProfile">
                    <i class="fas fa-user-circle"></i> Manage Profile
                  </li>
                  <li @click="logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import api from "@/components/axios/Axios";
import { toast } from "vue3-toastify";
export default {
  name: "Header",
  data() {
    return {
      showDropdown: false,
      user: null,
      searchQuery: "",
    };
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    async checkLoginStatus() {
      try {
        const res = await api.get("/users/profile");
        this.user = res.data; // If token is valid, user is logged in
      } catch (err) {
        this.user = null; // Not logged in
      }
    },
    submitSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: "/ProductListing",
          query: { q: this.searchQuery.trim() },
        });
      }
    },
    login() {
      this.$router.push("/login");
    },
    signup() {
      this.$router.push("/signup");
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    goToCard() {
      this.$router.push("/basketSection");
    },
    goToProfile() {
      this.$router.push("/ManageAccountView");
      this.showDropdown = false;
    },
    async logout() {
      try {
        await api.get("/users/logout", { withCredentials: true });
        toast.success("Logout successful!");
        this.user = null; // Clear user state
        this.$router.push("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed!");
        console.error("Logout failed:", error);
      } finally {
        this.showDropdown = false;
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
header {
  width: 100%;
  background: #ffffff;
  padding: 18px 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.left-section,
.middle-section,
.right-section {
  display: flex;
  align-items: center;
}

.left-section {
  flex: 1;
  justify-content: flex-start;
}

.middle-section {
  flex: 2;
  justify-content: center;
}

.right-section {
  flex: 1;
  justify-content: flex-end;
  gap: 10px;
}

.logo-text {
  font-size: 34px;
  font-weight: 800;
  color: #111;
  cursor: pointer;
  user-select: none;
  letter-spacing: -1px;
  font-family: "Montserrat", "Segoe UI", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.logo-text:hover {
  transform: scale(1.03);
}

.logo-text span {
  color: #ff5800;
  position: relative;
}

.logo-text span:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  border-radius: 2px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #f8f8f8, #f0f0f0);
  border-radius: 50px;
  height: 48px;
  transition: all 0.3s ease;
  max-width: 650px;
  min-width: 250px;
  width: 100%;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.05),
    0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e1e1;
}

.search-bar:hover {
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d0d0d0;
}

.search-bar:focus-within {
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.08),
    0 4px 15px rgba(255, 90, 0, 0.2);
  border-color: #ff8c00;
}

.search-bar input {
  flex: 1;
  padding: 0 20px;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: #333;
  height: 100%;
  border-radius: 50px 0 0 50px;
}

.search-bar input::placeholder {
  color: #999;
}

.search-bar i {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.search-bar i:hover {
  background: linear-gradient(90deg, #ff5800, #ff2200);
}

/* Cart and Profile */
.actions-container {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cart-icon {
  color: #111;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
}

.cart-icon:hover {
  color: #ff5800;
  transform: translateY(-2px);
}

.circular-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00, #ff2a00);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(255, 90, 0, 0.25);
}

.circular-icon:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 12px rgba(255, 90, 0, 0.3);
}

.user-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-button,
.signup-button {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.login-button {
  background: transparent;
  color: #ff5800;
  border: 1px solid #ff5800;
}

.signup-button {
  background: #ff5800;
  color: #fff;
}

.login-button:hover,
.signup-button:hover {
  opacity: 0.7;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 999;
}

.dropdown-menu ul {
  list-style: none;
}

.dropdown-menu li {
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.dropdown-menu li:hover {
  background: #f8f8f8;
    border-radius: 8px;
}

.dropdown-menu ul li i{
  font-size: 24px;
  color: #ff5800;
}

/* Responsive */
@media (max-width: 992px) {
  .header-container {
    flex-direction: row;
    align-items: stretch;
    gap: 12px;
  }

  .middle-section {
    order: 2;
    width: 100%;
    justify-content: center;
  }

  .right-section {
    order: 1;
    justify-content: flex-end;
    width: 100%;
  }

  .left-section {
    order: 1;
    justify-content: flex-start;
    width: 100%;
  }

  .search-bar {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 24px;
  }

  .search-bar {
    height: 42px;
  }

  .search-bar input {
    font-size: 14px;
    padding: 0 16px;
  }

  .search-bar i {
    padding: 0 20px;
    font-size: 16px;
  }

  .cart-icon {
    font-size: 20px;
    padding: 6px;
  }

  .circular-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}

</style>
