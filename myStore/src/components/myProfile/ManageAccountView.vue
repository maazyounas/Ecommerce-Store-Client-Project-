<template>
  <Header />
  <div class="manage-account">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Manage Account</h2>
      <ul>
        <li
          :class="{ active: selected === 'profile' }"
          @click="selected = 'profile'"
        >
          <i class="fas fa-user-circle"></i> My Profile
        </li>
        <li
          :class="{ active: selected === 'password' }"
          @click="openPasswordModal"
        >
          <i class="fas fa-lock"></i> Change Password
        </li>

        <li
          :class="{ active: selected === 'return' }"
          @click="selected = 'return'"
        >
          <i class="fas fa-undo-alt"></i> My Return
        </li>
        <li
          :class="{ active: selected === 'cancel' }"
          @click="selected = 'cancel'"
        >
          <i class="fas fa-times-circle"></i> My Cancellation
        </li>
        <li
          :class="{ active: selected === 'review' }"
          @click="selected = 'review'"
        >
          <i class="fas fa-star"></i> My Review
        </li>
        <li
          :class="{ active: selected === 'wishlist' }"
          @click="selected = 'wishlist'"
        >
          <i class="fas fa-heart"></i> My Wishlist
        </li>
        <li
          :class="{ active: selected === 'orders' }"
          @click="selected = 'orders'"
        >
          <i class="fas fa-box"></i> Orders
        </li>
      </ul>
    </aside>

<!-- Content Area -->
<section class="content">
  <component :is="currentComponent" />
  <ChangePasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
</section>

  </div>
  <Footer />
</template>

<script>
import MyProfile from "./MyProfile.vue";
import ChangePasswordModal from "./ChangePasswordModal.vue";
import MyReturn from "./MyReturn.vue";
import MyCancellation from "./MyCancellation.vue";
import MyReview from "./MyReview.vue";
import MyWishlist from "./MyWishlist.vue";
import Header from "../home/Header.vue";
import Footer from "../home/Footer.vue";
import MyOrders from "./MyOrders.vue";

export default {
  name: "ManageAccountView",
  components: {
    MyProfile,
    ChangePasswordModal,
    MyReturn,
    MyCancellation,
    MyReview,
    MyWishlist,
    Header,
    Footer,
    MyOrders,
  },
  data() {
    return {
      selected: "profile",
      showPasswordModal: false,
    };
  },
  methods: {
  openPasswordModal() {
    this.showPasswordModal = true;
  },
}
,
computed: {
  currentComponent() {
    const components = {
      profile: MyProfile,
      return: MyReturn,
      cancel: MyCancellation,
      review: MyReview,
      wishlist: MyWishlist,
      orders: MyOrders,
    };
    return components[this.selected];
  }
},
};
</script>

<style scoped>
.manage-account {
  display: flex;
  flex-direction: row; /* Always row for side-by-side layout */
  width: 100%;
  min-height: 100vh;
  background-color: #f9f9f9;
  overflow-x: hidden;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  font-size: 16px;
  color: #444;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.sidebar li:hover {
  background-color: #f5f5f5;
}

.sidebar li.active {
  background-color: #f85606;
  color: white;
}

.sidebar li i {
  width: 20px;
  text-align: center;
}

/* Content Area */
.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #fefefe;
  overflow-x: hidden;
}

/* ✅ Responsive Behavior */
@media (max-width: 768px) {
  .sidebar {
    width: 100px; /* narrower on mobile */
    padding: 10px;
  }

  .sidebar h2 {
    display: none; /* hide title to save space */
  }

  .sidebar li {
    flex-direction: column;
    font-size: 12px;
    padding: 8px 5px;
    gap: 4px;
    align-items: center;
    text-align: center;
  }

  .sidebar li i {
    font-size: 18px;
  }

  .content {
    padding: 10px;
  }
}
</style>
