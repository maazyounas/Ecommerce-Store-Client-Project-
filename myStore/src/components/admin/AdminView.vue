<template>
  <div class="admin-container">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-left">
        <div class="logo-wrapper">
          <div class="logo-icon">⚡</div>
          <div class="logo-content">
            <h1 class="logo-title">Daraz Admin</h1>
            <p class="logo-subtitle">Control Center</p>
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- Search Bar -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Quick search..." class="search-input" />
        </div>

        <!-- Notifications -->
        <button class="icon-btn notification-btn">
          <span class="icon">🔔</span>
          <span class="badge">3</span>
        </button>

        <!-- Profile Menu -->
        <div class="profile-menu" @click="toggleLogoutDropdown">
          <div class="profile-avatar">
            <span v-if="userProfile">{{ userInitials }}</span>
            <span v-else>?</span>
          </div>
          <div class="profile-info">
            <p class="profile-name">{{ userProfile?.name || 'Admin' }}</p>
            <p class="profile-role">Administrator</p>
          </div>
          <span class="dropdown-arrow">▼</span>
        </div>

        <!-- Logout Dropdown -->
        <div v-if="showLogout" class="logout-dropdown">
          <div class="dropdown-header">
            <div class="dropdown-avatar">{{ userInitials }}</div>
            <div>
              <p class="dropdown-name">{{ userProfile?.name || 'Admin' }}</p>
              <p class="dropdown-email">{{ userProfile?.email || 'admin@store.com' }}</p>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <button @click="goToProfile" class="dropdown-item">
            <span class="item-icon">👤</span>
            My Profile
          </button>
          <button @click="handleLogout" class="dropdown-item logout">
            <span class="item-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Layout -->
    <div class="admin-body">
      <!-- Sidebar -->
      <nav class="admin-sidebar">
        <div class="sidebar-content">
          <div class="nav-section">
            <p class="section-label">MAIN MENU</p>
            <ul class="nav-list">
              <li 
                :class="['nav-item', { active: currentView === 'Overview' }]"
                @click="changeView('Overview')"
              >
                <span class="nav-icon">📊</span>
                <span class="nav-text">Overview</span>
                <div class="active-indicator"></div>
              </li>
              <li 
                :class="['nav-item', { active: currentView === 'AddProduct' }]"
                @click="changeView('AddProduct')"
              >
                <span class="nav-icon">➕</span>
                <span class="nav-text">Add Product</span>
                <div class="active-indicator"></div>
              </li>
              <li 
                :class="['nav-item', { active: currentView === 'ManageProducts' }]"
                @click="changeView('ManageProducts')"
              >
                <span class="nav-icon">📦</span>
                <span class="nav-text">Products</span>
                <div class="active-indicator"></div>
              </li>
              <li 
                :class="['nav-item', { active: currentView === 'Categories' }]"
                @click="changeView('Categories')"
              >
                <span class="nav-icon">🏷️</span>
                <span class="nav-text">Categories</span>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <p class="section-label">MANAGEMENT</p>
            <ul class="nav-list">
              <li 
                :class="['nav-item', { active: currentView === 'Orders' }]"
                @click="changeView('Orders')"
              >
                <span class="nav-icon">🛒</span>
                <span class="nav-text">Orders</span>
                <div class="active-indicator"></div>
              </li>
              <li 
                :class="['nav-item', { active: currentView === 'Returns' }]"
                @click="changeView('Returns')"
              >
                <span class="nav-icon">↩️</span>
                <span class="nav-text">Returns</span>
                <div class="active-indicator"></div>
              </li>
              <li 
                :class="['nav-item', { active: currentView === 'Questions' }]"
                @click="changeView('Questions')"
              >
                <span class="nav-icon">❓</span>
                <span class="nav-text">Q&A</span>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <p class="section-label">CONTENT</p>
            <ul class="nav-list">
              <li 
                :class="['nav-item', { active: currentView === 'HeroView' }]"
                @click="changeView('HeroView')"
              >
                <span class="nav-icon">🎨</span>
                <span class="nav-text">Hero Section</span>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar Footer Stats -->
        <div class="sidebar-footer">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <p class="stat-value">$12,540</p>
              <p class="stat-label">Today's Revenue</p>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="admin-main">
        <component :is="componentMap[currentView]" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '../axios/Axios';
import { toast } from 'vue3-toastify';
import AddProduct from './AdminAddProduct.vue';
import ManageProducts from './AdminProductView.vue';
import Orders from './AdminOrders.vue';
import Returns from './AdminReturns.vue';
import Questions from './AdminQuestions.vue';
import Categories from './AdminCategories.vue';
import Overview from './AdminDashboard.vue';
import HeroView from '../viewsSection/HeroView.vue';

export default {
  name: 'AdminView',
  components: {
    AddProduct,
    ManageProducts,
    Orders,
    Returns,
    Questions,
    Categories,
    Overview,
    HeroView
  },
  setup(props, { emit }) {
    const currentView = ref('Overview');
    const showLogout = ref(false);
    const userProfile = ref(null);

    const componentMap = {
      Overview: 'Overview',
      AddProduct: 'AddProduct',
      ManageProducts: 'ManageProducts',
      Orders: 'Orders',
      Returns: 'Returns',
      Questions: 'Questions',
      Categories: 'Categories',
      HeroView: 'HeroView'
    };

    const userInitials = computed(() => {
      if (!userProfile.value?.name) return 'A';
      const names = userProfile.value.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    });

    const fetchUserProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        userProfile.value = data;
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    const toggleLogoutDropdown = () => {
      showLogout.value = !showLogout.value;
    };

    const changeView = (view) => {
      currentView.value = view;
      showLogout.value = false;
    };

    const goToProfile = () => {
      showLogout.value = false;
      // Navigate to profile or open profile modal
      toast.info('Profile view coming soon!');
    };

    const handleLogout = async () => {
      try {
        await api.get('/users/logout');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        toast.success('✅ Logged out successfully');
        
        // Redirect to login
        window.location.href = '/login';
      } catch (err) {
        console.error('Logout failed', err);
        toast.error('❌ Logout failed');
      }
    };

    onMounted(() => {
      fetchUserProfile();
    });

    return {
      currentView,
      showLogout,
      userProfile,
      userInitials,
      componentMap,
      toggleLogoutDropdown,
      changeView,
      goToProfile,
      handleLogout
    };
  }
}
</script>

<style scoped>
/* General Layout */
.admin-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  overflow: hidden;
}

/* Header */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1a1f36 0%, #2d3748 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff2a00 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.logo-content {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 107, 0, 0.5);
}

.search-icon {
  margin-right: 8px;
  font-size: 14px;
}

.search-input {
  border: none;
  background: transparent;
  color: white;
  outline: none;
  font-size: 14px;
  width: 200px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Icon Button */
.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.icon-btn .icon {
  font-size: 18px;
}

.icon-btn .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff2a00;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(255, 42, 0, 0.4);
}

/* Profile Menu */
.profile-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-menu:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00 0%, #ff2a00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 0, 0.3);
}

.profile-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.profile-role {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}

.dropdown-arrow {
  font-size: 10px;
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.profile-menu:hover .dropdown-arrow {
  transform: translateY(2px);
}

/* Logout Dropdown */
.logout-dropdown {
  position: absolute;
  top: 70px;
  right: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  overflow: hidden;
  animation: dropdownSlide 0.3s ease;
  z-index: 1000;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b00 0%, #ff2a00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

.dropdown-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0 0 4px 0;
}

.dropdown-email {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 1.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.item-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Sidebar */
.admin-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.admin-sidebar {
  width: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  overflow-y: auto;
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem 1rem;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin: 0 0 12px 16px;
  text-transform: uppercase;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 6px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
}

.nav-item:hover {
  background: #f8fafc;
  color: #1e293b;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #fff5f0 0%, #ffe5d9 100%);
  color: #ff6b00;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 0, 0.1);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

.active-indicator {
  position: absolute;
  right: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff6b00;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item.active .active-indicator {
  opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe5d9 100%);
  border-radius: 12px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff2a00 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0 0 2px 0;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Main Content */
.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

/* Scrollbar Styling */
.admin-sidebar::-webkit-scrollbar,
.admin-main::-webkit-scrollbar {
  width: 6px;
}

.admin-sidebar::-webkit-scrollbar-track,
.admin-main::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb,
.admin-main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover,
.admin-main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 1024px) {
  .search-box {
    display: none;
  }

  .profile-info {
    display: none;
  }

  .admin-sidebar {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 1rem;
  }

  .logo-title {
    font-size: 1.25rem;
  }

  .icon-btn {
    display: none;
  }

  .admin-sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    z-index: 999;
    transition: left 0.3s ease;
  }

  .admin-sidebar.open {
    left: 0;
  }

  .admin-main {
    padding: 1rem;
  }

  .logout-dropdown {
    right: 1rem;
  }
}
</style>
