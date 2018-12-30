<template>
  <div class="dropdown" :class="{ show: isOpenMenu }">
    <button class="navbar-toggler" type="button" data-toggle="collapse" @click="isOpenMenu=!isOpenMenu" @focusout="closeGnb" >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="" class="dropdown-menu" v-bind:class="{ show: isOpenMenu }">
      <router-link class="dropdown-item" :to="item.link" v-for="(item, index) in gnbItems" :key="index">{{ item.title }}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name:'quickMenu',
  data(){
    return{
      gotoMainLink: "/",
      isOpenMenu:false,
      gnbItems:[
        {
          title: "todo 심플앱",
          link: "/todo",
        },
        {
          title: "갤러리 게시판",
          link: "/photo",
        },
        {
          title: "커뮤니티 게시판",
          link: "/community",
        },
        {
          title: "데이타 그리드",
          link: "/grid",
        },
      ],

    }
  },
  methods:{
    closeGnb(){
      const vm = this;
      setTimeout(function(){
        vm.isOpenMenu = false;
      },100);
    },

  }
}
</script>
<style scoped>
  .dropdown-menu{
    left:auto;
    right:-30px;
  }
  .router-link-active{
    background-color: #e9e9e9;
  }
</style>

