<template>
  <div class="type_msg">
    <div class="input_msg_write">
      <input type="text" class="write_msg" placeholder="메시지를 입력하세요"  v-model="writeMsg" @keyup.13="submitChatMessage"/>
      <button class="msg_send_btn" type="button" @click="submitChatMessage"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "messageInputForm",
      data() {
        return {
          writeMsg: '',
        };
      },
      methods: {
        submitChatMessage() {
          let vm = this;
          if (this.writeMsg.length === 0) return false;

          // 채팅방 내용 추가
          // this.$firebaseDB.collection('/myChat/chatList/chatRooms/room'+ id +'/messages').collection('message'+id)
          //   .set({msg:this.writeMsg, from:'user', timeStamp:'2019.01.30 12:12:12'})
          //   .then(function(){
          //     //socket
          //     vm.$emit('submitMessage', this.writeMsg);
          //     vm.writeMsg = '';
          // });
          vm.$emit('submitMessage', this.writeMsg);
          vm.writeMsg = '';

          return true;
        },
      },
    }
</script>

<style scoped>

</style>
