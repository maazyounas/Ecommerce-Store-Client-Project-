<template>
  <div class="login-wrapper" v-if="showLogin">
    <div class="login-box">
      <div class="login-header">
        <h2>Welcome to ReliableStore</h2>
        <i class="fas fa-times close-btn" @click="closeForm"></i>
      </div>

      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />

        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            required
          />
          <i
            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="togglePassword"
          ></i>
        </div>

        <div class="forgot-link">
          <router-link to="/forgotPassword">Forgot Password?</router-link>
        </div>

        <button type="submit" class="login-btn">Login</button>
      </form>

      <div class="divider">Or login with</div>
      <div class="social-buttons">
        <button class="google"><i class="fab fa-google"></i> Google</button>
        <button class="facebook"><i class="fab fa-facebook-f"></i> Facebook</button>
      </div>

      <div class="register-text">
        Don't have an account?
        <router-link to="/signup">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/components/axios/Axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      showLogin: true,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    closeForm() {
      this.showLogin = false;
      this.$router.back();
    },
    async login() {
      try {
        const res = await api.post('/users/login', {
          email: this.email,
          password: this.password,
        });
        console.log("login controller working");
        const { token, user } = res.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_name', user.name);
        toast.success('Login successful!');
        
        if (user.role === 'admin') {
          this.$router.push('/AdminView');
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed!');
      }
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  background: #f9f9f9;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.login-header h2 {
  font-size: 22px;
  color: #222;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  font-size: 20px;
  cursor: pointer;
  color: #ff2a00;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #c70000;
}

form input {
  width: 100%;
  margin: 10px 0;
  padding: 14px 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border 0.3s ease;
}

form input:focus {
  border-color: #ff6b00;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 44px;
}

.password-field i {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ff6b00; 
}

.forgot-link {
  text-align: right;
  font-size: 13px;
  margin-bottom: 12px;
}

.forgot-link a {
  color: #ff2a00;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link a:hover {
  color: #c70000;
}

.login-btn {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: opacity 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 106, 0, 0.3);
}

.divider {
  text-align: center;
  margin: 18px 0;
  font-size: 14px;
  color: #777;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  height: 1px;
  background: #ccc;
  top: 50%;
  width: 40%;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.social-buttons button {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.3s ease;
}

.social-buttons button:hover {
  opacity: 0.9;
}

.google {
  background: #db4437;
}

.facebook {
  background: #3b5998;
}

.register-text {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
  color: #333;
}

.register-text a {
  color: #ff6b00;
  text-decoration: none;
  font-weight: 500;
}

.register-text a:hover {
  text-decoration: underline;
}

</style>
