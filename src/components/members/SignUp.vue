<template>
  <div class="sign-up">
    <h1 class="mb-4">회원가입</h1>
    <form class="needs-validation" novalidate="">
      <div class="row">
        <h2 class="text-hide">기본정보</h2>
        <div class="form-group col-md-12">
          <label for="email">이메일</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">@</span>
            </div>
            <input type="email" class="form-control repuired" id="email" placeholder="your@example.com" required="" >
          </div>
          <div class="invalid-feedback">
            올바른 이메일 주소를 입력하세요.
          </div>
        </div>

        <div class="form-group col-md-6">
          <label for="pwd-inp1">비밀번호</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">자물쇠아이콘</span>
            </div>
            <input type="password" class="form-control" id="pwd-inp1" placeholder="8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요." required="">
            <div class="invalid-feedback" style="width: 100%;">
              비밀번호를 입력하세요.
            </div>
          </div>
        </div>

        <div class="form-group col-md-6">
          <label for="pwd-inp2">비밀번호 재확인</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">자물쇠아이콘</span>
            </div>
            <input type="password" class="form-control" id="pwd-inp2" placeholder="Username" required="">
            <div class="invalid-feedback" style="width: 100%;">
              비밀번호를 입력하세요.
            </div>
          </div>
        </div>

        <div class="form-group col-md-6">
          <label for="input-name">이름</label>
          <input type="text" class="form-control" id="input-name" placeholder="" value="" required="">
          <div class="invalid-feedback">
            필수 입력항목입니다.
          </div>
        </div>

        <div class="form-group col-md-6">
          <label for="input-id">닉네임</label>
          <div class="input-group">
            <input type="text" class="form-control" id="input-id" placeholder="필수정보입니다." required="">
            <div class="invalid-feedback" style="width: 100%;">
              닉네임을 입력하세요.
            </div>
          </div>
        </div>
      </div>

      <!-- 1월에 계발 예정 -->
      <!--<div class="row">
        <div class="col-lg">
          <h3 class="h6">주소</h3>
          <div class="form-row">
            <div class="col-md-4 mb-3">
              <select class="custom-select d-block w-100" id="country" required="">
                <option value="">지역 선택</option>
                <option>서울시</option>
                <option>경기도</option>
                <option>전라도</option>
              </select>
              <div class="invalid-feedback">
                지역을 선택하세요.
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <select class="custom-select d-block w-100" id="state" required="">
                <option value="">구/시/군 선택</option>
                <option>은평구</option>
              </select>
              <div class="invalid-feedback">
                구/시/군을 선택하세요.
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <input type="text" class="form-control" id="address" placeholder="동,호수를 입력하세요" required="">
              <div class="invalid-feedback">
                동,호수를 입력하세요.
              </div>
            </div>
          </div>
        </div>
      </div>-->

      <div class="row">
        <div class="col-md-6 mb-3">
          <h3 class="h6">성별</h3>
          <div class="form-inline">
            <div class="custom-control custom-radio mr-4">
              <input id="chk-gender-m" name="gender" type="radio" class="custom-control-input" checked="" required="">
              <label class="custom-control-label" for="chk-gender-m">남성</label>
            </div>
            <div class="custom-control custom-radio mr-4">
              <input id="chk-gender-f" name="gender" type="radio" class="custom-control-input" required="">
              <label class="custom-control-label" for="chk-gender-f">여성</label>
            </div>
            <div class="custom-control custom-radio">
              <input id="chk-gender-e" name="gender" type="radio" class="custom-control-input" required="">
              <label class="custom-control-label" for="chk-gender-e">기타</label>
            </div>
          </div>
          <div class="invalid-feedback">
            성별을 선택하세요.
          </div>
        </div>
        <div class="col-md-6">
          <h3 class="h6">생년월일</h3>
          <div class="form-row">
            <div class="col-md-5 mb-1">
              <input type="number" min="1979" class="form-control" id="input-year" placeholder="년(4자)" required="">
            </div>
            <div class="col-md-2 mb-1">
              <select class="custom-select" id="input-month" required="">
                <option value="">월</option>
                <option>1월</option>
                <option>2월</option>
                <option>3월</option>
              </select>
            </div>
            <div class="col-md-5">
              <input type="number" min="1" max="31" class="form-control" id="input-day" placeholder="일(숫자)" required="">
            </div>
          </div>
          <div class="invalid-feedback">
            실제 생년월일을 입력하세요.
          </div>
        </div>
      </div>



      <!-- 1월에 계발예정 -->
      <!--
      <hr class="mb-4">
      <div class="row">
        <div class="col-lg mb-3">
          <h2 class="h4">개인정보 수집 동의</h2>
          <div class="d-block">
            <div class="mb-2">
              <textarea class="form-control" name="" id=""  rows="3">개인정보 수집 내용</textarea>
            </div>

            <div class="form-inline">
              <div class="custom-control custom-radio mr-4">
                <input id="chk-agree-ok" name="chk-agree" type="radio" class="custom-control-input" checked="" required="">
                <label class="custom-control-label" for="chk-agree-ok">동의하기</label>
              </div>
              <div class="custom-control custom-radio">
                <input id="chk-agree-no" name="chk-agree" type="radio" class="custom-control-input" required="">
                <label class="custom-control-label" for="chk-agree-no">동의 안함</label>
              </div>
            </div>
            <div class="invalid-feedback">
              개인정보 수집 동의를 선택해주세요.
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg">
          <h2 class="h4">휴대전화</h2>
          <div class="form-row">
            <div class="col-md-4 mb-3">
              <select class="custom-select w-100" id="input-phone" required="">
                <option value="">대한민국 +82</option>
                <option>국가코드1</option>
                <option>국가코드2</option>
                <option>국가코드3</option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <input type="tel" class="form-control" id="cc-name" placeholder="전화번호 입력" required="">
            </div>
            <div class="col-md-4 mb-3">
              <a href="#" class="btn btn-info btn-md btn-block" id="verify">인증번호 받기</a>
            </div>
            <div class="col-lg  mb-3">
              <input type="number" min="0" class="form-control" id="inp-verify" placeholder="인증번호를 입력하세요" required="">
              <div class="invalid-feedback">
                인증번호를 입력하여 주세요.
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr>
      -->


      <button class="btn btn-primary btn-lg btn-block my-4" type="submit">가입하기</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  data(){
    return{

    }
  },
  created(){

  },
  methods:{

  },
  components:{

  }
};
</script>
