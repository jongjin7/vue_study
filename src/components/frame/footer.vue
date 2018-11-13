<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018 Jongjin Lim </span>
      <a href="#" v-on:click.stop.prevent="showModal = true">로그인 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModal = true; app.currentContent = 'smaple1';">로그인 1 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModal = true; app.currentContent = 'smaple2';">로그인 2 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModal = true; app.currentContent = 'smaple3';">로그인 3 팝업</a>
    </p>
    <!-- modal popup -->
    <modal-popup-login v-if="showModal" @close="showModal=false"></modal-popup-login>
  </footer>
</template>

<script>
import popup from "./modalPopup.vue";
export default {
  name:'Footer',
  data() {
    return {
      showModal: false,
    };
  },
  components:{
    "modal-popup-login": popup
  }
}
</script>

