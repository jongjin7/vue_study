<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h1 class="title">로그인팝업</h1>
          </div>

          <div class="modal-body">
            <loginContent />
            <sample1 v-if="app.currentContent == 'content1'" />
            <sample2 v-if="app.currentContent == 'content2'" />
            <sample3 v-if="app.currentContent == 'content3'" />
          </div>

          <div class="modal-footer">
            <button class="modal-default-button" @click="$emit('close')">
              팝업닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import loginContent from "../Login.vue"
import sample1 from "../sample_1.vue"
import sample2 from "../sample_2.vue"
import sample3 from "../sample_3.vue"
export default{
  name: "modalPopupFrame",
  data(){
    return {

    }
  },
  components:{
    loginContent: loginContent,
    sample1: sample1,
    sample2: sample2,
    sample3: sample3
  }
}
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
