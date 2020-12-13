<template>
    <div>
        <h1>ADMIN</h1>
    <div class="card card-container">
        <div>
            <input type="file" ref="file" multiple v-on:change="onSelect()" />
            <button class="btn-dark" v-on:click="onSubmit()">Submit</button>
            <div class="message">
            <h5>{{ message }}</h5>
            </div>
        </div>

    </div>


        
    </div>
</template>
<script>
import UserService from "@/services/UserService.js";

export default {
    data(){
        return{
            id: "",
            username: "",
            file: "",
            fileName: "",
            message: "",
            items: [],
            displayItems: [],
            filter: "",
            userSearch: "",
        }
    },
    async created() {
    if (!this.$store.getters.isLoggedIn) {
        this.$router.push("/login");
    }
    this.id = this.$store.getters.getID;
    this.username = this.$store.getters.getUser;
    this.roles = this.$store.getters.getUserRoles;
    console.log(this.roles);
    
    },
    methods: {
        onSelect() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },
        async onSubmit() {
            const formData = new FormData();
            formData.append("userId", this.id);
            formData.append("files", this.file);

            try {
                let response = await UserService.upload(formData);
                console.log(response);
                let updateFiles = await UserService.getFiles(this.id);
                this.items = updateFiles.data;
            } catch (e) {
                console.log(e);
            }
        }
    }
}
    

</script>
<style scoped>
.card-container.card {
  max-width: 1000px !important;
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