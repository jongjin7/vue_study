import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Example from "@/components/Example";
import Todo from "@/components/Todos";
import Datastore from "@/components/Datastore";
import Grid from "@/components/Grid";

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
      path: "/todo",
      name: "Todos",
      component: Todo
    },
    {
      path: "/datastore",
      name: "DataStore",
      component: Datastore
    },
    {
      path: "/grid",
      name: "gridTable",
      component: Grid
    }
  ]
});
