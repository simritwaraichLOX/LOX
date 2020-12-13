import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import Axios from "axios";
import BootstrapVue from "bootstrap-vue";
// import "bootswatch/dist/lux/bootstrap.css";
import "bootstrap/dist/css/bootstrap.css";
import Vuelidate from "vuelidate";

import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Vuelidate);

// set auth header
Axios.defaults.headers.common["Authorization"] = `Bearer ${store.state.token}`;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
