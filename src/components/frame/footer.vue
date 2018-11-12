<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018 Jongjin Lim </span>
      <a href="#" v-on:click.stop.prevent="showModal = true">로그인 팝업</a>
    </p>
    <!-- modal popup -->
    <modal-login v-if="showModal" @close="showModal = false"></modal-login>
  </footer>
</template>

<script>
import modalLogin from "./modalLogin.vue";
export default {
  name:'Footer',
  data() {
    return {
      showModal: false
    };
  },
  components:{
    "modal-login": modalLogin
  }
}
</script>

