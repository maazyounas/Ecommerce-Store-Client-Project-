<template>
  <div class="signup-background" v-if="showSignupForm">
    <div class="signup-container">
      <div class="form-close">
        <p>Sign Up</p>
        <i class="fas fa-times" @click="closeForm"></i>
      </div>

      <form @submit.prevent="signUp">
        <input type="text" v-model="username" placeholder="Username" required />

        <input type="email" v-model="email" placeholder="Email" required />

        <div class="password-field">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required />
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" @click="togglePassword"></i>
        </div>

        <div class="password-field">
          <input :type="showConfirm ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm Password" required />
          <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'" @click="toggleConfirm"></i>
        </div>

        <div class="term-condition">
          <input type="checkbox" id="terms" v-model="termsAccepted" />
          <label for="terms">
            By creating your account, you agree to our
            <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </label>
        </div>

        <button type="submit" class="signup-btn">Create Account</button>
      </form>

      <div class="divider">Or sign up with</div>

      <div class="social-login">
        <button class="google-login"><i class="fab fa-google"></i> Google</button>
        <button class="facebook-login"><i class="fab fa-facebook-f"></i> Facebook</button>
      </div>

      <div class="login-link">
        Already have an account? <router-link to="/login">Log In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import api from '@/components/axios/Axios';

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      showPassword: false,
      showConfirm: false,
      showSignupForm: true,
    };
  },
  methods: {
    closeForm() {
      this.showSignupForm = false;
      this.$router.back();
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm;
    },
    async signUp() {
      console.log(this.username, this.email, this.password);
      if (!this.termsAccepted) {
        toast.error("Please accept the terms and conditions.");
        return;
      }

      if (this.password !== this.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        const res = await api.post('/users/register', {
          name: this.username,
          email: this.email,
          password: this.password,
        });

        toast.success("Signup successful!");
        this.$router.push('/login');
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed.");
      }
    }
  }
};
</script>

<style scoped>
.signup-background {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(245, 245, 245, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.signup-container {
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 420px;
  position: relative;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.form-close {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-close p {
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.form-close i {
  cursor: pointer;
  font-size: 18px;
  color: #ff2a00;
}

form input {
  width: 100%;

    margin: 10px 0;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s;
}

form input:focus {
  border-color: #ff6b00;
  outline: none;
}

.password-field {
  position: relative;
}

.password-field i {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ff6b00; 
}

.term-condition {
  display: flex;
  align-items: flex-start; 
  gap: 8px; 
  font-size: 13px;
  color: #666;
}

.term-condition input[type="checkbox"] {
  margin-top: 4px; 
  width: auto; 
}

.term-condition a {
  color: #ff6b00;


  text-decoration: none;
  font-weight: 500;
}
.term-condition a:hover {
  text-decoration: underline;
}

.signup-btn {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  width: 100%;
  padding: 14px;
  font-size: 15px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin-top: 12px;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 106, 0, 0.3);
}

.divider {
  text-align: center;
  margin: 24px 0 14px;
  font-size: 13px;
  color: #999;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-login {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.social-login button {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
}

.google-login {
  background: #db4437;
}

.facebook-login {
  background: #3b5998;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link a {
  color: #ff6b00;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

</style>
