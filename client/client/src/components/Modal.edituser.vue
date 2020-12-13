<template>
  <!-- Edit User Form -->
  <div>
    <b-modal
      id="modal-edituser"
      ref="edituser"
      title="Edit User"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-row>
          <b-col cols="6">
            <b-form-group
              label="First Name"
              label-for="first-name-input"
              invalid-feedback="First Name is required"
            >
              <b-form-input
                id="first-name-input"
                v-model="$v.form.first_name.$model"
                :state="validState('first_name')"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group
              label="Last Name"
              label-for="last-name-input"
              invalid-feedback="Last Name is required"
            >
              <b-form-input
                id="last-name-input"
                v-model="$v.form.last_name.$model"
                :state="validState('last_name')"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group
          label="E-Mail"
          label-for="email-input"
          invalid-feedback="Email is required"
        >
          <b-form-input
            id="email-input"
            v-model="$v.form.email.$model"
            :state="validState('email')"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Username"
          label-for="username-input"
          invalid-feedback="Username is required"
        >
          <b-form-input
            id="username-input"
            v-model="$v.form.username.$model"
            :state="validState('username')"
            required
          ></b-form-input>
        </b-form-group>
        <!--        <b-form-group
          label="Password"
          label-for="password-input"
          invalid-feedback="Password is required"
        >
      <b-form-input
            id="password-input"
            v-model="$v.form.password.$model"
            :state="validState('password')"
            required
            type="password"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Confirm Password"
          label-for="confirm-password-input"
          invalid-feedback="Confirm Password is required"
        >
          <b-form-input
            id="confirm-password-input"
            v-model="$v.form.confirm_password.$model"
            :state="validState('confirm_password')"
            required
            type="password"
          ></b-form-input> 
        </b-form-group> -->
      </form>
    </b-modal>
  </div>
</template>

<script>
//import UserService from "@/services/UserService.js";
import AdminService from "@/services/AdminService.js";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "modal-edituser",
  props: {
    editUser: Object,
  },
  data() {
    return {
      msg: "",
      form: {
        first_name: null,
        last_name: null,
        email: null,
        username: null,
      },
    };
  },
  watch: {
    editUser: function(val) {
      this.form.first_name = val.first_name;
      this.form.last_name = val.last_name;
      this.form.email = val.email;
      this.form.username = val.username;
    },
  },
  validations: {
    form: {
      first_name: {
        required,
        minLength: minLength(4),
      },
      last_name: {
        required,
        minLength: minLength(4),
      },
      username: {
        required,
        minLength: minLength(4),
      },
      email: {
        required,
        minLength: minLength(4),
      },
    },
  },
  methods: {
    validState(value) {
      const { $dirty, $error } = this.$v.form[value];
      return $dirty ? !$error : null;
    },
    resetModal() {
      // this.name = "";
      // this.nameState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      console.log(this.editUser.id);
      // Trigger submit handler
      this.handleSubmit();
    },
    async handleSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        console.log("Error");
        return;
      }
      try {
        const credentials = {
          id: this.editUser.id,
          username: this.form.username,
          email: this.form.email,
          first_name: this.form.first_name,
          last_name: this.form.last_name,
        };
        let response = await AdminService.updateUser(credentials);
        if (response) {
          this.$emit("clicked", true);
          this.$nextTick(() => {
            this.$bvModal.hide("modal-edituser");
          });
        }
        console.log(response);
        this.msg = response.msg;
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
  },
};
</script>
