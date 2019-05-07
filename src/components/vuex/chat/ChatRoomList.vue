<template>
  <div class="inbox_chat">
    <div v-for="room in userRoomList" class="chat_list _active_chat">
        <div class="chat_people">
          <!--<a class="" href="#" title="유저 프로파일창 열기" @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');">-->

          <a href="#" @click.stop.prevent="changeChatRoomViewData(room)">
            <div class="chat_img">
              <img :src="'' + room.photoURL + ''" alt="sunil">
            </div>
            <div class="chat_ib">
              <h5>{{ room.displayName }}<span class="chat_date">{{ room.timestamp }}</span></h5>
              <p>{{ room.lastMessage }}</p>
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
      currentUser: ({ socket }) => socket.ownerInfo,
      chatUserList: ({ socket }) => socket.chatUserList,
    }),
  },
  created(){

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
    changeChatRoomViewData(roomData){
      // roomType: multi일경우 누가 targetUser가 되는가?
      let tmp = {};
      tmp.roomId = roomData.roomId;
      console.log('aaaa', roomData, roomData.roomUserName)
      tmp.roomUserlist = roomData.roomUserlist; //users uid
      tmp.roomUserName = roomData.roomUserName;
      console.log('user', this.chatUserList)
      if(roomData.roomType == CHAT_ROOM.TYPE_ONE_VS_ONE) {
        tmp.targetUser = this.chatUserList.find( user =>{
          return user.uid === roomData.roomOneVSOneTarget
        })
      }else{
        let tmpArr =[];
        roomData.roomUserlist.forEach( userUid =>{
          if(userUid !== this.currentUser.uid){
            tmpArr.push(this.chatUserList.find( user =>{
              return user.uid == userUid
            }))
          }
        });
        tmp.targetUser = tmpArr;
      }
      this.$emit('changeChatRoom', tmp);
    },

    // 사용하지 않는 함수
    changeChatRoom1(user){
      console.log(22222)
     // let regTargetUser = new RegExp(targetUserUid, 'g');
      //let regCurrentUser = new RegExp(this.currentUser.uid, 'g');
      //let roomUsers = obj.roomUserlist.split(CHAT_ROOM.SPLIT_CHAR);

      this.roomUsersList(user.roomUserlist.split(CHAT_ROOM.SPLIT_CHAR));
      let targetUserUid = user.roomUserlist.split(CHAT_ROOM.SPLIT_CHAR)[0];
      console.log('sessionStorage', JSON.parse(sessionStorage.getItem('chatUserList')), user.roomOneVSOneTarget)
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


  }
}
</script>

<style scoped>

</style>
