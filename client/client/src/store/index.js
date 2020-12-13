import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    token: "",
    user: null,
    id: null,
    roles: [],
  };
};

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.user;
    },
    getID: (state) => {
      return state.id;
    },
    getUserRoles: (state)=>{
      return state.roles;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_ROLES:(state, roles) =>{
      state.roles = roles;
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    login: ({ commit }, { token, user, id, roles }) => {
      commit("SET_TOKEN", token);
      commit("SET_USER", user);
      commit("SET_ID", id);
      commit("SET_ROLES", roles);
      // set auth header
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    logout: ({ commit }) => {
      commit("RESET", "");
    },
  },
});
