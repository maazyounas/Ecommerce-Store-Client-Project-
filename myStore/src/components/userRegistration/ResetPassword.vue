<template>
  <div class="reset-wrapper">
    <div class="reset-box">
      <div class="reset-header">
        <h2>Reset Your Password</h2>
        <i class="fas fa-times close-btn" @click="goBack"></i>
      </div>

      <form @submit.prevent="resetPassword">
        <input
          type="password"
          v-model="password"
          placeholder="New Password"
          required
        />
        <button type="submit" class="reset-btn">Reset Password</button>
      </form>

      <p v-if="message" class="message-text">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import api from '../axios/Axios';

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      message: '',
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async resetPassword() {
      const token = this.$route.params.token;
      try {
        const res = await api.post(`/users/reset-password/${token}`, {
          password: this.password,
        });
        this.message = res.data.message || 'Password reset successful!';
        setTimeout(() => this.$router.push('/login'), 1500);
      } catch (err) {
        this.message =
          err.response?.data?.message || 'Invalid or expired token.';
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.reset-wrapper {
  background: #f8f9fa;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  position: relative;
  border: 1px solid rgba(255, 106, 0, 0.1);
}

.reset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reset-header h2 {
  font-size: 22px;
  color: #ff6b00;
  margin: 0;
}

.close-btn {
  font-size: 22px;
  cursor: pointer;
  color: #ff2a00;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #b30000;
}

form input {
  width: 100%;
  margin: 12px 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
}

.reset-btn {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: box-shadow 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 106, 0, 0.3);
}

.message-text {
  margin-top: 15px;
  font-size: 14px;
  color: #28a745;
  text-align: center;
}

</style>
