import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main";
import Example from "@/components/Example";
import Todo from "@/components/Todos";
import Datastore from "@/components/Datastore";
import Grid from "@/components/Grid";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main
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
