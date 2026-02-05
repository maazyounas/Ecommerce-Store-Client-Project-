<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3><i class="fas fa-user-edit"></i> Edit Information</h3>

      <form v-if="!loading" @submit.prevent="submitEdit">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="form.fullName" placeholder="Enter your name" required />
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" v-model="form.phone" placeholder="Enter your phone number" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label>Gender</label>
          <select v-model="form.gender" required>
            <option disabled value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div class="form-group">
          <label>Date of Birth</label>
           <input type="date" v-model="form.dob" />
        </div>

        <div class="form-group">
          <label>Shipping Address</label>
          <textarea v-model="form.address" rows="3" placeholder="Enter your address"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="cancel-btn">Cancel</button>
          <button type="submit" class="save-btn">Save Changes</button>
        </div>
      </form>

      <div v-else style="text-align: center; padding: 20px;">Loading profile...</div>
    </div>
  </div>
</template>

<script>
import api from "@/components/axios/Axios";
import { toast } from "vue3-toastify";

export default {
  name: "EditInfoModal",
  computed: {
  formattedDOB: {
    get() {
      return this.form.dob?.split("T")[0] || "";
    },
    set(val) {
      this.form.dob = val;
    }
  }
}
,

  data() {
    return {
      form: {
        fullName: "",
        phone: "",
        email: "",
        gender: "",
        dob: "",
        address: ""
      },
      loading: true
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await api.get("/users/profile");
        const user = res.data;
        console.log(user);

        this.form = {
          fullName: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          gender: user.gender || "",
          dob: user.dob?.split("T")[0] || "",
          address: user.address || ""
        };
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load user profile.");
      } finally {
        this.loading = false;
      }
    },

    async submitEdit() {
      try {
        await api.put("/users/profile", this.form);
        toast.success("✅ Profile updated successfully!");
        
        // Close modal and refresh parent data
        this.$emit("close");
        this.$emit("updated");
      } catch (err) {
        console.error("Profile update failed:", err);
        toast.error(err.response?.data?.message || "❌ Profile update failed.");
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 25px;
  width: 95%;
  max-width: 500px;
  border-radius: 10px;
  margin-top: 50px;
}
.modal-content h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-group {
  margin-bottom: 12px;
}
label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}
input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.save-btn {
  background-color: #28a745;
  color: #fff;
  padding: 8px 16px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}
.cancel-btn {
  background-color: #f44336;
  color: #fff;
  padding: 8px 16px;
  border: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}
</style>