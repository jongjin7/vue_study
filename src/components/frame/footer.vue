<template>
  <footer class="container">
    <p class="float-right"><a href="#">Back to top</a></p>
    <p>
      <span>© 2018-2019 Lim,Jongjin</span>
    </p>
    <!-- modal popup -->
    <modal-popup v-if="showModal" @toggleClose="showModal=false; changeBodyStyle();" :modalOpened="showModal" />
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
    this.$EventBus.$on('toggleClose', () => {
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
    changeBodyStyle(){
      //console.log('toShowModal', this.showModal)
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

