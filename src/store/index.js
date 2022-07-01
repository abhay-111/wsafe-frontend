import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";
Vue.use(Vuex);
const BASE_URL = "https://intense-savannah-60242.herokuapp.com/";
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
              localStorage.setItem("email", res.data.user.email);
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
              Cookie.set("access-token", res.data.user.token);
              Cookie.set("name", res.data.user.name);
              Cookie.set("email", res.data.user.email);
              localStorage.setItem("email", res.data.user.email);
              Cookie.set("userId", res.data.user.userId);
              localStorage.setItem("access-token", res.data.user.token);
              localStorage.setItem("showHelper", true);
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
    forgotPassword(state, data) {
      const sendData = {
        email: data,
      };
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}auth/forgotPassword`,
          data: sendData,
        })
          .then((res) => {
            console.log(res);
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
    createNewPassword(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}auth/createNewPassword`,
          data: data,
        })
          .then((res) => {
            console.log(res);
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
    addMarker(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `${BASE_URL}user/addMarker`,
          data: data,
        })
          .then((res) => {
            console.log(res);
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
    getAllMarkers(state) {
      console.log(state);
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: `${BASE_URL}user/getAllMarkers`,
        })
          .then((res) => {
            console.log(res);
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
    deleteMarker(state, data) {
      console.log(state, data);
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: `${BASE_URL}user/deleteMarker/${data}`,
        })
          .then((res) => {
            console.log(res);
            if (res.status == 204) {
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
