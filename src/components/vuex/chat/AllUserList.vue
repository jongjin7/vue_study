<template>
  <div>
    <h3 class="h6 pt-3">* 내 사이트 회원 목록 *</h3>
    <ul class="contacts">
      <li v-for="user in targetUserList">
        <!-- @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');" -->
        <a href="#" @click.stop.prevent="openChatRoom(user)">
          <div class="img_cont">
            <img :src="user.photoURL" class="rounded-circle user_img">
            <span class="online_icon" :class="{ offline : isUserOffline }"></span>
          </div>
          <div class="user_info">
            <span>{{ user.displayName }}</span>
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
  import { USER_DATA, CHAT_ROOM } from '@/common/Constant';
import { timestampToTime, yyyyMMddHHmmsss } from '@/plugins/timestamp';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: "AllUserList",
  data(){
    return{
      targetUserList:'',
      chatRoomList:[],
      chatUserList:'',

      isUserOffline:true,
    }
  },
  created(){
    this.fetchUserList();

    this.checkOnlineUser();

  },
  computed:{
    ...mapState({
      currentUser: ({ socket }) => socket.ownerInfo, //socket ==> this.state.socket으로 매핑
      roomId: ({ socket }) => socket.chatRoom.roomId,
    }),
  },
  methods:{
    ...mapMutations([
      'setRoomId',
      'roomUsersList',
      'roomUsersName',
      'targetUserInfo',
      'isOpenChatRoom'
    ]),
    ...mapActions([

    ]),


    checkOnlineUser(){
      let vm = this;
      let userUid = this.currentUser.uid;
      let myConnectionsRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/UsersConnection/' + userUid + '/connection');
      let lastOnlineRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/UsersConnection/' + userUid + '/lastOnline');
      let connectedRef = this.$firebaseRealDB.ref('/.info/connected');

      connectedRef.on('value', function(snap) {
        if (snap.val() === true) {
          myConnectionsRef.set(true);
          // 연결 단절 이벤트
          myConnectionsRef.onDisconnect().set(false);
          lastOnlineRef.onDisconnect().set(vm.$firebase.database.ServerValue.TIMESTAMP);
        }
      });


      console.log('checkOnlineUser', userUid, myConnectionsRef, lastOnlineRef, connectedRef)
    },

    checkCurruntUserRoomList(targetUserUid){
      let roomList = JSON.parse(sessionStorage.getItem('chatRoomList'));
      let isOpenRoom = false;
      let filterRoomList = roomList.filter((obj)=>{
        let a = obj.roomOneVSOneTarget == targetUserUid;
        let b = obj.roomType == 'ONE_VS_ONE';

        //console.log(obj, targetUserUid, a, obj.roomOneVSOneTarget, b)
        if(a === true && b === true){
          this.setRoomId(obj.roomId);
          isOpenRoom = true;
        }
        return isOpenRoom;
      })

      console.log('tmp', filterRoomList)
      return filterRoomList.length > 0;
    },

    openChatRoom(targetUser){
      console.log('openChatRoom', targetUser)
      var roomUsersUid = [targetUser.uid, this.currentUser.uid ]; // 챗방 유저리스트
      var roomUsersName = [targetUser.displayName, this.currentUser.displayName ] // 챗방 유저 이름

      this.targetUserInfo(targetUser);
      this.roomUsersList(roomUsersUid);
      this.roomUsersName(roomUsersName);

      // 개설된 채팅방이 없다면?
      if(!this.checkCurruntUserRoomList(roomUsersUid[0])){
        let chatRoomId = '@roomMaker@' + roomUsersUid[0] + '@time@' + yyyyMMddHHmmsss();
        this.setRoomId(chatRoomId); // 채팅방ID 저장
      }


      // 채팅룸 활성 상태 저장
      let storage = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM);
      if(storage === null){
        let tmpStorage = {
          roomId: this.roomId,
          targetUser: targetUser,
        }
        sessionStorage.setItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM, JSON.stringify(tmpStorage))
      }
      // * 저장되어 있는 챗방 정보를 DB조회시 필요한 것 *
      // 챗방 유저 이름(roomUserName), 챗방 유저 리스트(room userList), roomID, roomType(ONE VS ONE), room target ID,
      // 로컬에 각 유저별 채팅 정보를 저장할까==> 각 유저에 매핑되어 있는 정보를 이용
      // 열린 챗방이 있는 경우 룸리스트를 트리거한다.
      // 새로운 방이라면 챗방정보를 생성하고 오픈한다.

      // targetUser: 참여했던 챗방 정보를 갖고 있어야 한다.
      // ONE_VS_ONE@@targetUserUid

      this.$router.push({name: 'OpenedChatRoom', params:{ userId: roomUsersName[0] }});
      console.log('채팅 시작!',  targetUser, roomUsersUid, roomUsersName)

    },

    showModalpopup(title, componentName, post){
      window.globalVars.pop_title = title;
      window.globalVars.pop_content = componentName;

      this.$EventBus.$emit('toggleClose');
    },

    saveRoomListToSessionStorage (roomList){
      console.log('session save', roomList)
      // *기술적 이슈
      // 채팅방에서 대화 참여시 새로운 사용자가 회원가입하여 접속한 유저에게
      // 메시지를 보내면 챗메인의 유저리스트와 채팅룸 리스트가 동기화 되어야 하는데
      // 세션스토리지를 이용하면 어떻게 동기화 할지 고민이 필요하다.
      //if(sessionStorage.getItem('chatRoomList') === null){
        sessionStorage.setItem('chatRoomList', JSON.stringify(roomList));
      //}
    },

    loadChatRoomList(){
      let vm = this;
      let rootRoomRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME);


      rootRoomRef.child('RoomUsers').once('value').then((dataSnapShot) =>{
        dataSnapShot.forEach((data) =>{
          //console.log('roomList', data.val())
        });
      });



      // ONE_VS_ONE, targetUserUid 정보로 쿼리하기...룸리스트
      let roomRef = rootRoomRef.child('UserRooms/'+this.currentUser.uid );
      roomRef.off();

      roomRef.once('value').then((dataSnapShot) =>{
        let tmpData = []
        dataSnapShot.forEach((data) =>{
          //console.log('userRooms', data.val())
          tmpData.push(data.val());
        });
        vm.saveRoomListToSessionStorage(tmpData);
      });
    },

    fetchUserList(){
      this.chatUserList = sessionStorage.getItem('chatUserList');
      this.loadChatRoomList();
      if(this.chatUserList === null){

console.log(1)
        let vm = this;
        let userDBRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME +'/'+ USER_DATA.INDEXDB_STORE);
        userDBRef.off();

        userDBRef.orderByChild("displayName").once('value').then((dataSnapShot) =>{
          let tmpList=[];
          dataSnapShot.forEach((data) =>{
            if (data.key !== vm.currentUser.uid) {
              //console.log(data.val())
              let tmp = data.val();
              tmp.uid = data.key;
              tmpList.push(tmp);
            }
          });
          return tmpList;
        }).then((tmpList)=>{
          new Promise((resolve, reject)=>{
            setTimeout(()=>{
              resolve(sessionStorage.setItem('chatUserList', JSON.stringify(tmpList)));
            },100);
          }).then(()=>{
            console.log('callback')
            vm.fetchAftersaveUserListSession();
          });
        })
      }else{
        console.log(2)
        this.fetchAftersaveUserListSession();

      }
    },

    fetchAftersaveUserListSession(){
      console.log('fetch session')
      let useList = sessionStorage.getItem('chatUserList');
      this.targetUserList = JSON.parse(useList); //load to session storage 'roomList'
    }
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

  .contacts li a{
    text-decoration: none;
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
  }
  .user_info p{
    margin-bottom: 0;
    font-size: 0.5rem;
    color:#999;
  }
  .contacts li a{
    text-decoration: none;
    color: #444;
  }
  .contacts li a:hover{
    color:#007bff;
    font-weight: bold;
  }
  .contacts li a:hover .user_img{
    border-color:#007bff;
  }

</style>
