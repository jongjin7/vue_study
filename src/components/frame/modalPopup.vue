<template>
  <transition name="modal">
    <div class="modal fade show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="h3 modal-title">{{ currentPopContentTitle }}</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"  @click="$emit('toggleClose')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <photoEditor v-if="currentPopContent == 'photo'" />
            <loginContent v-else-if="currentPopContent == 'login'" />
            <signUpContent v-else-if="currentPopContent == 'singup'" />
            <signUpContent v-else-if="currentPopContent == 'modifyUserInfo'" />

            <chatUserProfile v-else-if="currentPopContent == 'chatUser'" />
            <chatInvite v-else-if="currentPopContent == 'chatInvite'" />
          </div>

          <div class="modal-footer d-none"></div>
        </div>
      </div>
      <div class="modal-backdrop fade show" @click="$emit('toggleClose')"></div>
    </div>
  </transition>
</template>

<script>
import loginContent from "../members/Login.vue";
import signUpContent from "../members/SignUp.vue";
import photoEditor from "../board_photo/PopBoardPhotoWrite.vue";
import chatUserProfile from "../vuex/chat/PopChatUserProfile.vue";
import chatInvite from "../vuex/chat/PopChatInvite.vue";

export default{
  name: "modalPopupFrame",
  props:{
    modalOpened:Boolean,
  },
  data(){
    return {
      currentPopContent: window.globalVars.pop_content,
      currentPopContentTitle: window.globalVars.pop_title,
    }
  },
  created(){
    console.log('this.currentPopContent', this.currentPopContent)
  },
  methods:{

  },
  components:{
    loginContent,
    photoEditor,
    signUpContent,
    chatUserProfile,
    chatInvite,
  }
}
</script>
<style scoped>
 .modal{
   overflow-x: hidden;
   overflow-y: auto;
 }
 .modal-dialog{
   margin-top: 2rem;
   z-index: 2;
 }
 .modal-backdrop{
   z-index: 1;
 }
  .modal-content {
    position: relative;
    width: 50%; min-width:360px; max-width:600px;
    margin: 0px auto;
    padding: 20px 20px;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal.show{
    display: block;
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

  .modal-enter .modal-content,
  .modal-leave-active .modal-content {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
