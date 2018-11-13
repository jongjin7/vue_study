<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018 Jongjin Lim </span>
      <a href="#" v-on:click.stop.prevent="showModal = true; app.currentContent = 'login'">로그인 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModal = true; app.currentContent = 'sample1';">/ 모달 1 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModal = true; app.currentContent = 'sample2';">/ 모달 2 팝업 </a>
    </p>
    <!-- modal popup -->
    <modal-popup v-if="showModal" @close="showModal=false"></modal-popup>
  </footer>
</template>

<script>
import popup from "./modalPopup.vue";
export default {
  name:'Footer',
  data() {
    return {
      showModal:false,
    };
  },

  components:{
    "modal-popup": popup
  }
}
</script>

