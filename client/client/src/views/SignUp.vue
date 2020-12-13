// src/views/SignUp.vue

<template>
  <div class="col-12">
    <div class="card card-container">
      <h1>Sign Up</h1>

      <div class="row">
        <div class="col-6">
          <h6 class="label">First Name</h6>
          <input
            class="col-12"
            type="text"
            placeholder="John"
            v-model="first_name"
          />
        </div>
        <div class="col-6">
          <h6 class="label">Last Name</h6>
          <input
            class="col-12"
            type="text"
            placeholder="Smith"
            v-model="last_name"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h6 class="label">Username</h6>
          <input
            class="col-12"
            type="text"
            placeholder="Username"
            v-model="username"
          />
        </div>
        <div class="col-12">
          <h6 class="label">Email</h6>
          <input
            class="col-12"
            type="text"
            placeholder="Email"
            v-model="email"
          />
        </div>
        <div class="col-12">
          <h6 class="label">Password</h6>
          <input
            class="col-12"
            type="password"
            placeholder="password"
            v-model="password"
          />
        </div>
        <div class="col-12">
          <h6 class="label">Confirm Password</h6>
          <input
            class="col-12"
            type="password"
            placeholder="Password"
            v-model="password_repeat"
          />
        </div>
      </div>

      <input
        class="btn btn-dark"
        type="button"
        @click="signUp"
        value="Sign Up"
      />
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
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      password_repeat: "",
      msg: "",
    };
  },
  methods: {
    async signUp() {
      try {
        const credentials = {
          username: this.username,
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name,
          password: this.password,
          password_repeat: this.password_repeat,
        };
        let response = await AuthService.signUp(credentials);
        console.log(response);
        this.msg = response.msg;
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
