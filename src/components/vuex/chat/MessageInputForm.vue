<template>
  <div class="type_msg">
    <div class="input_msg_write">
      <input type="text" id="message-field" class="write_msg" placeholder="메시지를 입력하세요"  v-model="writeMsg" @keyup.13="submitChatMessage" />
      <button class="msg_send_btn" type="button" @click="submitChatMessage"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script>
import { USER_DATA, CHAT_ROOM } from '../../../common/Constant';
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    name: "MessageInputForm",
    props:[

    ],
    data() {
      return {
        writeMsg: '',
      };
    },
    computed:{
      ...mapState({
        roomId: ({ socket }) => socket.chatRoom.roomId,
        roomMsgData: ({ socket }) => socket.chatRoom.msgDatas,

        roomUsersList: ({ socket }) => socket.chatRoom.roomUsersList,
        roomUsersName: ({ socket }) => socket.chatRoom.roomUsersName,

        currentUser: ({ socket }) => socket.connectedUserData,
        targetUser: ({ socket }) => socket.chatUsers.targetUserInfo
      }),
    },
    created(){

    },
    mounted(){
      // html태그를 포함하는 내용 붙여넣기 할때 일반 텍스트로 치환
      document.querySelector('#message-field').addEventListener('paste', this.onPasteAfterClearTag.bind(this));
    },
    methods: {
      submitChatMessage1(e){
        console.log(e.target)
        this.$emit('submitInputMessage');
      },
      submitChatMessage() {
        if (this.writeMsg.length === 0 ) return false;

        let vm = this;
        let multiUpdates ={};
       //let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages');
        let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).child('Messages');

        let messageRefKey = messageRef.push().key; //message key
        //console.log('messageRefKey', messageRefKey);

        let roomUserList = this.roomUsersList;
        let roomUserListLength = this.roomUsersList.length;  //채팅멤버

        if(this.roomMsgData.length === 0){ //메시지 처음 입력하는 경우
          for(var i=0; i < roomUserListLength; i++){
            multiUpdates['RoomUsers/' +this.roomId + '/' + roomUserList[i]] = true;
          }
          //권한때문에 먼저 저장
          this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).update(multiUpdates);
        }



        multiUpdates ={}; // 변수 초기화
        // 테스트 메세지 저장
        multiUpdates['Messages/' + this.roomId + '/' + messageRefKey] = {
          uid: this.currentUser.uid,
          message: this.writeMsg,
          displayName:this.currentUser.displayName,
          photoURL:this.currentUser.photoURL,
          timeStamp: this.$firebase.database.ServerValue.TIMESTAMP
        }

        //유저별 룸리스트 저장
        if(roomUserList && roomUserListLength > 0){
          for(var i = 0; i < roomUserListLength ; i++){
            multiUpdates['UserRooms/' + this.roomUsersList[i] + '/' + this.roomId ] = {
              roomId : this.roomId,
              roomUserName : this.roomUsersName.join(CHAT_ROOM.SPLIT_CHAR),
              roomUserlist : this.roomUsersList.join(CHAT_ROOM.SPLIT_CHAR),
              roomType : roomUserListLength > 2 ? CHAT_ROOM.TYPE_MULTI : CHAT_ROOM.TYPE_ONE_VS_ONE,
              roomOneVSOneTarget : roomUserListLength == 2 && i == 0 ? roomUserList[1] :  // 1대 1 대화이고 i 값이 0 이면
                roomUserListLength == 2 && i == 1 ? roomUserList[0]   // 1대 1 대화 이고 i값이 1이면
                  : '', // 나머지
              lastMessage : this.writeMsg,
              displayName: this.currentUser.displayName,
              photoURL : this.targetUser.photoURL,
              timestamp: this.$firebase.database.ServerValue.TIMESTAMP

            };
          }
        }
//console.log('multiUpdates', multiUpdates)
        this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).update(multiUpdates);
        this.writeMsg = '';
      },

      onPasteAfterClearTag : function(e){
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }
    },
  }
</script>

<style scoped>

</style>
