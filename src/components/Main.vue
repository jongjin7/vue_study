<template>
  <div class="main">
    <about-banner />

    <div class="container mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="h4">새로운 소식</h2>
        <span class="text-secondary small">2개의 게시판에서 최신 게시물 추출</span>
      </div>

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

<style lang="scss" scoped>
  h2.h4{
    font-weight:bold;
  }
</style>
