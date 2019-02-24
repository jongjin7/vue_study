<template>
  <div class="pop-login-content">
    <form class="" @submit.stop.prevent="generalLogin">
      <div class="form-group">
        <label for="login-email">이메일</label>
        <input type="email" name="inp-login" class="form-control" id="login-email" autocomplete="off" autofocus placeholder="email@example.com" @focusout="checkEmail" v-model="email">
        <div class="invalid-feedback">{{ errorMessage.email}}</div>
      </div>
      <div class="form-group">
        <label for="login-password">비밀번호</label>
        <input type="password" name="inp-login" class="form-control" id="login-password" autoComplete="off" placeholder="Password" v-model="password" @focusout="checkPassword">
        <div class="invalid-feedback">{{ errorMessage.password }}</div>
      </div>
      <div class="custom-control custom-checkbox mb-3 save-email-chkbox">
        <input id="chk-save-email" name="save-email" type="checkbox" class="custom-control-input" v-model="userSaveEmail" :disabled="compareEmail" @change="checkSaveEmail">
        <label class="custom-control-label" for="chk-save-email">이메일 주소 저장하기</label>
      </div>
      <button type="submit" class="btn btn-primary w-100">로그인</button>
    </form>

    <!--<div class="pt-4 d-md-flex">
      <a href="#" class="mr-3" @click.stop.prevent="singUp">* 회원가입 하기</a>
      <a href="#" class="text-danger">* 비밀번호 찾기</a>
    </div>-->
    <hr class="">
    <!-- SNS Login -->
    <h3 class="h6 text-center pb-2">✓ SNS 로그인</h3>
    <div id="firebaseui-auth-container"></div>

    <!--<div class="login-wrap d-none">
      <a id="custom-login-btn" href="#" @click.stop.prevent="kakaoLogin" v-show="!iskakaoLogined">
        <img src="//mud-kage.kakao.com/14/dn/btqbjxsO6vP/KPiGpdnsubSq3a0PHEGUK1/o.jpg" width="100%"/>
      </a>
      <a href="#" @click.stop.prevent="kakaoLogout" v-show="iskakaoLogined">카카오 로그아웃</a>
    </div>-->


  </div>
</template>

<script>


  let hasEmailName ='hasLoginEmail';
  let userData = localStorage.getItem(hasEmailName);
  let userEmailData = JSON.parse(userData);

  import 'firebaseui/dist/firebaseui.css';
  export default {
    name: "Login",
    data(){
      return{
        email:'test@naver.com',
        password:'test!234',
        oldEmail: userEmailData,
        userSaveEmail:false,
        errorMessage:{
          email:'',
          password:'',
        },
        activeCheckBox:false,
        errorSubmitValidator:false,
        //loginKakaoTokken: this.$store.state.loginTokken,
        //iskakaoLogined:false,

      }
    },
    created(){
      console.log('create')

      this.fetchData();
    },
    mounted(){
      this.googleAuthLogin()
    },
    computed:{
      compareEmail(){
        return this.oldEmail === this.email
      }
    },
    methods:{
      singUp(){
        console.log('login signup')
      },

      fetchData(){
        if(userData !== null){
          this.email = this.oldEmail;
        }
      },
      checkSaveEmail(){
        console.log('checkSaveEmail', this.compareEmail)
        if(this.compareEmail) return true;

        if(this.userSaveEmail) { //체크값이 true일때
          //alert('이메일 주소를 저장하시겠습니까?');
          localStorage.setItem(hasEmailName, JSON.stringify(this.email));
        }else{
          localStorage.removeItem(hasEmailName);
        }
      },

      checkEmail(){
        const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const blank_pattern = /^\s+|\s+$/g;
        const event = event || window.event;

        if( this.email.replace( blank_pattern, '' ) == "") {
          this.errorMessage.email = '이메일을 입력하지 않았습니다.';
          this.errorSubmitValidator = true;
          event.target.focus();
        }else if(this.email.replace( blank_pattern, '' ) != "" && !regExp.test(this.email)){
          this.errorMessage.email = '이메일 양식에 맞춰서 입력해주세요';
          this.errorSubmitValidator = true;
          event.target.focus();
        }else{
          this.errorMessage.email = "";
          this.errorSubmitValidator = false;
        }

      },

      checkPassword(){
        const blank_pattern = /^\s+|\s+$/g;
        const event = event || window.event;
        if( this.password.replace( blank_pattern, '' ) == '') {
          this.errorMessage.password = '비밀번호를 입력하지 않았습니다.';
          this.errorSubmitValidator = true;
          event.target.focus();
        }else{
          this.errorMessage.password = "";
          this.errorSubmitValidator = false;
        }
      },

      checkSubmitValidate(){
        console.log('checkValidate')
        this.checkEmail();
        this.checkPassword();
      },

      generalLogin(){
        const vm = this;
        this.checkSubmitValidate();
        console.log('generalLogin', this.errorSubmitValidator)
        if(!this.errorSubmitValidator){ //전체 폼에 에러가 없다면
          this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(()=>{
              console.log('구글 이메일/비밀번호 로그인 접속')
              vm.$EventBus.$emit('toggleClose');
              if(location.hash.split('/')[1] == 'chat') window.location.reload(true);
            })
            .catch(function(error) {
              console.log('접속에러', error.code, error.message)
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(error)
              vm.errorMessage.password = '유효하지 않거나 잘못된 비밀번호입니다.';
            });
        }

      },

      googleAuthLogin(){
        console.log('firebase.auth.Auth ', this.$firebaseUi)

        // 익명 사용자 업그레이드
        // Temp variable to hold the anonymous user data if needed.
        let data = null;
        // Hold a reference to the anonymous current user.
        let anonymousUser = this.$firebase.auth().currentUser;

        let uiConfig = {
          callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
              // User successfully signed in.
              // Return type determines whether we continue the redirect automatically
              // or whether we leave that to developer to handle.
              return true;
            },
            uiShown: function () {
              // The widget is rendered.
              // Hide the loader.
              //document.getElementById('loader').style.display = 'none';
            }
          },
          signInFlow: 'popup',
          autoUpgradeAnonymousUsers: false, //익명사용자 로그인 업그레이드
          signInSuccessUrl: '/',
          signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            this.$firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            //this.$firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            //firebase.auth.GithubAuthProvider.PROVIDER_ID,
            //this.$firebase.auth.EmailAuthProvider.PROVIDER_ID,
            //firebase.auth.PhoneAuthProvider.PROVIDER_ID
          ],
        }

        this.$firebaseUi.start('#firebaseui-auth-container', uiConfig);
      },

      kakaoLogout(){
        let that = this;
        Kakao.Auth.logout(function() {
          console.log('로그아웃 후 호출할 콜백 함수!!')
          sessionStorage.removeItem('kakaoTokken');
          that.loginKakaoTokken = null;
          Kakao.Auth.cleanup();
          that.iskakaoLogined =false;
          that.kakaoLogin();
        });
      },
      kakaoLogin(){
        let that = this;
        if(sessionStorage.kakaoTokken !== undefined){
          that.iskakaoLogined = true;
          that.loginKakaoTokken = Kakao.Auth.getAccessToken();
        }

        console.log('::before::','SessionStorageTokken:'+ sessionStorage.kakaoTokken, ' appTokken:'+ this.loginKakaoTokken);
        if(!this.iskakaoLogined){
          Kakao.Auth.login({
            success: function(authObj) {
              alert(JSON.stringify(authObj));
              sessionStorage.kakaoTokken = authObj.access_token;
              that.loginKakaoTokken = authObj.access_token;
              that.iskakaoLogined = true;
            },
            fail: function(err) {
              alert(JSON.stringify(err));
            }
          });

        }
      }
    }

  };
</script>
<style lang="scss">
.pop-login-content{
  .save-email-chkbox{
    input{
      &:disabled + label{
        opacity: 0.5;
      }
    }
  }
  #firebaseui-auth-container{
  }
  .firebaseui-card-content{
    padding:0;
  }
  .firebaseui-idp-button{
    max-width:none;
    width: 100%;
    height: 49px;
    border-radius:0.3rem;
    box-shadow:0 0 0.5rem rgba(black,0.2);

    &.firebaseui-idp-google{

    }

    &:hover{
      box-shadow:0 0 0.5rem rgba(black,0.3);
    }
  }
}

</style>


