<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">LOX</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item
              v-for="routes in links_isLoggedIn"
              :key="routes.id"
              :to="routes.path"
            >
              <template v-if="isLoggedIn">
                {{ routes.name }}
              </template>
            </b-nav-item>
            <b-nav-item v-if="isLoggedIn && isAdmin" :to="{ path: 'admin' }">
              Admin
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item
              v-for="routes in links_noLoggedIn"
              :key="routes.id"
              :to="routes.path"
            >
              <template v-if="!isLoggedIn">
                {{ routes.name }}
              </template>
            </b-nav-item>

            <b-nav-item v-if="isLoggedIn" @click.prevent="logout">
              Logout
            </b-nav-item>

            <!--
            <b-nav-item-dropdown right>
              Using 'button-content' slot
              <template #button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown> -->
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      links_noLoggedIn: [
        {
          id: "login",
          name: "LOG IN",
          path: "/login",
        },
      ],
      links_isLoggedIn: [
        {
          id: "documents",
          name: "Documents",
          path: "/documents",
        },
      ],
      username: "",
    };
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.state.user;
    },
    isAdmin: function() {
      let i = this.$store.state.roles.includes("ROLE_ADMIN");
      return i;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>
