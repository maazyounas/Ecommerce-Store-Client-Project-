<template>
  <div class="profile-container">
    <h2 class="profile-title">
      <i class="fas fa-user-circle"></i> My Profile
    </h2>

    <div class="profile-content">
      <div class="profile-row"><strong>Full Name:</strong> {{ user.fullName }}</div>
      <div class="profile-row"><strong>Phone Number:</strong> {{ user.phone }}</div>
      <div class="profile-row"><strong>Email:</strong> {{ user.email }}</div>
      <div class="profile-row"><strong>Gender:</strong> {{ user.gender }}</div>
      <div class="profile-row"><strong>Date of Birth:</strong> {{ user.dob }}</div>
      <div class="profile-row"><strong>Shipping Address:</strong> {{ user.address }}</div>
    </div>

    <div class="profile-buttons">
      <button class="edit-btn" @click="$emit('edit')">
        <i class="fas fa-edit"></i> Edit Info
      </button>
      <button class="pass-btn" @click="$emit('change-password')">
        <i class="fas fa-key"></i> Change Password
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/components/axios/Axios";

export default {
  name: "UserProfileCard",
  data() {
    return {
      user: {
        fullName: "",
        phone: "",
        email: "",
        gender: "",
        dob: "",
        address: "",
      },
    };
  },
  async mounted() {
    try {
      const res = await api.get("users/profile");
      const profile = res.data;

      this.user = {
        fullName: profile.name, // your DB field
        phone: profile.phone,
        email: profile.email,
        gender: profile.gender,
        dob: profile.dob || "Not set",
        address: profile.address || "Not provided",
      };
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Could not load profile info.");
    }
  },
};
</script>


<style scoped>
.profile-container {
  max-width: 700px;
  margin: auto;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

.profile-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.profile-title i {
  color: #ff6b00;
  font-size: 26px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 15px;
  color: #444;
}
.profile-row strong {
  color: #222;
}

.profile-buttons {
  margin-top: 24px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.edit-btn,
.pass-btn {
  flex: 1;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  padding: 10px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.edit-btn:hover,
.pass-btn:hover {
  transform: translateY(-3px);
  gap: 15px;
}

@media (max-width: 600px) {
  .profile-buttons {
    flex-direction: column;
  }
}

</style>
