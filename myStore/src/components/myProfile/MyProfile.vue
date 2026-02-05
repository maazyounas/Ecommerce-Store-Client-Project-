<template>
  <UserProfileCard
    :user="user"
    @edit="showEdit = true"
    @change-password="showPassword = true"
  />
<EditInfoModal
  v-if="showEdit"
  :user="user"
  @update="handleProfileUpdated"
  @updated="showEdit = false"
/>

  <ChangePasswordModal
    v-if="showPassword"
    @close="showPassword = false"
    @change-password="handlePasswordChange"
  />
</template>

<script>
import UserProfileCard from "./UserProfileCard.vue";
import EditInfoModal from "./EditInfoModal.vue";
import ChangePasswordModal from "./ChangePasswordModal.vue";

export default {
  components: { UserProfileCard, EditInfoModal, ChangePasswordModal },
  data() {
    return {
      showEdit: false,
      showPassword: false,
      user: {
        fullName: "Shahzaib Gulfraz",
        phone: "03165318332",
        email: "shahzaib@example.com",
        gender: "Male",
        dob: "1999-08-15",
        address: "Dhok Adra Post Office, Rawat, Islamabad, Pakistan",
      },
    };
  },
  methods: {
    handlePasswordChange(form) {
      console.log("Password changed:", form);
    },

  handleProfileUpdated(newData) {
    this.user = { ...newData };
  }

   
  },
};
</script>

