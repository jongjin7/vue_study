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
      <button type="submit" class="btn btn-primary">Sign in</button>
    </form>
    <hr class="mb-4">
    <a class="d-block" href="#">회원가입을 해요.</a>
    <a class="d-block" href="#">비밀번호를 잃어버렸어요.</a>
  </div>
</template>

<script>

  export default {
    name: "Login",
    data(){
      return{

      }
    },

  };
</script>


