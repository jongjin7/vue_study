<template>
  <div class="jumbotron">
    <h1 class="h3">접수 완료</h1>
    <p class="">
      고객님의 문의사항이 접수 되었습니다.
      최대한 빠른 시일 내에 답변 드리도록 하겠습니다.
    </p>
    <router-link class="btn btn-primary btn-sm" :to="link" role="button">메인으로 이동</router-link>
  </div>
</template>

<script>
  export default {
    name: "CompletedContactUs",
    data(){
      return{
        link:'/'
      }
    },
    created(){

    },
    methods:{

    }
  }
</script>
