<template>
    <div class="text-center py-4">
      <h1>챗팅!</h1>
      <h2 class="h6">Vuex를 이용한 챗팅방입니다.</h2>
    </div>
</template>

<script>
  export default {
    name: "Gate",
    created(){
      let loginInfo = sessionStorage.getItem('loginedUser');
      console.log('gate logininfo', loginInfo)
      if(window.globalVars.loginedUser){
        //let userData = window.globalVars.loginedUser;
        console.log(userData.name)
      }else{
        alert('로그인이 필요합니다.')
      }

    },
  }
</script>

<style scoped>

</style>
