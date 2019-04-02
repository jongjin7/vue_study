<template>
  <div class="inbox_chat">
    <div v-for="user in userRoomList" class="chat_list _active_chat">
        <div class="chat_people">
          <a class="" href="#" title="유저 프로파일창 열기" @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');">
            <div class="chat_img">
              <img :src="'' + user.photoURL + ''" alt="sunil">
            </div>
          </a>
          <a href="#" @click.stop.prevent="clickCurrentRoomMessage(user)">
            <div class="chat_ib">
              <h5>{{ user.displayName }}<span class="chat_date">{{ user.timestamp }}</span></h5>
              <p>{{ user.lastMessage }}</p>
            </div>
          </a>
        </div>
    </div>
  </div>
</template>

<script>
import {CHAT_ROOM} from "../../../common/Constant";
import { mapState, mapMutations, mapActions } from 'vuex'
import { timestampToTime, yyyyMMddHHmmsss } from '@/plugins/timestamp';

export default {
  name: "ChatRoomList",
  props:[
    'userRoomList'
  ],
  data(){
    return{

    }
  },
  computed:{
    ...mapState({
      currentUser: ({ socket }) => socket.ownerInfo
    }),
  },
  created(){
    this.fetchRoomList();
  },
  methods:{
    ...mapMutations([
      'targetUserInfo',

      'setRoomId',
      'roomUsersList',
      'roomUsersName',
    ]),
    ...mapActions([

    ]),

    clickCurrentRoomMessage(user){
      this.roomUsersList(user.roomUserlist.split(CHAT_ROOM.SPLIT_CHAR));
      let targetUserUid = user.roomUserlist.split(CHAT_ROOM.SPLIT_CHAR)[0];
      console.log('sessionStorage', JSON.parse(sessionStorage.getItem('chatUserList')))
      let targetUser = JSON.parse(sessionStorage.getItem('chatUserList')).filter((target)=>{
        return target.uid ===  user.roomOneVSOneTarget
      });
      this.targetUserInfo(targetUser[0]);

      this.roomUsersName(user.roomUserName);
      let tmpStorage = {
        roomId: user.roomId,
        targetUser: targetUser[0],
      }
      sessionStorage.setItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM, JSON.stringify(tmpStorage))

      this.$emit('changeChatRoom');
    },

    showModalpopup(title, componentName, post){
      window.globalVars.pop_title = title;
      window.globalVars.pop_content = componentName;

      this.$EventBus.$emit('toggleClose');
    },

    fetchRoomList(){

    },


  }
}
</script>

<style scoped>

</style>
