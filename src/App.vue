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
  </div>
</template>

<script>

import header from "./components/frame/header.vue";
import footer from "./components/frame/footer.vue";

export default {
  name: "App",
  data() {
    return {};
  },
  created(){

  },
  methods:{

  },
  components: {
    "common-header": header,
    "common-footer": footer
  }
};
</script>

<style lang="scss">
  [v-cloack] {
    display: none;
  }

  .invalid-feedback{
    display: block;
  }

  ::placeholder { /* 파이어폭스 51+, 크롬 57+ */
    color:#888 !important;
  }
  :-ms-input-placeholder { /* 인터넷 익스플로러 10+ */
    color:#888 !important;
  }

</style>
