import Vue from "vue";
import Router from "vue-router";

import Main from "@/components/Main";
import BoardPhoto from "@/components/board_photo/BoardPhoto";
import BoardCommunityList from "@/components/board_community/BoardCommunityList";
import BoardCommunityDetail from "@/components/board_community/BoardCommunityDetail";
import BoardCommunityWrite from "@/components/board_community/BoardCommunityWrite";
import DataGrid from "@/components/data_grid/DataGridMain";
import Todo from "@/components/etc/Todos";
import Contact from "@/components/etc/ContactUs";
import SignUp from "@/components/members/SignUp";
import Etc from "@/components/etc/Etc";

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
      name: "BoardCommunityList",
      component: BoardCommunityList
    },
    {
      path: "/community-detail/:userId",
      name: "BoardCommunityDetail",
      component: BoardCommunityDetail
    },
    {
      path: "/community-write",
      name: "BoardCommunityWrite",
      component: BoardCommunityWrite
    },
    {
      path: "/todo",
      name: "Todos",
      component: Todo
    },
    {
      path: "/grid",
      name: "DataGrid",
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
    },
    {
      path: "/etc",
      name: "Etc",
      component: Etc
    }
  ]
});
