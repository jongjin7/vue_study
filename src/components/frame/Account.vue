<template>
  <div class="d-inline-block align-middle logined" v-if="isLogined">
    <!--<button class="badge badge-light" @click="modifyUserInfo">회원정보 수정</button>-->
    <button class="badge badge-success" @click="logout">로그아웃</button>
    <span :style="'background-image: url(' + userPhoto + ');'" class="pic rounded-circle"></span>
    <small class="text-white" v-if="connectUser !== null">[ {{ connectUser }} ] 접속중...</small>
  </div>
  <div class="d-inline-block align-middle" v-else>
    <button class="badge badge-light badge" @click="signUp">회원가입</button>
    <button class="badge badge-success" @click="login">로그인</button>
  </div>
</template>
<script>
  import Constant from '../../common/Constant.js';
  export default {
    name:'Account',
    data(){
      return{
        isLogined:false,
        connectUser:null,
        userPhoto:null,
        userEmail:null,
      }
    },
    created(){
      this.connectMemberCheck();
    },
    methods:{
      showModalpopup(title, componentName){
        this.showModal = true;
        window.globalVars.pop_title = title;
        window.globalVars.pop_content = componentName;
        this.$EventBus.$emit('toggleClose');
      },

      saveToStorageMemInfo(name,email,photo){
        sessionStorage.setItem('memberInfo',JSON.stringify({
          name:  name,
          email: email,
          photo: photo
        }));
      },

      connectMemberCheck(){
        const vm = this;
        this.$firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log('signed in')
            // User is signed in.
            let userData ={
              name: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
              isAnonymous: user.isAnonymous,
              uid: user.uid,
              providerData: user.providerData
            }



            user.providerData.forEach(function (profile) {
              console.log("Sign-in provider: " + profile.providerId);
              console.log("  Provider-specific UID: " + profile.uid);
              console.log("  Name: " + profile.displayName);
              console.log("  Email: " + profile.email);
              console.log("  Photo URL: " + profile.photoURL);

              vm.isLogined = true;

              if(profile.providerId == 'password'){
                vm.$firebaseDB.collection('members').where('email','==',profile.email)
                  .onSnapshot(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                      vm.connectUser = doc.data().name;
                      vm.userEmail = doc.data().email;
                      vm.userPhoto = doc.data().photo;

                      vm.saveToStorageMemInfo(vm.connectUser, vm.userEmail, vm.userPhoto);
                    });
                  });
              }else if(profile.providerId =='google.com'){
                vm.connectUser = profile.displayName;
                vm.userEmail = profile.email;
                vm.userPhoto = profile.photoURL;

                vm.saveToStorageMemInfo(vm.connectUser, vm.userEmail, vm.userPhoto);
              }

            });

          } else {
            console.log('signed out!')
            // User is signed out.
            vm.isLogined = false;
            vm.email = null;
            vm.photo = null;
            vm.connectUser = null;
          }
        });

        this.$EventBus.$on('loginPop', this.login);
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
          if(location.hash.split('/')[1] == 'chat') vm.$router.push('/');
        }).catch(function(error) {
          // An error happened.
        });
      }

    }
  }
</script>
<style lang="scss" scoped>
  .logined{
    .pic{
      display: inline-block;
      width:20px; height:20px;
      background-size: cover;
      background-position: center center;
      background-repeat:no-repeat;
      vertical-align: middle;
    }
  }
  .badge{
    cursor: pointer;
    border:none;

    &:hover{
      opacity: 0.9;
    }
  }
</style>

