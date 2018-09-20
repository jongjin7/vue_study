import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Example from "@/components/Example";
import Minor from "@/components/Minor";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Hello",
      component: HelloWorld
    },
    {
      path: "/sub",
      name: "Example",
      component: Example
    },
    {
      path: "/minor",
      name: "Minor",
      component: Minor
    }
  ]
});
