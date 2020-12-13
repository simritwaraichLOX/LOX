import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import Documents from "../views/Documents.vue";
import Admin from "../views/Admin.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/documents",
    name: "documents",
    component: Documents,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: {
      requiresAuth: true,
      isAdmin: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (store.state.token) {
      if (to.matched.some((route) => route.meta.isAdmin)) {
        if (store.state.roles.includes("ROLE_ADMIN")) return next();

        return next("/");
      } else {
        return next();
      }
    }

    return next("/");
  }

  next();
});

export default router;
