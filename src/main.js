// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";

import axios from "axios";

const base = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});
Vue.prototype.$http = base;
Vue.prototype.$EventBus = new Vue();
Vue.config.productionTip = false;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "datatables/media/css/jquery.dataTables.css";
import "datatables/media/js/jquery.dataTables.js";
import "chart.js";

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",

});


