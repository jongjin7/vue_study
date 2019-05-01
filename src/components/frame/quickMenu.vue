<template>
  <div class="dropdown" :class="{ show: isOpenMenu }">
    <button class="navbar-toggler" type="button" data-toggle="collapse" @click="isOpenMenu=!isOpenMenu" @focusout="closeGnb" >
      <font-awesome-icon icon="bars"  />
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
          title: "웹 메신저",
          link: "/chat",
        },
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

  },
  components:{

  }
}
</script>
<style scoped lang="scss">
  .dropdown-menu{
    left:auto;
    right:-5px;
  }
  .navbar-toggler{
    border:none;
    font-size: 1.5rem;
    margin-right:-0.75rem;
    color:#fff;
    svg{
      width: 1em;
    }
  }
  .router-link-active{
    background-color: #e9e9e9;
  }
</style>

