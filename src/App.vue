<template>
  <div id="app">
    <common-header></common-header>
    <main>
      <div class="container">
        <router-view/>
        <hr class="featurette-divider">
      </div>
    </main>
    <common-footer></common-footer>

    <common-modal v-if="showModal" @close="showModal = false">
    </common-modal>
    
    <button class="btn btn-primary" v-on:click="showModal = true">로그인 팝업</button>
  </div>
</template>

<script>
import header from "./components/frame/header.vue";
import footer from "./components/frame/footer.vue";
import modal from "./components/frame/modal.vue"; 

export default {
  name: "App",
  data() {
    return {
      showModal: false
    };
  },
  components: {
    "common-header": header,
    "common-footer": footer,
    "common-modal": modal
  }
};
</script>
