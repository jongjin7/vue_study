<template>
  <div class="mb-5">
    <h1 class="mb-4">문의사항 접수</h1>
    <form id="contactForm" novalidate="true" v-if="!completedSendMessage" @submit.stop.prevent="sendSubmit">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="ct-name">이름</label>
            <input type="text" id="ct-name" class="form-control" :disabled="!isLogined"  maxlength="10" placeholder="이름을 입력하세요" required="" autocomplete="off" v-model="contactUsMessage.name" @keyup ="checkName" @focusout="checkName">
            <div class="invalid-feedback">{{ errorMessage.name}}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group has-error">
            <label for="ct-email">이메일</label>
            <input type="text" id="ct-email" :disabled="!isLogined" placeholder="이메일 주소를 입력하세요" class="form-control" name="name" required="" autocomplete="off" v-model="contactUsMessage.email"  @focusout="checkEmail">
            <div class="invalid-feedback">{{ errorMessage.email }}</div>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label for="ct-subject">제목</label>
            <input type="text" id="ct-subject" :disabled="!isLogined" placeholder="제목을 입력하세요" class="form-control" required="" autocomplete="off" v-model="contactUsMessage.subject" @keyup ="checkSubject" @focusout="checkSubject">
            <div class="invalid-feedback">{{ errorMessage.subject }}</div>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label for="ct-message">내용</label>
            <div class="position-relative">
              <textarea id="ct-message" class="form-control" :disabled="!isLogined"  placeholder="문의하실 내용을 입력하세요. HTML태그를 포함하는 내용은 텍스트만 자동으로 입력됩니다." rows="11" required="" autocomplete="off" v-model="contactUsMessage.message" @keyup="checkMessage" @focusout="checkMessage"></textarea>
              <div class="text-size"><span>0</span> / <span>1000</span>(자)</div>
            </div>
            <div class="invalid-feedback">{{ errorMessage.message }}</div>
          </div>

        </div>
        <div class="col-12">
          <div class="submit-button text-center">
            <button class="btn btn-lg btn-common " :class="{'btn-secondary btn-disabled disabled': !isActiveSubmit, 'btn-primary': isActiveSubmit}" id="submit" type="submit"  v-if="isLogined">
              문의사항 보내기
            </button>
            <span class="btn btn-lg btn-secondary btn-disabled disabled" v-else>
              로그인이 필요합니다.
            </span>
          </div>
        </div>
      </div>
    </form>

    <completedContact v-else />
  </div>
</template>

<script>
  const STORAGE_KEY_CONTACTUS = 'contact-us-message';
  import completedContact from './CompletedContactUs.vue';
export default {
  name: "ContactUs",
  data() {
    return {
      contactUsMessage:{
        name:'mr.jong',
        email:'test@sa.com',
        subject:'',
        message:'',
      },
      isLogined: true, //로그인 유무

      errorMessage:{
        name:'',
        email:'',
        subject:'',
        message:''
      },
      errorSubmitValidator:[false,false,true,true],
      isActiveSubmit:false,
      completedSendMessage:false,

    };
  },

  beforeCreate(){

  },

  created() {
    this.formValidation();
  },

  computed: {

  },

  watch: {

  },
  methods: {

    formValidation(){
      console.log('errorSubmitValidator')
      let sCount = this.errorSubmitValidator.filter((arg) =>{
        return arg === true
      });
      if(sCount.length == 0) this.isActiveSubmit = true;
      else this.isActiveSubmit = false;
    },

    sendSubmit(){
      console.log('submit!!!!')
      localStorage.setItem(STORAGE_KEY_CONTACTUS, JSON.stringify(this.contactUsMessage))
      this.completedSendMessage=true;
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

    checkName(){
      console.log('checkName')
      const blank_pattern = /^\s+|\s+$/g;
      const event = event || window.event;

      if(this.contactUsMessage.name.replace( blank_pattern, '' ) == "") {
        this.errorMessage.name = '이름을 입력하지 않았습니다.';
        this.errorSubmitValidator[0] = true;
        //event.target.focus();
      }else{
        this.errorMessage.name = '';
        this.errorSubmitValidator[0] = false;
      }
      this.formValidation();
    },

    checkEmail : function(){
      const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      const blank_pattern = /^\s+|\s+$/g;
      const event = event || window.event;

      if( this.contactUsMessage.email.replace( blank_pattern, '' ) == "") {
        this.errorMessage.email = '이메일을 입력하지 않았습니다.';
        this.errorSubmitValidator[1] = true;
        //event.target.focus();
      }else if(this.contactUsMessage.email.replace( blank_pattern, '' ) != "" && !regExp.test(this.contactUsMessage.email)){
        this.errorMessage.email = '이메일 형식에 맞춰 입력해주세요';
        this.errorSubmitValidator[1] = true;
        //event.target.focus();
      }else{
        this.errorMessage.email = "";
        this.errorSubmitValidator[1] = false;
      }

      this.formValidation();
    },

    checkSubject(){
      console.log('checkSubject')
      const event = event || window.event;
      const blank_pattern = /^\s+|\s+$/g;

      if(this.contactUsMessage.subject.replace( blank_pattern, '' ) == "") {
        this.errorMessage.subject = '제목을 입력하지 않았습니다.';
        this.errorSubmitValidator[2] = true;
        //event.target.focus();
      }else if(this.contactUsMessage.subject.replace( blank_pattern, '' ) != "" && this.reExpContent(this.contactUsMessage.subject)[0]){
        this.contactUsMessage.subject = this.reExpContent(this.contactUsMessage.subject)[1];
        this.errorMessage.subject= '';
        this.errorSubmitValidator[2] = true;
        event.target.focus();
      }else{
        this.errorMessage.subject = '';
        this.errorSubmitValidator[2] = false;
      }
      this.formValidation();
    },

    checkMessage(){
      //console.log('checkMessage')
      const event = event || window.event;
      const blank_pattern = /^\s+|\s+$/g;

      if(this.contactUsMessage.message.replace( blank_pattern, '' ) == "") {
        this.errorMessage.message = '내용을 입력하지 않았습니다.';
        this.errorSubmitValidator[3] = true;
        //event.target.focus();
      }else if(this.contactUsMessage.message.replace( blank_pattern, '' ) != "" && this.reExpContent(this.contactUsMessage.message)[0]){
        this.contactUsMessage.message = this.reExpContent(this.contactUsMessage.message)[1];
        this.errorMessage.message= '';
        this.errorSubmitValidator[3] = true;
        event.target.focus();
      }else{
        this.errorMessage.message = '';
        this.errorSubmitValidator[3] = false;
      }
      this.formValidation();

    },

    reExpContent(data){
      console.log('this.isCheckForm', this.isCheckForm)
      const regExp = /<(\/)?([a-zA-Z1-6]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig; //HTML태그 정규식

      if(regExp.test(data)){
        //console.log('정규식 사용')
        let tmp = data.replace(regExp, '').trim();
        return [true, tmp];
      }else{
        //console.log('정규식 사용 안함')
        return [false];
      }
    },
  },

  components:{
    completedContact
  }


};
</script>
<style lang="scss" scoped>
  .text-size{
    position: absolute; right:0; top:0;
    background: rgba(0,0,0,0.2);
    padding:0.1rem 0.4rem;
    font-size: 0.5rem;
    border-top-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    color:#fff;
    text-shadow:0.05rem 0.05rem rgba(0,0,0,0.3);
  }
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
