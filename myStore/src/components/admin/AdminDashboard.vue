<template>
  <div class="dashboard-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <p class="header-badge">Overview</p>
        <h2 class="header-title">Global Store <span class="accent">Stats</span></h2>
      </div>
      <div class="header-actions">
        <button @click="refreshData" class="add-entry-btn">
          <span class="plus-icon">🔄</span>
          Refresh Data
        </button>
      </div>
    </header>

    <!-- Activity Feed -->
    <div class="activity-section">
      <div class="activity-card">
        <div class="activity-header">
          <h3 class="activity-title">Recent Activity Log</h3>
          <button class="more-btn" @click="refreshActivities">⋯</button>
        </div>
        
        <div v-if="activities.length === 0" class="no-activities">
          <span class="no-data-icon">📋</span>
          <p>No recent activities</p>
        </div>
        
        <div v-else class="activity-list">
          <div 
            v-for="activity in activities.slice(0, 8)" 
            :key="activity.id" 
            class="activity-item"
          >
            <div :class="['activity-icon', activity.colorClass]">
              {{ activity.icon }}
            </div>
            <div class="activity-content">
              <p class="activity-title-text">{{ activity.title }}</p>
              <p class="activity-desc">{{ activity.desc }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="stats-grid">
      <div 
        v-for="(stat, index) in stats" 
        :key="index" 
        class="stat-card"
      >
        <div class="stat-header">
          <div :class="['stat-icon', `stat-icon-${stat.color}`]">
            {{ stat.icon }}
          </div>
          <span :class="['stat-trend', stat.trend.startsWith('+') ? 'positive' : 'negative']">
            {{ stat.trend }}
          </span>
        </div>
        <p class="stat-label">{{ stat.label }}</p>
        <h4 class="stat-value">{{ stat.value }}</h4>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../axios/Axios';
import { toast } from 'vue3-toastify';

export default {
  name: 'AdminDashboard',
  setup() {
    const loading = ref(false);
    const activities = ref([]);
    const stats = ref([]);
    
    // Backend data
    const orders = ref([]);
    const users = ref([]);
    const products = ref([]);
    const totalRevenue = ref(0);

    // Format numbers for display
    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };

    // Fetch all data from backend
    const fetchDashboardData = async () => {
      loading.value = true;
      try {
        await Promise.all([
          fetchOrders(),
          fetchUsers(),
          fetchProducts()
        ]);
        
        // After fetching all data, process it
        processActivities();
        processStats();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        loading.value = false;
      }
    };

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        orders.value = data.orders || [];
        
        // Calculate total revenue
        totalRevenue.value = orders.value.reduce((sum, order) => {
          return sum + parseFloat(order.total_amount || 0);
        }, 0);
      } catch (error) {
        console.error('Error fetching orders:', error);
        orders.value = [];
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/total');
        users.value = data.totalUsers || 0;
      } catch (error) {
        console.error('Error fetching users:', error);
        users.value = 0;
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        products.value = data || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        products.value = [];
      }
    };

    // Process recent activities
    const processActivities = () => {
      const activityList = [];
      
      // Recent orders
      const recentOrders = orders.value
        .slice(0, 3)
        .map(order => ({
          id: `order-${order.id}`,
          icon: '🛒',
          title: 'New Order Received',
          desc: `Order #${order.id} for Rs. ${parseFloat(order.total_amount).toLocaleString()}`,
          time: getTimeAgo(order.created_at),
          colorClass: 'rose',
          timestamp: new Date(order.created_at).getTime()
        }));

      activityList.push(...recentOrders);

      // Low stock products
      const lowStockProducts = products.value
        .filter(p => p.stock < 10)
        .slice(0, 2)
        .map((product, idx) => ({
          id: `stock-${product.id}`,
          icon: '⚠️',
          title: 'Low Stock Alert',
          desc: `${product.title} (${product.stock} units left)`,
          time: 'Just now',
          colorClass: 'amber',
          timestamp: Date.now() - idx * 1000
        }));

      activityList.push(...lowStockProducts);

      // Product updates
      const recentProducts = products.value
        .slice(0, 2)
        .map((product, idx) => ({
          id: `product-${product.id}`,
          icon: '📦',
          title: 'Product Listed',
          desc: product.title,
          time: getTimeAgo(product.created_at),
          colorClass: 'blue',
          timestamp: new Date(product.created_at || Date.now()).getTime() - idx * 1000
        }));

      activityList.push(...recentProducts);

      // Sort by timestamp descending
      activities.value = activityList
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 8);
    };

    // Process stats cards
    const processStats = () => {
      // Calculate trends (comparing with previous period)
      const recentOrdersCount = orders.value.filter(order => {
        const orderDate = new Date(order.created_at);
        const daysAgo = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7;
      }).length;

      const olderOrdersCount = orders.value.filter(order => {
        const orderDate = new Date(order.created_at);
        const daysAgo = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo > 7 && daysAgo <= 14;
      }).length;

      const salesTrend = olderOrdersCount > 0 
        ? `${((recentOrdersCount - olderOrdersCount) / olderOrdersCount * 100).toFixed(0)}%`
        : '+100%';

      // Calculate revenue change
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

      const recentRevenue = orders.value
        .filter(order => new Date(order.created_at) >= sevenDaysAgo)
        .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      const previousRevenue = orders.value
        .filter(order => {
          const date = new Date(order.created_at);
          return date >= fourteenDaysAgo && date < sevenDaysAgo;
        })
        .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      const revenueChange = previousRevenue > 0 
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
        : (recentRevenue > 0 ? 100 : 0);

      // Calculate total products and pending orders
      const pendingOrders = orders.value.filter(order => order.status === 'pending').length;

      stats.value = [
        { 
          label: 'Total Revenue', 
          value: `Rs. ${formatNumber(totalRevenue.value)}`, 
          trend: revenueChange >= 0 ? `+${revenueChange.toFixed(0)}%` : `${revenueChange.toFixed(0)}%`, 
          icon: '💰', 
          color: 'rose' 
        },
        { 
          label: 'Total Sales', 
          value: orders.value.length.toString(), 
          trend: salesTrend, 
          icon: '📦', 
          color: 'blue' 
        },
        { 
          label: 'Total Users', 
          value: users.value.toString(), 
          trend: '+5%', 
          icon: '👥', 
          color: 'amber' 
        },
        { 
          label: 'Pending Orders', 
          value: pendingOrders.toString(), 
          trend: pendingOrders > 0 ? `-${pendingOrders}` : '0', 
          icon: '📋', 
          color: 'emerald' 
        }
      ];
    };

    // Get time ago string
    const getTimeAgo = (dateString) => {
      if (!dateString) return 'Recently';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    };

    // Refresh data
    const refreshData = async () => {
      await fetchDashboardData();
      toast.success('✅ Dashboard data refreshed');
    };

    // Refresh activities only
    const refreshActivities = () => {
      processActivities();
      toast.info('Activities updated');
    };

    onMounted(() => {
      fetchDashboardData();
      
      // Auto-refresh every 2 minutes
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 120000);

      // Cleanup on unmount
      return () => clearInterval(interval);
    });

    return {
      loading,
      activities,
      stats,
      formatNumber,
      refreshData,
      refreshActivities
    };
  }
};
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  background: #FDFEFE;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 24px;
}

.header-left {
  flex: 1;
}

.header-badge {
  font-size: 10px;
  color: #f43f5e;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 4px;
}

.header-title {
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -1px;
  margin: 0;
}

.header-title .accent {
  color: #f43f5e;
}

.add-entry-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
  transition: all 0.3s ease;
}

.add-entry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.3);
}

.plus-icon {
  font-size: 18px;
  font-weight: 300;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #f43f5e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

/* No Data States */
.no-data,
.no-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-data p,
.no-activities p {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
  margin: 0;
}

/* Activity Section */
.activity-section {
  margin-bottom: 32px;
}

/* Activity Card */
.activity-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 40px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.activity-title {
  font-size: 12px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}

.more-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 20px;
}

.more-btn:hover {
  color: #0f172a;
  background: #f8fafc;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  flex: 1;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px;
  margin: -12px;
  border-radius: 16px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.activity-item:hover {
  background: #f8fafc;
  border-color: #f1f5f9;
}

.activity-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease;
}

.activity-item:hover .activity-icon {
  transform: scale(0.9);
}

.activity-icon.rose {
  background: #fff1f2;
  color: #f43f5e;
}

.activity-icon.blue {
  background: #eff6ff;
  color: #3b82f6;
}

.activity-icon.amber {
  background: #fffbeb;
  color: #f59e0b;
}

.activity-icon.emerald {
  background: #ecfdf5;
  color: #10b981;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title-text {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  transition: color 0.2s ease;
}

.activity-item:hover .activity-title-text {
  color: #f43f5e;
}

.activity-desc {
  font-size: 11px;
  color: #64748b;
  margin: 0 0 8px 0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 9px;
  color: #cbd5e1;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 32px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.4s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-icon-rose {
  background: #fff1f2;
  border: 1px solid #fecdd3;
}

.stat-icon-blue {
  background: #eff6ff;
  border: 1px solid #dbeafe;
}

.stat-icon-amber {
  background: #fffbeb;
  border: 1px solid #fef3c7;
}

.stat-icon-emerald {
  background: #ecfdf5;
  border: 1px solid #d1fae5;
}

.stat-trend {
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 8px;
}

.stat-trend.positive {
  background: #ecfdf5;
  color: #10b981;
}

.stat-trend.negative {
  background: #fff1f2;
  color: #f43f5e;
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-wrapper {
    padding: 24px 16px;
  }

  .header-title {
    font-size: 24px;
  }

  .activity-card {
    border-radius: 24px;
    padding: 20px;
  }

  .activity-list {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
