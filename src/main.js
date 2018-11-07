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

Vue.config.productionTip = false;

Vue.component("select2", {
  props: ["options", "value"],
  template: "#select2-template",
  mounted: function() {
    var vm = this;
    $(this.$el)
      // init select2
      .select2({ data: this.options })
      .val(this.value)
      .trigger("change")
      // emit event on change.
      .on("change", function() {
        vm.$emit("input", this.value);
      });
  },
  watch: {
    value: function(value) {
      // update value
      $(this.$el)
        .val(value)
        .trigger("change");
    },
    options: function(options) {
      // update options
      $(this.$el)
        .empty()
        .select2({ data: options });
    }
  },
  destroyed: function() {
    $(this.$el)
      .off()
      .select2("destroy");
  }
});

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  data: {
    selected: 2,
    options: [{ id: 1, text: "Hello" }, { id: 2, text: "World" }]
  }
});
