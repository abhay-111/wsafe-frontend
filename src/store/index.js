import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    loginUser(state, data) {
      console.log("login user", data);
    },
    registerUser(state, data) {
      console.log("register user", data);
    },
  },
  modules: {},
});
