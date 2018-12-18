<template>
  <div class="mb-5">
    <h1 class="mb-4">Contact Us</h1>
    <form id="contactForm" novalidate="true">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="ct-name">이름</label>
            <input type="text" id="ct-name" class="form-control" name="name" placeholder="이름을 입력하세요" required="" autocomplete="off" v-model="name">
            <div class="invalid-feedback">{{ errorMessage.name}}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group has-error">
            <label for="ct-email">이메일</label>
            <input type="text" id="ct-email" placeholder="이메일 주소를 입력하세요" class="form-control" name="name" required="" autocomplete="off" v-model="email"  @focusout="checkEmail">
            <div class="invalid-feedback">{{ errorMessage.email }}</div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <label for="ct-subject">제목</label>
            <input type="text" id="ct-subject" placeholder="제목을 입력하세요" class="form-control" required="" autocomplete="off" v-model="subject" @keyup ="testKeyup" @focusout="checkSubject">
            <div class="invalid-feedback">{{ errorMessage.subject }}</div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <label for="ct-message">내용</label>
            <textarea id="ct-message" class="form-control" placeholder="문의하실 내용(HTML 태그 사용 불가)을 입력하세요" rows="11" required="" autocomplete="off" v-model="message" @keyup ="checkMessage" @focusout="checkMessage"></textarea>
            <div class="invalid-feedback">{{ errorMessage.message }}</div>
          </div>
          <div class="submit-button text-center">
            <button class="btn btn-lg btn-common" :class="{'btn-secondary disabled': !statusValidation, 'btn-primary': statusValidation}" id="submit" type="button"  @submit.stop.prevent="checkForm" >
              <span v-if="!isLogined">로그인이 필요합니다.</span>
              <span v-else>문의사항 보내기</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ContactUs",
  data() {
    return {
      name:'임종진',
      email:null,
      subject:null,
      message:null,
      statusValidation:true,
      isLogined: true,
      isCheckForm:true,

      validator:'',
      errors:[],
      errorMessage:{
        name:'',
        email:'',
        subject:'',
        message:''
      },
      validatorError:false,

    };
  },

  beforeCreate(){

  },

  created() {

  },

  computed: {
    chkFromValidaton:function(){
      console.log('computed validator')
    }
  },

  watch: {
    validator:function(){
      //chkFromValidaton()
    }
  },
  methods: {
    checkForm(){
      console.log('checkForm')
      if(this.name && this.email) return;

      this.errorMessage.name ='';
      this.errorMessage.email ='';
      this.errorMessage.subject ='';
      this.errorMessage.message ='';

      //if(!this.name) this.errorMessage.name="가입하신 이름을 입력하세요";
      //if(!this.email) this.errorMessage.email="이메일 입력 형식(sample@email.com)을 확인하세요";
      this.checkEmail();
      //if(!this.subject) this.errorMessage.subject="제목을 입력하세요";
      //if(!this.message) this.errorMessage.message="내용을 입력하세요";
    },
    removeChar : function(){
      event = event || window.event;
      var keyID = (event.which) ? event.which : event.keyCode;
      console.log('keyID', keyID)
      if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) //8:backspace, 46:delete, 37: arrowLeft, 39:arrowRight
        return;
      else

        //this.email="";
        event.target.value = event.target.value.replace(/[^0-9]/g, "");
    },

    checkEmail : function(){
      const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      const event = event || window.event;

      if( this.email == null) {
        this.isCheckForm = false;
        this.errorMessage.email = '이메일을 입력하지 않았습니다.';
        //event.target.focus();
      }else if(this.email != null && !regExp.test(this.email)){
        this.isCheckForm = false;
        this.email = null;
        this.errorMessage.email = '입력을 똑바로 하세요';

        event.target.focus();
      }else{
        this.errorMessage.email = "";
      }
    },

    checkSubject(){
      const event = event || window.event;
      console.log('checkSubject',  this.subject)

     // let blank_pattern = /^\s+|\s+$/g;

      // if(val.replace( blank_pattern, '' ) == "") {
      //   this.isCheckForm = false;
      // } else{
      //   this.alert_msg_title = "";
      // }

      if( this.subject == null) {
        this.isCheckForm = false;
        this.errorMessage.subject = '제목을 입력하지 않았습니다.';
        //event.target.focus();
      }else{
        this.errorMessage.subject = '';
      }
    },

    checkMessage(){
      const event = event || window.event;

      if( this.message == null) {
        this.isCheckForm = false;
        this.errorMessage.message = '내용을 입력하지 않았습니다.';
        //event.target.focus();
      }else if(this.message != null && this.testRegExp(this.message)[0]){
        this.isCheckForm = false;
        this.message = this.testRegExp(this.message)[1];
        event.target.focus();
        this.errorMessage.message= '';
      }else{
        this.errorMessage.message = '';
      }
    },

    testRegExp(data){
      const regExp = /<(\/)?([a-zA-Z1-6]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig; //HTML태그 정규식

      if(regExp.test(data)){
        let tmp = data.replace(regExp, '').trim();
        return [true, tmp];
      }else{
        return [false];
      }
    },

    testKeyup(){
      console.log('keyup')
      if(this.subject != null && this.testRegExp(this.subject)[0]){
        this.isCheckForm = false;
        this.subject = this.testRegExp(this.subject)[1];
        event.target.focus();
        this.errorMessage.subject= '';
      }else{
        this.errorMessage.subject = '';

      }
    }
  },



};
</script>
<style lang="scss" scoped>
  .invalid-feedback{
      display: block;
  }
  .submit-button{
    .disabled{
      pointer-events:none;
      cursor:default;
    }
  }
</style>
