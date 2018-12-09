<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018 Jongjin Lim </span>
      <a href="#" @click.stop.prevent="showModalpopup('로그인','login'); changeBodyStyle();">로그인 팝업</a>
    </p>
    <!-- modal popup -->
    <modal-popup v-if="showModal" @close="showModal=false; changeBodyStyle();" :modalOpened="showModal" />
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
      this.changeBodyStyle();
    });

    this.$EventBus.$on('close', () => {
      this.showModal = !this.showModal;
      this.changeBodyStyle();
    });
  },

  computed:{

  },

  components:{
    "modal-popup": popup,

  },
  methods: {
    showModalpopup(title, componentName){
      this.showModal = true;
      this.$store.state.pop_title = title;
      this.$store.state.pop_content = componentName;
    },

    changeBodyStyle(){
      console.log('toShowModal', this.showModal)
      let $body = document.querySelector('body');
      if(this.showModal){
        $body.style.overflow ='hidden';
      }else{
        $body.style.overflow ='auto';
      }
    }
  }
}
</script>

