<template>
  <div class="d-inline-block align-middle" v-if="isLogined">
    <!--<button class="badge badge-light" @click="modifyUserInfo">회원정보 수정</button>-->
    <button class="badge badge-success" @click="logout">로그아웃</button>
    <small class="text-white" v-if="connectUser !== null">[ {{ connectUser }} ] 접속중...</small>
  </div>
  <div class="d-inline-block align-middle" v-else>
    <button class="badge badge-light badge" @click="signUp">회원가입</button>
    <button class="badge badge-success" @click="login">로그인</button>
  </div>
</template>
<script>
export default {
  name:'Account',
  data(){
    return{
      isLogined:false,
      connectUser:null,
    }
  },
  created(){
    const vm = this;
    this.$firebase.auth().onAuthStateChanged(function(user) {
      console.log('account', user)


      if (user) {
        vm.isLogined = true;
        vm.connectUser = user.displayName;
      }else{
        vm.isLogined = false;
        vm.connectUser = null;
      }

    });


    this.$EventBus.$on('loginPop', this.login);

  },
  methods:{
    showModalpopup(title, componentName){
      this.showModal = true;
      window.globalVars.pop_title = title;
      window.globalVars.pop_content = componentName;
      this.$EventBus.$emit('toggleClose');
    },
    signUp(){
      this.showModalpopup('회원가입','singup');
    },
    modifyUserInfo(){
      this.showModalpopup('회원정보수정','modifyUserInfo');
    },
    login(){
      this.showModalpopup('로그인','login');
    },
    logout(){
      const vm = this;

      this.$firebase.auth().signOut().then(function() {
        alert('로그아웃 되었습니다.');
        sessionStorage.removeItem('memberInfo');
        if(location.hash) vm.$router.push('/');
      }).catch(function(error) {
        // An error happened.
      });
    }

  }
}
</script>
<style lang="scss" scoped>
 .badge{
   cursor: pointer;
   border:none;

   &:hover{
      opacity: 0.9;
    }
 }
</style>

