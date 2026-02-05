import { createRouter,createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: ()=>import('../components/userRegistration/Login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: ()=>import('../components/userRegistration/SignUp.vue')
  },
  {
    path: '/verification',
    name: 'Verification',
    component: ()=>import('../components/userRegistration/Verification.vue')
  },
  {
    path: '/ProductTitleCard',
    name:'ProductTitleCard',
    component: ()=>import('../components/products/ProductTitleCard.vue')
  },
  {
    path: '/ProductDetails',
    name: 'ProductDetails',
    component: ()=>import('../components/products/ProductDescription.vue')
  },
  {
    path: '/ProductReview',
    name: 'ProductReview',
    component: ()=>import('../components/products/ProductReview.vue')
  },
  {
    path:'/UserReview',
    name: 'UserReview',
    component: ()=>('../components/products/UserReview.vue')

  },
  {
    path:'/ProductQuestion',
    name: 'ProductQuestion',
    component: ()=>import('../components/products/ProductQuestion.vue')

  },
  {
    path: '/basketSection',
    name: 'BasketSection',
    component: ()=>import('../components/basket/BasketSection.vue')
  },
  {
    path: '/Checkout',
    name: 'Checkout',
    component: ()=>import('../components/checkout/CheckoutPage.vue')
  },
  {
    path: '/Payment',
    name: 'Payment',
    component: ()=>import('../components/checkout/BillPay.vue')
  },
  {
    path: '/MyProfile',
    name: 'MyProfile',
    component: ()=>import('../components/myProfile/MyProfile.vue')
  },
  {
    path: '/ManageAccountView',
    name: 'ManageAccountView',
    component: ()=>import('../components/myProfile/ManageAccountView.vue')
  },
  {
    path: '/',
    name: 'HomeView',
    component: ()=>import('../components/viewsSection/HomeView.vue')
  },
  {
  path: '/product/:id',
  name: 'ProductDescriptionView',
  component: () => import('../components/viewsSection/ProductDescriptionView.vue'),
  props: route => ({ productId: Number(route.params.id) }),
}
,
  {
    path: '/ProductListing',
    name: 'ProductListing',
    component: ()=>import('../components/productListing/ProductListing.vue')
  },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: ()=>import('../components/admin/AdminDashboard.vue')
  },
  {
    path: '/ProductManagement',
    name: 'ProductManagement',
    component: ()=>import('../components/admin/AdminAddProduct.vue')
  },
  {
    path: '/forgotPassword',
    name: 'FogotPassword',
    component: ()=>import('../components/userRegistration/Forgot.vue')
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ()=>import('../components/userRegistration/ResetPassword.vue')
  },
  {
    path: '/HeroView',
    name: 'HeroView',
    component: ()=>import('../components/viewsSection/HeroView.vue')
  },
  {
    path: '/AdminOrders',
    name: 'AdminOrders',
    component: ()=>import('../components/admin/AdminOrders.vue')
  },
  {
    path: '/AdminReturns'
    ,name: 'AdminReturns'
    ,component: ()=>import('../components/admin/AdminReturns.vue')
  },
  {
    path: '/AdminQuestions',
    name: 'AdminQuestions',
    component: ()=>import('../components/admin/AdminQuestions.vue')
  },
  {
    path: '/AdminCategories',
    name: 'AdminCategories',
    component: ()=>import('../components/admin/AdminCategories.vue')
  },
  {
    path: '/AdminProductView',
    name: 'AdminProductView',
    component: ()=>import('../components/admin/AdminProductView.vue')
  },
  {
    path: '/AdminUpdateProduct',
    name: 'AdminUpdateProduct',
    component: ()=>import('../components/admin/AdminUpdateProduct.vue')
  },
  {
    path: '/AdminView',
    name: 'AdminView',
    component: ()=>import('../components/admin/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect admin routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!token) {
      // Not logged in, redirect to login
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    // Check if route requires admin role
    if (to.meta.requiresAdmin && userRole !== 'admin') {
      // Not an admin, redirect to home
      next({ name: 'HomeView' });
      return;
    }
  }
  
  // Allow navigation
  next();
});

export default router