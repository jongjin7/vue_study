<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h1 class="title">로그인 팝업</h1>
          </div>

          <div class="modal-body">
            <form class="">
              <div class="form-group">
                <label for="exampleDropdownFormEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com">
              </div>
              <div class="form-group">
                <label for="exampleDropdownFormPassword1">Password</label>
                <input type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="Password">
              </div>
              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input">
                  Remember me
                </label>
              </div>
              <button type="submit" class="btn btn-primary">Sign in</button>
            </form>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">회원가입</a>
            <a class="dropdown-item" href="#">비밀번호를 잃어버렸네?</a>
          </div>

          <div class="modal-footer">
            <button class="modal-default-button" @click="$emit('close')">
            팝업닫기
            </button>
          </div>
          <!-- slot -->
        </div>
      </div>
    </div>
  </transition>         
</template>

<script>
export default {
  name: "modalFrame"
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
  padding: 0 0.5rem 0.5rem;
}
.modal-header .title {
  margin-top: 0;
  color: #42b983;
  font-size: 1.5rem;
}

.modal-body {
  margin: 20px 0;
  padding: 0 0.5rem;
}

.modal-footer {
  padding-right: 0.5rem;
  text-align: left;
}
.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
