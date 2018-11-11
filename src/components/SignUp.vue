<template>
  <div class="sign-up">
    <h4 class="mb-3">회원가입</h4>
    <form class="needs-validation" novalidate="">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="input-id">아이디</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">@</span>
            </div>
            <input type="text" class="form-control" id="input-id" placeholder="필수정보입니다." required="">
            <div class="invalid-feedback" style="width: 100%;">
              아이디를 입력하세요.
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
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

        <div class="col-md-6 mb-3">
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

        <div class="col-md-6 mb-3">
          <label for="input-name">이름</label>
          <input type="text" class="form-control" id="input-name" placeholder="" value="" required="">
          <div class="invalid-feedback">
            필수 입력항목입니다.
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="country">지역</label>
          <select class="custom-select d-block w-100" id="country" required="">
            <option value="">선택</option>
            <option>서울시</option>
            <option>경기도</option>
            <option>전라도</option>
          </select>
          <div class="invalid-feedback">
            지역을 선택하세요
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <label for="state">구/시/군</label>
          <select class="custom-select d-block w-100" id="state" required="">
            <option value="">선택</option>
            <option>은평구</option>
          </select>
          <div class="invalid-feedback">
            Please provide a valid state.
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <label for="address">기타 주소</label>
          <input type="text" class="form-control" id="address" placeholder="동,호수를 입력하세요" required="">
          <div class="invalid-feedback">
            동.호수를 입력하세요
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <h3>성별</h3>
          <div class="form-group form-inline">
            <div class="custom-control custom-radio">
              <input id="chk-gender-m" name="gender" type="radio" class="custom-control-input" checked="" required="">
              <label class="custom-control-label" for="chk-gender-m">남성</label>
            </div>
            <div class="custom-control custom-radio">
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
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="email">본인 확인 이메일 <span class="text-muted">(선택)</span></label>
          <input type="email" class="form-control" id="email" placeholder="you@example.com">
          <div class="invalid-feedback">
            올바른 이메일 주소를 입력하세요.
          </div>
        </div>
      </div>

      <h3>생년월일</h3>
      <div class="row">
        <div class="form-group">
          <div class="col-md-5">
            <input type="number" class="form-control" id="input-year" placeholder="년(4자)" required="">
          </div>
          <div class="col-md-2">
            <select class="custom-select" id="input-month" required="">
              <option value="">월</option>
              <option>1월</option>
              <option>2월</option>
              <option>3월</option>
            </select>
          </div>
          <div class="col-md-5">
            <input type="number" class="form-control" id="input-day" placeholder="일(숫자)" required="">
          </div>
        </div>
        <div class="invalid-feedback">
          실제 생년월일을 입력하세요.
        </div>
      </div>

      <hr class="mb-4">

      <h3>개인정보 수집 동의</h3>
      <div class="row">
        <div class="col-md-4 mb-3 ">
          <div class="form-group form-inline">
            <div class="">
              <textarea class="d-block" name="" id=""  rows="3">개인정보 수집 내</textarea>
            </div>

            <div class="custom-control custom-radio">
              <input id="chk-agree-ok" name="chk-agree" type="radio" class="custom-control-input" checked="" required="">
              <label class="custom-control-label" for="chk-agree-ok">동의하기</label>
            </div>
            <div class="custom-control custom-radio">
              <input id="chk-agree-no" name="chk-agree" type="radio" class="custom-control-input" required="">
              <label class="custom-control-label" for="chk-agree-no">동의 안함</label>
            </div>
          </div>
        </div>
      </div>

      <h3 class="mb-3">휴대전화</h3>
      <div class="row">
        <div class="col-md-4 mb-3">
          <select class="custom-select d-block w-100" id="input-phone" required="">
            <option value="">대한민국 +82</option>
            <option>국가코드1</option>
            <option>국가코드2</option>
            <option>국가코드3</option>
          </select>
        </div>
        <div class="col-md-4 mb-3">
          <input type="tel" class="form-control" id="cc-name" placeholder="전화번호 입력" required="">
        </div>
        <div class="col-md-4">
          <a href="#" class="btn btn-info btn-md btn-block" id="verify">인증번호 받기</a>
        </div>
        <div class="col-md-4">
          <input type="tel" class="form-control" id="inp-verify" placeholder="인증번호를 입력하세요" required="">
        </div>

        <div class="invalid-feedback">
          Name on card is required
        </div>
      </div>



      <hr class="mb-4">
      <button class="btn btn-primary btn-lg btn-block" type="submit">가입하기</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SignUp"
};
</script>
