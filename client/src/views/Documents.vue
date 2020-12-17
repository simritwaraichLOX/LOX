<template>
  <div class="container col-12">
    <div class="container col-10">
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
          :items="displayItems"
          :fields="fields"
        >
          <template v-slot:cell(file_size)="{ item }">
            <span> {{ formatKB(item.file_size) }}</span>
          </template>
          <template class="doc" v-slot:cell(created)="{ item }">
            <span>{{ formatDate(item.created) }}</span>
          </template>

          <template class="doc" v-slot:cell(actions)="{ item }">
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
    </div>
    <div>
      <Upload v-bind:options="options" @clicked="onFormUpload" />
    </div>
  </div>
</template>
<script>
import UserService from "@/services/UserService.js";
import Upload from "@/components/Modal.upload.vue";
import moment from "moment";

export default {
  components: {
    Upload,
  },
  data() {
    return {
      currentPage_docs: 1,
      perPage_docs: 8,
      username: "",
      message: "",
      items: [],
      displayItems: [],
      displayKeywords: [],
      displayFilters: [],
      keywords: [],
      filterByKeywords: [],
      filter: "",
      userSearch: "",
      roles: "",
      options: [],
      fields: [
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
        },
        {
          key: "actions",
        },
      ],
    };
  },
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push("/login");
    }

    this.username = this.$store.getters.getUser;
    this.roles = this.$store.getters.getUserRoles;
    this.getAllFiles();
    this.getAllKeywords();
  },
  computed: {
    nameState() {
      return this.name.length > 2 ? true : false;
    },
    rows_docs() {
      let i = 0;
      if (typeof this.displayItems !== "undefined") {
        if (this.displayItems.length > 0) {
          i = this.displayItems.length;
        }
      }
      return i;
    },
  },
  methods: {
    formatKB(value) {
      let kb = parseInt(value) / 1000;

      return kb + " kb";
    },
    formatDate(value) {
      return moment(value).format("MMM DD YYYY");
    },
    resetFiles() {
      for (let i = 0; i < this.displayFilters.length; i++) {
        this.displayFilters[i].keyword_enabled = true;
      }
      this.filterByKeywords = [];
      this.displayItems = this.items;
    },
    resetKeyword(keyword) {
      let index = this.displayFilters.findIndex(
        (item) => item.id == keyword.id
      );
      this.displayFilters[index].keyword_enabled = true;

      index = this.filterByKeywords.findIndex((item) => item.id == keyword.id);
      this.filterByKeywords.splice(index, 1);
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
        this.displayItems = response.data;
      } catch (e) {
        console.log(e);
      }
    },

    onFormUpload(value) {
      if (value) {
        this.getAllFiles();
      }
    },
    deleteItem(id) {
      console.log(id);
    },
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
    async getAllKeywords() {
      try {
        let response = await UserService.getAllKeywords();
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

    async getAllFiles() {
      try {
        let id = this.$store.getters.getID;
        let response = await UserService.getFiles(id);
        this.items = response.data;
        this.displayItems = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    filterFiles() {
      if (this.filter != "") {
        let result = this.displayItems.filter((item) =>
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
        this.displayItems = result;
      } else {
        this.displayItems = this.files;
      }
    },
    async onSearch() {
      try {
        let id = this.$store.getters.getID;
        let response = await UserService.getFiles(id);
        if (response) {
          // Update
        }
        // this.items = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    onRowSelected(item, index) {
      // Direct to Document Details Page
      console.log(item);
      console.log(index);
    },
  },
};
</script>
<style scoped>
.container {
  margin-top: 2%;
}
.h3 {
  margin-bottom: 2%;
}

.download {
  border-radius: 12px;
}

#icon {
  font-size: 1.5rem;
}
.icon {
  margin: 3px;
}
.filterKeywords {
  margin-left: 2px;
}
</style>
