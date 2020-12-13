<template>
  <div>
    <h1>Hi {{ username }}</h1>
    <input type="button" value="Logout" @click="logout" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
    };
  },
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.username = this.$store.getters.getUser;
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>
