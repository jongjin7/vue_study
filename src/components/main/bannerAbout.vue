<template>
  <div class="jumbotron">
    <h1><span class="name">{{ msg }}</span>님! 안녕하세요.<br>접속을 환영합니다.</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for 
    calling extra attention to featured content or information.</p>
  </div>
</template>
<script>
export default {
  name: "bannerAbout",
  data() {
    return {
      msg: "홍길동"
    };
  }
};
</script>
