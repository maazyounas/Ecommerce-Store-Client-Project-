<template>
  <div class="forgot-wrapper">
    <div class="forgot-box">
      <div class="forgot-header">
        <h2>Reset Your Password</h2>
        <i class="fas fa-times close-btn" @click="closeForm"></i>
      </div>

      <form @submit.prevent="submitEmail">
        <input
          type="email"
          v-model="email"
          placeholder="Enter your registered email"
          required
        />
        <button type="submit" class="reset-btn">Send Reset Link</button>
      </form>

      <div class="back-login">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/components/axios/Axios';
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
    };
  },
  methods: {
    closeForm() {
      this.$router.back();
    },
    async submitEmail() {
      console.log(this.email,"forgot password component working");
      try {
        const res = await api.post('/users/forgot-password', {
          email: this.email,
        });
        alert(res.data.message || 'Reset link sent to your email!');
      } catch (error) {
        alert(
          error.response?.data?.message || 'Something went wrong. Try again.'
        );
      }
    },
  },
};
</script>

<style scoped>
.forgot-wrapper {
  background: #f0f4f8;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forgot-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  position: relative;
}

.forgot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-header h2 {
  font-size: 20px;
  color: #ff6b00;
  margin: 0;
}

.close-btn {
  font-size: 20px;
  cursor: pointer;
  color: #ff6b00;
}

form input {
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.reset-btn {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  width: 100%;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.reset-btn:hover {
   transform: translateY(-2px);
}

.back-login {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.back-login a {
  color: black;
  text-decoration: none;
}
</style>
