// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";

const base = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});
Vue.prototype.$http = base;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

Vue.prototype.app = {};
app.currentContent = null;
app.showModal = false;


Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  data: {

  }
});
