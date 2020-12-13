<template>
  <!-- File Upload Form -->
  <div>
    <b-modal
      id="modal-upload"
      ref="uploads"
      title="Upload File"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="File Name"
          label-for="file_name-input"
          invalid-feedback="Document Name is required"
        >
          <b-form-input
            id="file_name-input"
            v-model="$v.form.file_name.$model"
            :state="validState('file_name')"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-file
            v-model="$v.form.file.$model"
            :state="validState('file')"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>

        <b-form-group
          label="Keywords"
          label-for="keyword-input"
          invalid-feedback="Please select one or more keywords"
        >
          <b-form-select
            id="keyword-input"
            v-model="$v.form.keywords.$model"
            :state="validState('keywords')"
            :options="options"
            multiple
            :select-size="4"
          ></b-form-select>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import UserService from "@/services/UserService.js";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "modal-upload",
  props: {
    options: Array,
  },
  data() {
    return {
      file: null,
      keywords: [],
      form: {
        file_name: null,
        file: null,
        keywords: [],
      },
    };
  },
  validations: {
    form: {
      file_name: {
        required,
        minLength: minLength(4),
      },
      file: {
        required,
      },
      keywords: {
        required,
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
      console.log(this.form.keywords);
      this.handleSubmit();
    },
    async handleSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        console.log("Error");
        return;
      }
      const formData = new FormData();
      let id = this.$store.getters.getID;
      formData.append("userId", id);
      formData.append("files", this.form.file);
      formData.append("keywords", this.form.keywords);
      // Upload Selected File
      try {
        let response = await UserService.upload(formData);
        if (response) {
          this.$emit("clicked", true);
          this.$nextTick(() => {
            this.$bvModal.hide("modal-upload");
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
