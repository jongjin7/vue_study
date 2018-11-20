<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h1 class="h3 modal-title">{{ currentPopContentTitle }}</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">

            <sample1 v-if="currentPopContent == 'sample1'" />
            <general-editor v-if="currentPopContent == 'general'" />
            <photo-editor v-if="currentPopContent == 'photo'" />
            <login-content v-if="currentPopContent == 'login'" />
          </div>

          <div class="modal-footer">
            <!-- 추가 내용 -->
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import loginContent from "../members/Login.vue"
import sample1 from "../sample_1.vue"
import photoEditor from "../board_photo/PopBoardPhotoEditor.vue"
export default{
  name: "modalPopupFrame",
  data(){
    return {
      currentPopContent: this.$store.state.pop_content,
      currentPopContentTitle: this.$store.state.pop_title
    }
  },
  created(){
    console.log('this.app.currentContent', this.currentPopContent)
  },
  components:{
    'login-content': loginContent,
    sample1: sample1,
    'photo-editor': photoEditor
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
  .overlay{
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    position: relative;
    z-index: 2;
    width: 50%; min-width:360px; max-width:600px;
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
