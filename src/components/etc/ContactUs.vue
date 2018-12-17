<template>
  <div class="mb-5">
    <h1 class="mb-4">Contact Us</h1>
    <form id="contactForm" novalidate="true" @submit.stop.prevent="checkForm" >
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="ct-name">이름</label>
            <input type="text" id="ct-name" class="form-control" name="name" placeholder="이름을 입력하세요" required="" data-error="Please enter your name" v-model="name">
            <div class="invalid-feedback" :class="{show: validatorError}">{{ errorMessage.name}}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group has-error">
            <label for="ct-email">이메일</label>
            <input type="text" id="ct-email" placeholder="이메일 주소를 입력하세요" class="form-control" name="name" required="" data-error="Please enter your email" v-model="email">
            <div class="invalid-feedback" :class="{show: validatorError}">{{ errorMessage.email }}</div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <label for="ct-subject">제목</label>
            <input type="text" id="ct-subject" placeholder="제목을 입력하세요" class="form-control" required="" data-error="Please enter your subject" v-model="subject">
            <div class="invalid-feedback" :class="{show: validatorError}">{{ errorMessage.subject }}</div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="form-group">
            <label for="ct-message">내용</label>
            <textarea id="ct-message" class="form-control" placeholder="문의하실 내용을 입력하세요" rows="11" data-error="Write your message" required="" v-model="message"></textarea>
            <div class="invalid-feedback" :class="{show: validatorError}">{{ errorMessage.message }}</div>
          </div>
          <div class="submit-button text-center">
            <button class="btn btn-lg btn-common" :class="{'btn-secondary disabled': !checkValidator, 'btn-primary': checkValidator}" id="submit" type="submit">
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
      checkValidator:true,
      isLogined: true,

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
      if(this.name && this.email) return;

      this.errorMessage.name ='';
      this.errorMessage.email ='';
      this.errorMessage.subject ='';
      this.errorMessage.message ='';

      if(!this.name) this.errorMessage.name="가입하신 이름을 입력하세요";
      if(!this.email) this.errorMessage.email="이메일 입력 형식(sample@email.com)을 확인하세요";
      if(!this.subject) this.errorMessage.subject="제목을 입력하세요";
      if(!this.message) this.errorMessage.message="내용을 입력하세요";
      this.validatorError = true;
    }
  }

};
</script>
<style lang="scss" scoped>
  .invalid-feedback{
    &.show{
      display: block;
    }
  }
  .submit-button{
    .disabled{
      pointer-events:none;
      cursor:default;
    }
  }
</style>
