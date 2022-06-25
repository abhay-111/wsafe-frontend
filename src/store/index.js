import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";
Vue.use(Vuex);
const BASE_URL = "http://localhost:5000/";
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    loginUser(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}auth/login`,
          data: data,
        })
          .then((res) => {
            if (res.status == 200) {
              Cookie.set("access-token", res.data.user.token);
              Cookie.set("name", res.data.user.name);
              Cookie.set("email", res.data.user.email);
              Cookie.set("userId", res.data.user.userId);
              localStorage.setItem("access-token", res.data.user.token);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    registerUser(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}auth/register`,
          data: data,
        })
          .then((res) => {
            if (res.status == 200) {
              console.log(res);
              Cookie.set("access-token", res.data.user.token);
              Cookie.set("name", res.data.user.name);
              Cookie.set("email", res.data.user.email);
              Cookie.set("userId", res.data.user.userId);
              localStorage.setItem("access-token", res.data.user.token);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    sendOtp(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}auth/sendOtp`,
          data: data,
        })
          .then((res) => {
            if (res.status == 200) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    verifyOtp(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}auth/verifyOtp`,
          data: data,
        })
          .then((res) => {
            if (res.status == 200) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
  modules: {},
});
