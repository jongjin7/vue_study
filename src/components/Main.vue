<template>
  <div class="main">
    <about-banner />

    <div class="container mb-4">
      <h2 class="h4">새로운 소식</h2>
      <latest-list />
    </div>

    <div class="container mb-4">
      <h2 class="h4">전체 페이지 보기</h2>
      <app-all-link />
    </div>
  </div>
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
  create() {
    //console.log('main에서 시작하는 순간')
  },
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
<style scoped>
  h2.h4{
    font-weight:bold;
  }
</style>
