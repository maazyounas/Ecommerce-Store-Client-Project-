<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3><i class="fas fa-lock"></i> Change Password</h3>
      <form @submit.prevent="submitChange">
        <div class="form-group">
          <label>Old Password</label>
          <div class="input-group">
            <input :type="showOld ? 'text' : 'password'" v-model="form.oldPassword" required />
            <i :class="showOld ? 'fas fa-eye-slash' : 'fas fa-eye'" @click="showOld = !showOld"></i>
          </div>
        </div>

        <div class="form-group">
          <label>New Password</label>
          <div class="input-group">
            <input :type="showNew ? 'text' : 'password'" v-model="form.newPassword" required />
            <i :class="showNew ? 'fas fa-eye-slash' : 'fas fa-eye'" @click="showNew = !showNew"></i>
          </div>
        </div>

        <div class="form-group">
          <label>Confirm New Password</label>
          <div class="input-group">
            <input :type="showConfirm ? 'text' : 'password'" v-model="form.confirmPassword" required />
            <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'" @click="showConfirm = !showConfirm"></i>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">Update</button>
          <button type="button" class="cancel-btn" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/components/axios/Axios";
import { toast } from "vue3-toastify";

export default {
  name: "ChangePasswordModal",
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      showOld: false,
      showNew: false,
      showConfirm: false,
    };
  },
  methods: {
    async submitChange() {
      if (this.form.newPassword !== this.form.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      try {
        await api.put("/users/change-password", {
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword,
        });
        toast.success("Password changed successfully!");
        this.$emit("close");
      } catch (err) {
        console.error("Password change error:", err);
        toast.error(err.response?.data?.message || "Failed to change password.");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  width: 95%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.modal-content h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}
.modal-content h3 i{
    color: #ff2a00;

}
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #444;
}
.input-group {
  position: relative;
}
.input-group input {
  width: 100%;

    margin: 5px 0;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s;

}
.input-group i {
   position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ff6b00; 
  font-size: 16px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
}
.save-btn,
.cancel-btn {
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.save-btn {
  background-color: #ff6b00;
  color: white;
}
.cancel-btn {
  background-color: #6c757d;
  color: white;
}
.save-btn:hover {
  transform: translateY(-2px);
}
.cancel-btn:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}
</style>
