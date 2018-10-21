<template>
  <section class="main text-center">
    <about-banner />

    <div class="container mb-4">
      <h2 class="title">최신 게시물</h2>
      <latest-list />
    </div>
    
    <div class="container mb-4">
      <h2 class="title">전체 Links</h2>
      <app-all-link />
    </div> 
  </section>
</template>

<script>
import aboutBanner from "./main/bannerAbout.vue";
import latestList from "./main/latestList.vue";
import appAllLink from "./main/appAllLink.vue";

export default {
  name: "Main",
  data() {
    return {};
  },
  methods: {},
  create: function() {},
  components: {
    "about-banner": aboutBanner,
    "latest-list": latestList,
    "app-all-link": appAllLink
  }
};
</script>

<style lang="scss">
.main{
  .jumbotron {
    padding: 2rem;
    h1 {
      color: green;
      border: 1px solid red;
      .name {
        display: block;
        color: blue;
        font-weight: bold;
      }
    }
    p{
      margin-bottom:0;
    }
  }

  .list-group-item{
    p {
      margin-bottom:0; 
    } 
  }
}
</style>
