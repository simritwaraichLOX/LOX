<template>
  <div class="main-application">
    <div class="col-12">
      <b-tabs pills card>
        <b-tab title="Users" active>
          <b-container class="col-10">
            <b-row align-h="between" class="row">
              <b-col cols="6" class="text-left">
                <b-pagination
                  v-model="currentPage_user"
                  :total-rows="rows_users"
                  :per-page="perPage_user"
                  aria-controls="user-table"
                ></b-pagination>
              </b-col>
              <b-col cols="6" class="text-right">
                <input
                  type="text"
                  v-model.trim="filter"
                  placeholder="Filter"
                  @keyup="filterUsers"
                />
                <b-button
                  v-b-modal.modal-user
                  variant="outline-dark"
                  size="sm"
                  class="icon"
                  ><i id="icon" class="fas fa-user-plus"></i
                ></b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-table
                class="user-table"
                head-variant="dark"
                hover
                :per-page="perPage_user"
                :current-page="currentPage_user"
                :items="displayUsers"
                :fields="user_fields"
              >
                <template v-slot:cell(actions)="{ item }">
                  <!-- `item` -->
                  <b-button variant="primary" v-on:click="onEditItem(item)"
                    >Edit</b-button
                  >
                  <!--<b-button variant="danger" v-on:click="deleteItem(item.id)"
                >Delete</b-button
              >-->
                </template>
              </b-table>
            </b-row>
          </b-container>
        </b-tab>
        <b-tab title="Documents">
          <b-container class="container col-10">
            <b-row>
              <b-col cols="2">
                <b-pagination
                  v-model="currentPage_docs"
                  :total-rows="rows_docs"
                  aria-controls="doc-table"
                ></b-pagination>
              </b-col>
              <b-col cols="7">
                <b-row>
                  <div class="text-left">
                    <b-button variant="outline-dark" v-on:click="resetFiles()">
                      Reset
                    </b-button>
                  </div>
                  <div
                    class="filterKeywords"
                    v-for="keyword in displayFilters"
                    :key="keyword.id"
                  >
                    <b-button
                      variant="outline-dark"
                      v-if="keyword.keyword_enabled"
                      v-on:click="searchByKeywords(keyword)"
                    >
                      {{ keyword.keyword_name }}
                    </b-button>
                    <b-button
                      variant="dark"
                      class="filter"
                      v-else
                      v-on:click="resetKeyword(keyword)"
                    >
                      {{ keyword.keyword_name }}
                    </b-button>
                  </div>
                </b-row>
              </b-col>
              <b-col cols="3">
                <div class="text-right">
                  <input
                    type="text"
                    v-model.trim="filter"
                    placeholder="Quick Search"
                    @keyup="filterFiles"
                  />
                  <b-button
                    v-b-modal.modal-upload
                    variant="outline-dark"
                    size="sm"
                    class="icon"
                    ><i id="icon" class="fas fa-cloud-upload-alt"></i
                  ></b-button>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-table
                class="doc-table"
                head-variant="dark"
                hover
                :per-page="perPage_docs"
                :current-page="currentPage_docs"
                :items="displayFiles"
                :fields="doc_fields"
              >
                <template v-slot:cell(actions)="{ item }">
                  <!-- `item` -->
                  <b-button
                    variant="outline-primary"
                    class="download"
                    v-on:click="downloadItem(item)"
                    ><i class="fas fa-download"></i
                  ></b-button>
                  <!--<b-button variant="danger" v-on:click="deleteItem(item.id)"
                >Delete</b-button
              >-->
                </template>
              </b-table>
            </b-row>
          </b-container>
        </b-tab>
        <b-tab title="Keywords">
          <b-container class="col-10">
            <b-row align-h="between" class="row">
              <b-col cols="6" class="text-left">
                <b-pagination
                  v-model="currentPage_keywords"
                  :total-rows="rows_keywords"
                  :per-page="perPage_keywords"
                  aria-controls="keywords-table"
                ></b-pagination>
              </b-col>
              <b-col cols="6" class="text-right">
                <input
                  type="text"
                  v-model.trim="filter"
                  placeholder="Filter"
                  @keyup="filterKeywords"
                />
                <b-button
                  v-b-modal.modal-keyword
                  variant="outline-dark"
                  size="sm"
                  class="icon"
                  >New Keyword</b-button
                >
              </b-col>
            </b-row>
            <b-row>
              <b-table
                class="keywords-table"
                head-variant="dark"
                hover
                :per-page="perPage_keywords"
                :current-page="currentPage_keywords"
                :items="displayKeywords"
                :fields="keyword_fields"
              >
              </b-table>
            </b-row>
          </b-container>
        </b-tab>
      </b-tabs>
    </div>
    <ModalUpload v-bind:options="options" @clicked="onFormUpload" />
    <ModalUser modalType="create" @clicked="onNewUser" />
    <ModalKeyword @clicked="onNewKeyword" />
    <ModalEditUser @clicked="onEditUser" v-bind:editUser="editUser" />
  </div>
</template>
<script>
import UserService from "@/services/UserService.js";
import AdminService from "@/services/AdminService.js";
import ModalUpload from "@/components/Modal.upload.vue";
import ModalUser from "@/components/Modal.user.vue";
import ModalKeyword from "@/components/Modal.keyword.vue";
import ModalEditUser from "@/components/Modal.edituser.vue";

export default {
  components: {
    ModalUpload,
    ModalUser,
    ModalKeyword,
    ModalEditUser,
  },
  data() {
    return {
      displayUsers: [],
      displayFiles: [],
      displayKeywords: [],
      displayItems: [],
      displayFilters: [],
      editUser: {
        id: null,
        first_name: null,
        last_name: null,
        username: null,
        email: null,
      },
      keywords: [],
      filter: "",
      filterByKeywords: [],
      files: [],
      id: "",
      message: "",
      username: "",
      roles: "",
      users: [],
      userSearch: "",
      options: [],
      perPage_user: 8,
      currentPage_user: 1,
      perPage_docs: 8,
      currentPage_docs: 1,
      currentPage_keywords: 1,
      perPage_keywords: 8,
      user_fields: [
        {
          key: "first_name",
          sortable: true,
        },
        {
          key: "last_name",
          sortable: true,
        },
        {
          key: "email",
          sortable: true,
        },
        {
          key: "username",
          sortable: true,
        },
        {
          key: "registered",
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          // variant: "danger",
        },
        {
          key: "last_login",
          sortable: true,
        },
        {
          key: "actions",
        },
      ],
      doc_fields: [
        {
          key: "file_name",
          sortable: true,
        },
        {
          key: "file_size",
          sortable: false,
        },
        {
          key: "created",
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          // variant: "danger",
        },
        {
          key: "actions",
        },
      ],
      keyword_fields: [
        {
          key: "keyword_name",
          sortable: true,
        },
        {
          key: "description",
          sortable: false,
        },
        {
          key: "created",
          sortable: true,
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
    this.getAllFiles();
    this.getAllUsers();
    this.getAllKeywords();
  },
  computed: {
    rows_users() {
      let i = 0;
      if (typeof this.displayUsers !== "undefined") {
        if (this.displayUsers.length > 0) {
          i = this.displayUsers.length;
        }
      }

      return i;
    },
    rows_docs() {
      let i = 0;
      if (typeof this.displayFiles !== "undefined") {
        if (this.displayFiles.length > 0) {
          i = this.displayFiles.length;
        }
      }
      return i;
    },
    rows_keywords() {
      let i = 0;
      if (typeof this.displayKeywords !== "undefined") {
        if (this.displayKeywords > 0) {
          i = this.displayKeywords.length;
        }
      }

      return i;
    },
  },
  methods: {
    async downloadItem(item) {
      let id = this.$store.getters.getID;
      let downloadItem = {
        id: id,
        file_name: item.file_name,
        storage_name: item.storage_name,
      };
      try {
        await UserService.download(downloadItem);
      } catch (e) {
        console.log(e);
      }
    },
    resetKeyword(keyword) {
      let index = this.displayFilters.findIndex(
        (item) => item.id == keyword.id
      );
      this.displayFilters[index].keyword_enabled = true;

      index = this.filterByKeywords.findIndex((item) => item.id == keyword.id);
      this.filterByKeywords.splice(index, 1);
    },
    resetFiles() {
      for (let i = 0; i < this.displayFilters.length; i++) {
        this.displayFilters[i].keyword_enabled = true;
      }
      this.filterByKeywords = [];
      this.displayFiles = this.files;
    },
    async searchByKeywords(item) {
      this.filterByKeywords.push(item);
      const b = this.displayFilters.findIndex((d) => d.id == item.id);

      this.displayFilters[b].keyword_enabled = false;

      let id = this.$store.getters.getID;
      try {
        let response = await UserService.filterByKeywords(
          id,
          this.filterByKeywords
        );
        this.displayFiles = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    onEditItem(item) {
      let user = {
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        username: item.username,
      };
      this.editUser = user;
      this.$bvModal.show("modal-edituser");
    },
    onEditUser(value) {
      if (value) {
        this.getAllUsers();
      }
    },
    onFormUpload(value) {
      if (value) {
        this.getAllFiles();
      }
    },
    onNewUser(value) {
      if (value) {
        this.getAllUsers();
      }
    },
    onNewKeyword(value) {
      if (value) {
        this.getAllKeywords();
      }
    },
    async getAllKeywords() {
      try {
        let response = await AdminService.getAllKeywords();
        let lib = [];
        let options = [];
        let filters = [];
        for (let i = 0; i < response.data.length; i++) {
          let keyword = {
            keyword_name: response.data[i].keyword_name,
            description: response.data[i].description,
            created: response.data[i].created,
          };
          let option = {
            value: response.data[i].id,
            text: response.data[i].keyword_name,
          };
          let filter = {
            id: response.data[i].id,
            keyword_enabled: true,
            keyword_name: response.data[i].keyword_name,
          };
          options.push(option);
          lib.push(keyword);
          filters.push(filter);
        }
        this.displayFilters = filters;
        this.options = options;
        this.keywords = lib;
        this.displayKeywords = lib;
      } catch (e) {
        console.log(e);
      }
    },
    async getAllUsers() {
      try {
        let response = await AdminService.getAllUsers();
        let lib = [];
        for (let i = 0; i < response.data.length; i++) {
          let entry = {
            id: response.data[i].id,
            first_name: response.data[i].first_name,
            last_name: response.data[i].last_name,
            email: response.data[i].email,
            username: response.data[i].username,
            registered: response.data[i].registered,
            last_login: response.data[i].last_login,
          };
          lib.push(entry);
        }
        this.users = lib;
        this.displayUsers = lib;
      } catch (e) {
        console.log(e);
      }
    },
    async getAllFiles() {
      try {
        let response = await UserService.getFiles(this.id);
        this.files = response.data;
        this.displayFiles = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    filterUsers() {
      if (this.filter != "") {
        let result = this.displayUsers.filter((item) =>
          Object.keys(item)
            .map(
              (key) =>
                typeof item[key] === "string" &&
                item[key]
                  .toLocaleLowerCase()
                  .includes(this.filter.toLocaleLowerCase())
            )
            .includes(true)
        );
        this.displayUsers = result;
      } else {
        this.displayUsers = this.users;
      }
    },
    filterFiles() {
      if (this.filter != "") {
        let result = this.displayFiles.filter((item) =>
          Object.keys(item)
            .map(
              (key) =>
                typeof item[key] === "string" &&
                item[key]
                  .toLocaleLowerCase()
                  .includes(this.filter.toLocaleLowerCase())
            )
            .includes(true)
        );
        this.displayFiles = result;
      } else {
        this.displayFiles = this.files;
      }
    },
    filterKeywords() {
      if (this.filter != "") {
        let result = this.displayKeywords.filter((item) =>
          Object.keys(item)
            .map(
              (key) =>
                typeof item[key] === "string" &&
                item[key]
                  .toLocaleLowerCase()
                  .includes(this.filter.toLocaleLowerCase())
            )
            .includes(true)
        );
        this.displayKeywords = result;
      } else {
        this.displayKeywords = this.keywords;
      }
    },
  },
};
</script>

<style scoped>
.file-upload {
  margin: 2%;
}

.card-container.card {
  max-width: 1000px !important;
  padding: 40px 40px;
}

.label {
  text-align: left;
  margin-top: 10px;
}

#icon {
  font-size: 1.5rem;
}

.icon {
  margin: 3px;
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
.filterKeywords {
  margin-left: 2px;
}
</style>
