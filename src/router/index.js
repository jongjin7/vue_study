import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main";
import BoardPhoto from "@/components/BoardPhoto";
import BoardCommunity from "@/components/BoardCommunity";
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
      path: "/photo",
      name: "BoardPhoto",
      component: BoardPhoto
    },
    {
      path: "/community",
      name: "BoardCommunity",
      component: BoardCommunity
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
