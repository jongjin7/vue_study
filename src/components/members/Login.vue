<template>
  <div>
    <form class="">
      <div class="form-group">
        <label for="login-emial">이메일</label>
        <input type="email" name="inp-login" class="form-control" id="login-emial" autocomplete="email" placeholder="email@example.com" required>
      </div>
      <div class="form-group">
        <label for="login-password">비밀번호</label>
        <input type="password" name="inp-login" class="form-control" id="login-password" autoComplete="login-password" placeholder="Password"  required>
      </div>
      <div class="custom-control custom-checkbox mb-3">
        <input id="chk-save-email" name="save-email" type="checkbox" class="custom-control-input" checked="">
        <label class="custom-control-label" for="chk-save-email">이메일 주소 기억하기</label>
      </div>
      <button type="submit" class="btn btn-primary w-100">로그인</button>
    </form>

    <div class="pt-4 d-md-flex">
      <a href="#" class="d-block mr-3">* 회원가입 하기</a>
      <a href="#" class="d-block text-danger">* 비밀번호 찾기</a>
    </div>
    <hr class="">
    <!-- SNS Login -->
    <h3 class="h6 text-center pb-2">✓ SNS 로그인</h3>
    <div class="login-wrap">
      <a id="kakao-login-btn" v-show="!iskakaoLogined"></a>
      <a href="#" @click.stop.prevent="kakaoLogout();" v-show="iskakaoLogined">카카오 로그아웃</a>
    </div>
<div id="firebaseui-auth-container"></div>
    <a id="kakao-link-btn" href="javascript:;">
      <img src="//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"/>
    </a>
  </div>
</template>

<script>
  import 'firebaseui/dist/firebaseui.css';
  export default {
    name: "Login",
    data(){
      return{
        loginKakaoTokken: this.$store.state.loginTokken,
        iskakaoLogined:false
      }
    },
    created(){

    },
    mounted(){
      this.kakaoLogin();
      this.login()
    },
    methods:{
      login(){
        console.log('login!!! ', this.$firebaseUi)

        //익명 사용자 업그레이드
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
            this.$firebase.auth.EmailAuthProvider.PROVIDER_ID,
            //firebase.auth.PhoneAuthProvider.PROVIDER_ID
          ],
        }

        this.$firebaseUi.start('#firebaseui-auth-container', uiConfig);
      },
      closePopup(){
        this.$EventBus.$emit('showModal');
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
          Kakao.Auth.createLoginButton({
            container: '#kakao-login-btn',
            success: function (authObj) {
              alert(JSON.stringify(authObj));
              sessionStorage.kakaoTokken = authObj.access_token;
              that.loginKakaoTokken = authObj.access_token;
              that.iskakaoLogined = true;
             // that.closePopup();
            }, fail: function (err) {
              alert(JSON.stringify(err));
            }
          });
        }

        Kakao.Link.createDefaultButton({
          container: '#kakao-link-btn',
          objectType: 'feed',
          content: {
            title: '딸기 치즈 케익',
            description: '#케익 #딸기 #삼평동 #카페 #분위기 #소개팅',
            imageUrl: 'http://mud-kage.kakao.co.kr/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
            link: {
              mobileWebUrl: 'https://developers.kakao.com',
              webUrl: 'https://developers.kakao.com'
            }
          },
          social: {
            likeCount: 286,
            commentCount: 45,
            sharedCount: 845
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: 'https://developers.kakao.com',
                webUrl: 'https://developers.kakao.com'
              }
            },
            {
              title: '앱으로 보기',
              link: {
                mobileWebUrl: 'https://developers.kakao.com',
                webUrl: 'https://developers.kakao.com'
              }
            }
          ]
        });
      }
    }

  };
</script>
<style scoped lang="scss">
  #firebaseui-auth-container{
    border:1px solid red;
  }
  .firebaseui-card-content{
    border:1px solid blue;
    padding:0;
  }
  .firebaseui-idp-buttonn{
    max-width:none;
  }
</style>


