import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
Vue.use(VueRouter);

const routes = [
  {
    name: "Home",
    component: HomeView,
    path: "/",
  },
  {
    name: "Dashboard",
    component: DashboardView,
    path: "/dashboard",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
