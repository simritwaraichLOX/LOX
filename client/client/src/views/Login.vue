<template>
  <div class="col-12">
    <div class="card card-container">
      <h1>Log in</h1>

      <div class="row">
        <h6 class="label">Username</h6>

        <input
          class="col-12"
          type="text"
          placeholder="Username"
          v-model="username"
        />
      </div>
      <div class="row">
        <h6 class="label">Password</h6>

        <input
          class="col-12"
          type="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <input class="btn btn-dark" type="button" @click="login" value="Login" />
      <p v-if="msg">{{ msg }}</p>
    </div>
  </div>
</template>
<script>
import AuthService from "@/services/AuthService.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      msg: "",
    };
  },
  methods: {
    async login() {
      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        const response = await AuthService.login(credentials);
        console.log(response);
        this.msg = response.msg;
        const token = response.accessToken;
        const user = response.username;
        const id = response.id;
        const roles = response.roles;
        
        this.$store
          .dispatch("login", { token, user, id, roles })
          .then()
          .catch((err) => console.log(err));
          // () => this.$router.push("/")
          // this.$router.push("/");
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
  },
};
</script>
<style scoped>
.card-container.card {
  max-width: 650px !important;
  padding: 40px 40px;
}

.label {
  text-align: left;
  margin-top: 10px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.btn {
  margin-top: 25px;
}
</style>
