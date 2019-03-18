<template>
  <div>
    <form class="" @submit.stop.prevent="submitSignUpMember">
      <div class="form-group">
        <label for="s-name">닉네임</label>
        <input type="text" class="form-control" id="s-name" autocomplete="off" autofocus placeholder="닉네임(별명)을 적어주세요" @focusout="checkName" v-model="name" required>
        <div class="invalid-feedback">{{ errorMessage.name}}</div>
      </div>
      <div class="form-group">
        <label for="s-email">이메일</label>
        <input type="email" class="form-control" id="s-email" autocomplete="off" placeholder="email@example.com" @focusout="checkEmail" v-model="email" required>
        <div class="invalid-feedback">{{ errorMessage.email}}</div>
      </div>
      <div class="form-group">
        <label for="s-password">비밀번호</label>
        <input type="password" class="form-control" id="s-password" autoComplete="off" placeholder="영문,숫자,특수문자가 조합된 7자리 이상" v-model="password" @focusout="checkPassword" required>
        <div class="invalid-feedback">{{ errorMessage.password }}</div>
      </div>
      <div class="form-group">
        <label for="s-password-re">비밀번호 확인</label>
        <input type="password" class="form-control" id="s-password-re" autoComplete="off" placeholder="영문,숫자,특수문자가 조합된 7자리 이상" v-model="passwordRe" @focusout="checkPasswordRe" required>
        <div class="invalid-feedback">{{ errorMessage.passwordRe }}</div>
      </div>
      <hr class="my-4">
      <button type="submit" class="btn btn-primary w-100">가입하기</button>
      <!--<button type="submit" class="btn btn-primary w-100">수정하기</button>-->
    </form>
  </div>
</template>

<script>
  export default {
    name: "SignUp",
    data(){
      return{
        name:'홍길동',
        email:'test@naver.com',
        password:'test!234',
        passwordRe:'test!234',
        errorMessage:{
          name:'',
          email:'',
          password:'',
          passwordRe:'',
        },
        isLogined:false,
      }
    },
    created(){

    },
    mounted(){

    },
    computed:{

    },
    methods:{
      checkName(){
        const blank_pattern = /^\s+|\s+$/g;
        const event = event || window.event;
        const strValue = this.name.trim();

        if( strValue.replace( blank_pattern, '' ) === "") {
          this.errorMessage.name = '닉네임(별명)을 입력하지 않았습니다.';
          event.target.focus();
        }else{
          this.errorMessage.name = "";
        }
      },

      checkEmail(){
        const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const blank_pattern = /^\s+|\s+$/g;
        const event = event || window.event;
        const strValue = this.email.trim();

        if( strValue.replace( blank_pattern, '' ) === "") {
          this.errorMessage.email = '이메일을 입력하지 않았습니다.';
          event.target.focus();
        }else if(strValue.replace( blank_pattern, '' ) !== "" && !regExp.test(this.email)){
          this.errorMessage.email = '이메일 형식에 맞춰서 입력해주세요';
          event.target.focus();
        }else{
          console.log('ok email', this.email)
          this.errorMessage.email = "";
        }

      },

      validatePassword(item){
        const regExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        return regExp.test(item);
      },

      checkPassword(){
        const blank_pattern = /^\s+|\s+$/g;
        const event = event || window.event;
        const strValue = this.password.trim();
        if(strValue.replace( blank_pattern, '' ) === "") {
          this.errorMessage.password = '비밀번호를 입력하지 않았습니다.';
          event.target.focus();
        }else if(strValue.replace( blank_pattern, '' ) !== "" && !this.validatePassword(strValue)){
          this.errorMessage.password = '비밀번호는 영문,숫자,특수문자(!@#$%^&)가 조합된 7자리 이상으로 정의하여야 합니다.';
          event.target.focus();
        }else{
          this.errorMessage.password = "";
        }
      },

      checkPasswordRe(){
        const blank_pattern = /^\s+|\s+$/g;
        const event = event || window.event;
        const strValue = this.passwordRe.trim();
        if(strValue.replace( blank_pattern, '' ) === "") {
          this.errorMessage.passwordRe = '비밀번호를 입력하지 않았습니다.';
          event.target.focus();
        }else if(strValue.replace( blank_pattern, '' ) !== "" && !this.validatePassword(strValue)){
          this.errorMessage.passwordRe = '비밀번호는 영문,숫자,특수문자(!@#$%^&)가 조합된 7자리 이상으로 정의하여야 합니다.';
          event.target.focus();
        }else{
          this.errorMessage.passwordRe = "";
        }
      },

      comparePassword(){
        console.log('comparePassword', this.password === this.passwordRe)
        return this.password === this.passwordRe
      },

      submitSignUpMember(){
        let vm = this;
        console.log('this.errorSubmitValidator')
        if(!this.comparePassword()){
          alert('입력하신 비밀번호가 일치하지 않습니다.')
          document.querySelector('#s-password-re').focus();
        }else{
          this.$setPersistence.then(()=>{
            return vm.$firebase.auth().createUserWithEmailAndPassword(vm.email, vm.password);
          }).then((user) => {
            console.log('이메일 가입 성공');
            let currentUser = vm.$firebase.auth().currentUser;
            currentUser.updateProfile({
              displayName:vm.name,
              photoURL:'https://ptetutorials.com/images/user-profile.png'
            }).then(function() {
              console.log('userName 업데이트 성공', currentUser);
              vm.$EventBus.$emit('onSaveUserIndexedDB', currentUser, false);
              vm.$EventBus.$emit('toggleClose');

              //인증 메일 발송
              //vm.$firebase.auth().useDeviceLanguage(); // 이메일 기기언어로 세팅

              // currentUser.sendEmailVerification().then(function() {
              //   console.log('인증메일 발송 성공')
              // }).catch(function(error) {
              //   console.error('인증메일 발송 에러', error);
              // });
            }).catch(function(error) {
              console.log(error)
            });
          }).catch(function(error) {
            //console.log('error', error)
            switch(error.code){
              case "auth/email-already-in-use":
                alert('이미 사용중인 이메일 입니다.');
                break;
              case "auth/invalid-email":
                alert('유효하지 않은 메일입니다')
                break;
              case "auth/operation-not-allowed":
                alert('이메일 가입이 중지되었습니다.')
                break;
              case "auth/weak-password":
                alert("비밀번호를 6자리 이상 필요합니다");
                break;
            }
          });

        }
      }
    },

  };
</script>


