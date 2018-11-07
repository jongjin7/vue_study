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
  components: {
    "common-header": header,
    "common-footer": footer
  }
};
</script>
