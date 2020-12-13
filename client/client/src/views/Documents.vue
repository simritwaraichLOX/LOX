<template>
  <div class="container">
    <h1>Hi {{ username }}</h1>

    <div class="container">
      <div>
        <h3 class="center">Documents</h3>
      </div>
      <b-container>
        <b-row align-h="between" class="row">
          <b-col cols="4">
            <input
              type="text"
              v-model.trim="filter"
              placeholder="Filter"
              @keyup="filterFiles"
            />
          </b-col>
          <!-- <b-col cols="4">
            <input type="file" ref="file" multiple v-on:change="onSelect()" />
            <button class="btn-dark" v-on:click="onSubmit()">Submit</button>
            <div class="message">
              <h5>{{ message }}</h5>
            </div>
          </b-col> -->
          <b-col cols="4">
            <input placeholder="Search" v-model="userSearch" />
            <button
              size="md"
              class="btn-dark my-2 my-sm-0"
              type="submit"
              @click="onSearch()"
            >
              Search
            </button>
          </b-col>
        </b-row>
        <b-row>
          <b-table
            class="doc-table"
            head-variant="dark"
            :items="displayItems"
            :fields="fields"
          >
          <template v-slot:cell(actions)="{ item }">
              <!-- `item` -->
              <b-button variant="dark" v-on:click="download(item)"
                >Download</b-button
              >
              <!-- <b-button variant="danger" v-on:click="test(item.storage_name)"
                >Delete</b-button
              > -->
            </template>
          </b-table>
        </b-row>
      </b-container>
    </div>
    
  </div>
  
</template>

<script>
import UserService from "@/services/UserService.js";

export default {
  data() {
    return {
      id: "",
      username: "",
      file: "",
      fileName: "",
      message: "",
      items: [],
      displayItems: [],
      filter: "",
      userSearch: "",
      fields: [
        {
          key: "file_name",
          sortable: true,
        },
        {
          key: "file_size",
          sortable: true,
        },
        {
          key: "created",
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          // variant: "danger",
        },
        {
          key: "id",
          sortable: true,
        },
        {
          key: "actions"
        },
      ],
    };
  },
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.id = this.$store.getters.getID;
    this.username = this.$store.getters.getUser;
    this.roles = this.$store.getters.getUserRoles;
    console.log(this.roles);
    this.getAllFiles();
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    
    
    async onSearch() {
      // let searchBy = {
      //   id: this.id,
      //   username: this.username,
      //   userSearch: this.userSearch,
      // };
      console.log(this.items[0].storage_name);

      try {
        let response = await UserService.getFiles(this.id);
        console.log(response);
        console.log(this.items);
        // this.items = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    async download(item){
      let downloadItem = {
        id: this.id,
        file_name: item.file_name,
        storage_name: item.storage_name,
      };
      try {
        await UserService.download(downloadItem);
      } catch (e) {
        console.log(e);
      }
    },
    async getAllFiles() {
      try {
        let response = await UserService.getFiles(this.id);
        this.items = response.data;
        this.displayItems = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    filterFiles() {
      if (this.filter) {
        console.log(this.filter);
        this.displayItems = this.items.filter((item) =>
          item.file_name.toLowerCase().includes(this.filter.toLowerCase())
        );
      } else {
        this.displayItems = this.items;
      }
    },
    test(test){
      console.log(test);
    }
  },
};
</script>
<style scoped>
.doc-table {
  margin-top: 2%;
}

.row {
  margin-top: 2%;
}
.search{
  text-align: center;
}
.container {
  margin-top: 2%;
}
.h3 {
  margin-bottom: 2%;
}
</style>
