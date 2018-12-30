<template>
  <div class="mb-5">
    <h1 class="mb-4">기타 학습</h1>
    <h2>1. Vuex 라이브러리 사용</h2>
    <Vuex />
  </div>
</template>
<script>
  import Vuex from './Vuex.vue';
  export default{
    name:'Etc',
    components:{
      Vuex,
    }
  }
</script>
