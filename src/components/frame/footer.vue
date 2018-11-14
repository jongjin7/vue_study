<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018 Jongjin Lim </span>
      <a href="#" v-on:click.stop.prevent="showModalpopup('login');">로그인 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModalpopup('sample1');">/ 모달 1 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModalpopup('sample2');">/ 모달 2 팝업 </a>
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
  created(){
    this.$EventBus.$on('showModal', () =>{
      this.showModal = !this.showModal;
    })
  },

  components:{
    "modal-popup": popup
  },
  methods: {
    showModalpopup(content){
      this.showModal = true;
      this.$store.state.pop_content = content;
    }
  }
}
</script>

