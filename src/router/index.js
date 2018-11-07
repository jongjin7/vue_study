import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main";
import Board from "@/components/Board";
import Todo from "@/components/Todos";
import Contact from "@/components/ContactUs";
import Grid from "@/components/Grid";
import SignUp from "@/components/SignUp";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main
    },
    {
      path: "/board",
      name: "Board",
      component: Board
    },
    {
      path: "/todo",
      name: "Todos",
      component: Todo
    },
    {
      path: "/contact",
      name: "ContactUs",
      component: Contact
    },
    {
      path: "/grid",
      name: "Grid",
      component: Grid
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp
    }
  ]
});
