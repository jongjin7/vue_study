<template>
    <div class="text-center py-4">
      <h1>챗팅!</h1>
      <h2 class="h6">Vuex를 이용한 챗팅방입니다.</h2>
    </div>
</template>

<script>
  export default {
    name: "Gate",
    data(){
      return{
        isLogined:false,
        memberInfo : JSON.parse(sessionStorage.getItem(STORAGE_KEY_MEMBER_INFO))
      }
    },
    created(){

      console.log('sesstionStorage', this.memberInfo);
      console.log('window vars', window.globalVars.memberInfo);

      if(this.memberInfo){
        //let userData = window.globalVars.loginedUser;
        console.log(this.memberInfo.name)
        this.$router.push('/chat-room')
      }else{
        alert('로그인이 필요합니다.')
      }

    },
  }
</script>

<style scoped>

</style>
