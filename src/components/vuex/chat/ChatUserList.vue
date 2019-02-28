<template>
  <div  class="inbox_chat">
    <div v-for="user in userList" class="chat_list _active_chat">

        <div class="chat_people">
          <a class="" href="#" title="유저 프로파일창 열기" @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');">
            <div class="chat_img">
              <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
            </div>
          </a>
          <a href="#" @click.stop.prevent="openChatRoom(user.userName, user.uid)">
            <div class="chat_ib">
              <h5>{{ user.userName }}<span class="chat_date">Dec 25</span></h5>
              <p>Test, which is a new approach to have all solutions
                astrology under one roof.</p>
            </div>
          </a>
        </div>
    </div>
  </div>
</template>

<script>
    import {USER_DATA} from "../../../common/Constant";
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: "ChatUserList",
      props:{

      },
      data(){
        return{
          userList:[],
        }
      },
        created(){
          this.getUserData();
        },
        methods:{
          ...mapActions(['saveTargetUserName','saveChatRoomId']),

          openChatRoom(targetUserName, targetUserUid){
            var roomUserlist = [targetUserUid, window.globalVars.currentUserUID]; // 챗방 유저리스트
            var roomUserName = [targetUserName, window.globalVars.currentUserName] // 챗방 유저 이름
            var chatRoomId = '@@myChatRoom@@' + roomUserlist[1] + '@@CreateTime@@' + new Date(1000).getDate();

            this.saveTargetUserName(targetUserName); // 상대방 이름 저장
            this.saveChatRoomId(chatRoomId); // 채팅방ID 저장

            //this.openChatRoom(this.roomId, this.roomTitle); // 파라미터 추가

            console.log('채팅 시작!',  window.globalVars.chatRoomTitle, roomUserlist, roomUserName)

          },

          showModalpopup(title, componentName, post){
            window.globalVars.pop_title = title;
            window.globalVars.pop_content = componentName;

            this.$EventBus.$emit('toggleClose');
          },

          getUserData(){
            let vm = this;
            let currentUid ='';
            let userDBRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME +'/'+ USER_DATA.INDEXDB_STORE);
            userDBRef.off();

            userDBRef.orderByChild("userName").once('value').then((dataSnapShot) =>{
              console.log('현재 접속한 유저 uid:', window.globalVars.currentUserUID)
              dataSnapShot.forEach((data) =>{
                if (data.key !== window.globalVars.currentUserUID) {
                  // console.log(data.key, data.val())
                  let tmp = data.val();
                  tmp.uid = data.key;

                  vm.userList.push(tmp);
                }
              });

            });
          },

          fetchUserList(users){

            // if(data.key !== this.auth.currentUser.uid){
            //   console.log(data.key, val.profileImg, val.userName)
            // }

          }
        }
    }
</script>

<style scoped>

</style>
