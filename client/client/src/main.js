import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import Axios from "axios";
import BootstrapVue from "bootstrap-vue";
import "bootswatch/dist/lux/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

// set auth header
Axios.defaults.headers.common["Authorization"] = `Bearer ${store.state.token}`;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
