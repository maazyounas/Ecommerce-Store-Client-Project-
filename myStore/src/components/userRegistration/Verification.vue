<template>
 <div class="verification-background" v-if="showVerificationForm">
    <div class="verification-container">

        <div class="form-close">
            <p>Verify your identity</p>
            <i class="fas fa-times" @click="closeForm"></i>
         </div>

         <div class="verification-content">
            <p>Please enter the OTP via WHATSAPP to continue</p>
         </div>

         <div class="verification-number">
            <p>Phone Number:</p>
            <p class="phone-number">03165318332</p>
            <a href="#" @click="changeNumber">Change Number</a>
         </div>

         <div class="otp-inputs">
  <input
    v-for="(n, i) in 6"
    :key="i"
    ref="otpInputs"
    type="text"
    maxlength="1"
    pattern="[0-9]*"
    inputmode="numeric"
    required
    @input="handleInput($event, i)"
    @keydown.backspace="handleBackspace($event, i)"
  />
</div>


         <div class="verification-content">
            <p><a href="#">Resend Code</a></p>
         </div>

         <div class="verification-actions">
            <button @click="signup">Back</button>
            <button @click="confirm">Confirm</button>
         </div>

    </div>
 </div>
</template>
<script>
export default {
    name:'Verification',
      data() {
    return {
      termsAccepted: false,
      showVerificationForm: true,
    };
  },
    methods:{
           handleInput(event, index) {
      const value = event.target.value;
      if (value.length > 1) {
        event.target.value = value.slice(0, 1);
      }

      // Move to next input
      if (value && index < 5) {
        this.$refs.otpInputs[index + 1].focus();
      }
    },
    handleBackspace(event, index) {
  if (!event.target.value && index > 0) {
    this.$refs.otpInputs[index - 1].focus();
  }
  },
  

         closeForm() {
      this.showVerificationForm = false;
    },
        changeNumber(){
            this.$router.push('/signup');
        },
        confirm() {
            // Logic to confirm the OTP
            alert("OTP Confirmed");
            this.showVerificationForm = false;
            this.$router.push('/login'); // Redirect to login or another page after confirmation
        },
        signup() {
            this.$router.push('/signup');
        }
        },
    }

</script>
<style scoped>
.verification-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.verification-container {
  background: white;
  border-radius: 16px;
  padding: 30px 20px 80px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
}

.form-close {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.form-close p {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #ff6b00;
}

.form-close i {
  font-size: 22px;
  color: #ff2a00;
  cursor: pointer;
  transition: color 0.3s ease;
}

.form-close i:hover {
  color: #cc1f00;
}

.verification-content {
  width: 100%;
  margin: 20px 0 10px;
  color: #444;
}

.verification-number {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  color: #595f6d;
}

.phone-number {
  font-weight: bold;
  margin-left: 6px;
  color: #333;
}

.verification-number a {
  color: #007bff;
  text-decoration: none;
  margin-left: 12px;
  font-size: 13px;
  padding-top: 3px;
}

.otp-inputs {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  width: 100%;
  justify-content: flex-start;
}

.otp-inputs input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border 0.3s, background 0.3s;
}

.otp-inputs input:focus {
  border-color: #ff6b00;
  outline: none;
  background-color: #fff0e5;
  color: #ff6b00;
}

.verification-content p a {
  color: #007bff;
  text-decoration: none;
  font-size: 13px;
}

.verification-actions {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.verification-actions button {
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.verification-actions button:hover {
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.4);
}

@media (max-width: 600px) {
  .verification-container {
    padding: 20px 15px 80px;
  }

  .otp-inputs input {
    width: 42px;
    height: 42px;
    font-size: 16px;
  }

  .verification-actions {
    right: 15px;
    bottom: 15px;
    gap: 8px;
  }

  .verification-actions button {
    padding: 9px 18px;
    font-size: 13px;
  }
}

</style>