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
      <a href="#" class="d-block mr-3">* 회원가입을 해요.</a>
      <a href="#" class="d-block text-danger">* 비밀번호를 잃어버렸어요.</a>
    </div>
    <hr class="mb-4">
    <!-- SNS Login -->
    <h3 class="h5">SNS 로그인</h3>
    <div class="login-wrap">
      <a id="kakao-login-btn" v-show="!iskakaoLogined"></a>
      <a href="#" @click.stop.prevent="kakaoLogout();" v-show="iskakaoLogined">카카오 로그아웃</a>
    </div>

    <a id="kakao-link-btn" href="javascript:;">
      <img src="//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"/>
    </a>
  </div>
</template>

<script>

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
    },
    methods:{
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


