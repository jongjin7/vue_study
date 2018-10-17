<template>
  <div id="app">
    <nav class="navbar navbar-inverse">
    </nav>
    
    <router-link :to="gotoMainLink" class="logo"><img src="./assets/logo.png"></router-link>
    <router-view/>
    
    <modal v-if="showModal" @close="showModal = false">
		  <h3 slot="header"><!-- 사용자 닉네임 출력 --> 로그인</h3>
    </modal>
		<button class="btn btn-primary" v-on:click="showModal = true">로그인 입력폼</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      gotoMainLink: "/",
      showModal: false
    };
  }
};
</script>

<style lang='scss' scoped>
.logo {
  display: block;
  width: 200px;
  height: auto;
  margin: 0 auto;
  text-align: center;
  text-decoration: none;

  img {
    width: 100%;
  }

  &:after {
    display: block;
    content: "가상 선택자";
    background: silver;
  }

  &:hover:after {
    background: green;
    color: yellow;
  }
}
</style>
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
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  //margin: 20px 0;
}

.modal-footer {
  padding-right: 0;
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
