import Vue from "vue";
import Router from "vue-router";

import Main from "@/components/Main";
import BoardPhoto from "@/components/board_photo/BoardPhoto";
import BoardCommunity from "@/components/board_community/BoardCommunity";
import BoardCommunityDetail from "@/components/board_community/BoardCommunityDetail";
import BoardCommunityWrite from "@/components/board_community/BoardCommunityWrite";
import DataGrid from "@/components/data_grid/DataGridMain";
import Todo from "@/components/etc/Todos";
import Contact from "@/components/etc/ContactUs";
import SignUp from "@/components/members/SignUp";

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
      path: "/community_detail",
      name: "BoardCommunityDetail",
      component: BoardCommunityDetail
    },
    {
      path: "/community_editor",
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
    }
  ]
});
