<template>
  <div class="jumbotron text-center">
    <h1 class="h2 font-weight-bold">접수 완료</h1>
    <p class="py-3">
      고객님의 문의사항이 접수 되었습니다.<br>
      최대한 빠른 시일 내에 답변 드리도록 하겠습니다.
    </p>
    <router-link class="btn btn-primary" :to="link" role="button">메인으로 이동</router-link>
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
