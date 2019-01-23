<template>
  <div class="type_msg">
    <div class="input_msg_write">
      <input type="text" class="write_msg" placeholder="메시지를 입력하세요"  v-model="msg" @keyup.13="submitMessageFunc"/>
      <button class="msg_send_btn" type="button" @click="submitMessageFunc"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script>
    export default {
      name: "messageInputForm",
      data() {
        return {
          msg: '',
        };
      },
      methods: {
        submitMessageFunc() {
          if (this.msg.length === 0) return false;
          this.$emit('submitMessage', this.msg);
          this.msg = '';
          return true;
        },
      },
    }
</script>

<style scoped>

</style>
