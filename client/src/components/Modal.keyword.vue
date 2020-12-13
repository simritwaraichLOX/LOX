<template>
  <!-- File Upload Form -->
  <div>
    <b-modal
      id="modal-keyword"
      ref="keywords"
      title="New Keyword"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Keyword"
          label-for="keyword-name-input"
          invalid-feedback="Keyword is required"
        >
          <b-form-input
            id="keyword-name-input"
            v-model="$v.form.keyword.$model"
            :state="validState('keyword')"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Description"
          label-for="description-input"
          invalid-feedback="Description is required"
        >
          <b-form-input
            id="description-input"
            v-model="$v.form.description.$model"
            :state="validState('description')"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
//import UserService from "@/services/UserService.js";
import { required, minLength } from "vuelidate/lib/validators";
import AdminService from "@/services/AdminService.js";
export default {
  name: "modal-keyword",
  props: {
    // id: Number,
    // type: String,
  },
  data() {
    return {
      form: {
        keyword: null,
        description: null,
      },
    };
  },
  validations: {
    form: {
      keyword: {
        required,
        minLength: minLength(4),
      },
      description: {
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
      // Trigger submit handler
      this.handleSubmit();
    },
    async handleSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        console.log("Error");
        return;
      }

      // No error submit data

      let credentials = {
        keyword: this.$v.form.keyword.$model,
        description: this.$v.form.description.$model,
      };
      try {
        let response = await AdminService.createKeyword(credentials);
        if (response) {
          this.$emit("clicked", true);
          this.$nextTick(() => {
            this.$bvModal.hide("modal-keyword");
          });
        }
      } catch (e) {
        console.log(e);
      }

      this.$nextTick(() => {
        this.$bvModal.hide("modal-keyword");
      });
    },
  },
};
</script>
