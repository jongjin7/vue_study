<template>
  <div>
    <h3 class="h6 pt-3">* 내 사이트 회원 목록 *</h3>
    <ul class="contacts">
      <li v-for="user in targetUserList">
        <!-- @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');" -->
        <a href="#" @click.stop.prevent=""  @dblclick="openChatRoom(user)">
          <div class="img_cont">
            <img src="https://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg" class="rounded-circle user_img">
            <span class="online_icon"></span>
          </div>
          <div class="user_info">
            <span>{{ user.userName }}</span>
            <p>Maryam is online</p>
          </div>
        </a>
      </li>
      <!--<li>-->
        <!--<a href="#" class="img_cont">-->
          <!--<img src="https://2.bp.blogspot.com/-8ytYF7cfPkQ/WkPe1-rtrcI/AAAAAAAAGqU/FGfTDVgkcIwmOTtjLka51vineFBExJuSACLcBGAs/s320/31.jpg" class="rounded-circle user_img">-->
          <!--<span class="online_icon offline"></span>-->
        <!--</a>-->
        <!--<a href="#" class="user_info">-->
          <!--<span>Sahar Darya</span>-->
          <!--<p>Sahar left 7 mins ago</p>-->
        <!--</a>-->
      <!--</li>-->
    </ul>
  </div>
</template>

<script>
import { USER_DATA } from "@/common/Constant";
import { timestampToTime, yyyyMMddHHmmsss } from '@/plugins/timestamp';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: "SiteMemberList",
  data(){
    return{
      targetUserList:[],
    }
  },
  created(){
    this.getUserData();
  },
  computed:{
    ...mapState({
      currentUser: ({ socket }) => socket.chatUsers.currentUserInfo //socket ==> this.state.socket으로 매핑
    }),
  },
  methods:{
    ...mapActions([
      'saveTargetUserName',
      'saveChatRoomId',
      'changeIsOpenChatRoom',
      'targetUserInfo',

      'roomUsersList',
      'roomUsersName',

    ]),

    openChatRoom(targetUser){
      var roomUsersUid = [targetUser.uid, this.currentUser.uid ]; // 챗방 유저리스트
      var roomUsersName = [targetUser.userName, this.currentUser.userName ] // 챗방 유저 이름
      var chatRoomId = '@@myChatRoomUser__@@@__' + roomUsersUid[0] + '__@@@__' + roomUsersUid[1];

      this.roomUsersList(roomUsersUid);
      this.roomUsersName(roomUsersName);
      this.saveChatRoomId(chatRoomId); // 채팅방ID 저장
      this.targetUserInfo(targetUser);

      this.changeIsOpenChatRoom();
      this.$router.push({name: 'OpenedChatRoom', params:{ userId: roomUsersName[1] }});
     // console.log('채팅 시작!',  targetUser, roomUsersUid, roomUsersName[1])

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
             console.log(data.key, data.val())
            let tmp = data.val();
            tmp.uid = data.key;

            vm.targetUserList.push(tmp);
          }
        });
      });
    },
  }
}
</script>

<style scoped>
  .contacts{
    display: block;
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }
  .contacts li{
    display: inline-block;
    padding: 5px 10px;
    vertical-align: middle;
    text-align: center;
  }
  .user_img{
    height: 70px;
    width: 70px;
    border:1.5px solid #f5f6fa;

  }
  .user_img_msg{
    height: 40px;
    width: 40px;
    border:1.5px solid #f5f6fa;

  }
  .img_cont{
    display: block;
    position: relative;
    height: 70px;
    width: 70px;
    margin:0 auto;
  }
  .img_cont_msg{
    height: 40px;
    width: 40px;
  }
  .online_icon{
    position: absolute;
    height: 15px;
    width:15px;
    background-color: #4cd137;
    border-radius: 50%;
    bottom: 0.2em;
    right: 0.4em;
    border:1.5px solid white;
  }
  .offline{
    background-color: #c23616 !important;
  }
  .user_info{
    display: block;
    padding:0 0.25rem;
    margin-top: auto;
    margin-bottom: auto;
    line-height:1.3;
    text-decoration:none;
  }
  .user_info span{
    font-size: 0.75rem;
    color: #0300c5;
  }
  .user_info p{
    margin-bottom: 0;
    font-size: 0.5rem;
    color:#999;
  }

  .user_info:hover{
    background: #e9e9e9;
  }
  .user_info:hover span{
    color:#007bff;
  }
  .user_info:hover p{
    color:#444;
  }
</style>
