<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018 Jongjin Lim </span>
      <a href="#" v-on:click.stop.prevent="showModalpopup('로그인','login');">로그인 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModalpopup('모달 첫번째','sample1');">/ 모달 1 팝업</a>
      <a href="#" v-on:click.stop.prevent="showModalpopup('모달 두번째','sample2');">/ 모달 2 팝업 </a>
    </p>
    <!-- modal popup -->
    <modal-popup v-if="showModal" @close="showModal=false" />
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
    showModalpopup(title, componentName){
      this.showModal = true;
      this.$store.state.pop_title = title;
      this.$store.state.pop_content = componentName;
    }
  }
}
</script>

