import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main";
import BoardPhoto from "@/components/board_photo/BoardPhoto";
import BoardCommunity from "@/components/board_community/BoardCommunity";
import Todo from "@/components/Todos";
import Contact from "@/components/ContactUs";
import DataGrid from "@/components/DataGrid";
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
      path: "/grid",
      name: "Grid",
      component: DataGrid
    },
    {
      path: "/contact",
      name: "ContactUs",
      component: Contact
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp
    }
  ]
});
