<template>
  <div class="inbox_chat">
    <div v-for="user in userList" class="chat_list _active_chat">
        <div class="chat_people">
          <a class="" href="#" title="유저 프로파일창 열기" @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');">
            <div class="chat_img">
              <img :src="'' + user.profileImg + ''" alt="sunil">
            </div>
          </a>
          <a href="#" @click.stop.prevent="openChatRoom(user.userName, user.uid)">
            <div class="chat_ib">
              <h5>{{ user.userName }}<span class="chat_date">{{ user.timestamp }}</span></h5>
              <p>{{ user.lastMessage }}</p>
            </div>
          </a>
        </div>
    </div>
  </div>
</template>

<script>
import {USER_DATA} from "../../../common/Constant";
import { mapState, mapGetters, mapActions } from 'vuex'
import { timestampToTime, yyyyMMddHHmmsss } from '@/plugins/timestamp';

export default {
  name: "ChatUserList",
  props:[
    'userList'
  ],
  data(){
    return{

    }
  },
  computed:{

  },
  created(){
  },
  methods:{
    openChatRoom(targetUserName, targetUserUid){
      // var roomUserlist = [targetUserUid, window.globalVars.currentUserUID]; // 챗방 유저리스트
      // var roomUserName = [targetUserName, window.globalVars.currentUserName] // 챗방 유저 이름
      // var chatRoomId = '@@myChatRoom@@' + roomUserlist[1] + '@@CreateTime@@' + new Date(1000).getDate();
      //
      // this.saveTargetUserName(targetUserName); // 상대방 이름 저장
      // this.saveChatRoomId(chatRoomId); // 채팅방ID 저장
      //
      // //this.openChatRoom(this.roomId, this.roomTitle); // 파라미터 추가
      //
      // console.log('채팅 시작!',  window.globalVars.chatRoomTitle, roomUserlist, roomUserName)

    },

    showModalpopup(title, componentName, post){
      window.globalVars.pop_title = title;
      window.globalVars.pop_content = componentName;

      this.$EventBus.$emit('toggleClose');
    },


  }
}
</script>

<style scoped>

</style>
