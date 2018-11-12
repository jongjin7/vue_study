<template>
  <div class="dropdown" :class="{ show: showGnb }">
    <button class="navbar-toggler" type="button" data-toggle="collapse" @click="showGnb = !showGnb">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="" class="dropdown-menu" v-bind:class="{ show: showGnb }">
      <a class="dropdown-item" href="111111" v-on:click="clickSubMenu">Menu1</a>
      <a class="dropdown-item" href="2222" @click.stop.prevent="showGnb = false">Menu2</a>
      <a class="dropdown-item" href="http://www.naver.com" target="_blank" v-on:click.stop.prevent="clickSubMenu">Menu3</a>
      <hr class="dropdown-divider">
      <a class="dropdown-item" href="#">subMenu1</a>
      <a class="dropdown-item" href="#">subMenu2</a>
    </div>
  </div>
</template>
<script>
export default {
  name:'quickMenu',
  data(){
    return{
      gotoMainLink: "/",
      showGnb: false,
    }
  },
  methods:{
    clickSubMenu : function(e){
      console.log(e.target)
      this.showGnb = false
    },
  }
}
</script>
<style scoped>
  .dropdown-menu{
    left:auto;
    right:-30px;
  }
</style>

