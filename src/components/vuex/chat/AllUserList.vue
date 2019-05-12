<template>
  <div>
    <h3 class="h6 pt-3">* 내 사이트 회원 목록 *</h3>
    <ul class="contacts">
      <li v-for="user in targetUserList">
        <!-- @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');" -->
        <a href="#" @click.stop.prevent="openChatRoom(user)">
          <div class="img_cont">
            <img :src="user.photoURL" class="rounded-circle user_img">
            <span class="online_icon" :class="{ offline : !user.isConnected }"></span>
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
  import {USER_DATA, CHAT_ROOM} from '@/common/Constant';
  import {timestampToTime, yyyyMMddHHmmsss} from '@/plugins/timestamp';
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: "AllUserList",
    data() {
      return {
        targetUserList: '',
        chatRoomList: [],

        includUsersRoom: [],
        stateOnline: false,

      }
    },
    created() {
      this.$EventBus.$on('checkOnlineUser', this.checkOnlineUser);
      //this.checkOnlineUser();
      //this.loadOnlineStatus();

      this.loadChatRoomList();
      this.loadChatUserList();


    },
    mounted() {
      this.itemTag = this.$el.querySelectorAll('li')

    },
    computed: {
      ...mapState({
        currentUser: ({socket}) => socket.ownerInfo, //socket ==> this.state.socket으로 매핑
        roomId: ({socket}) => socket.chatRoom.roomId,
      }),
    },
    methods: {
      ...mapMutations([
        'setRoomId',
        'roomUsersList',
        'roomUsersName',
        'targetUserInfo',
      ]),
      ...mapActions([

      ]),

      loadOnlineStatus(chatUserList) {
        let usersConnectionRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/UsersConnection');
        usersConnectionRef.off();

        var vm = this;
        var tmpArr = [];
        var count =0;

        var cbUserConnection = function (data) {

          var connKey = data.key;
          var connValue = data.val();
          count++;

          //if(onlineIcon != null){
          if (vm.currentUser.uid !== connKey && connKey !== 'undefined') {
            if (connValue.connection === true) {
              console.log('접속중', connKey,  count)

            } else {
              console.log('비접속', connKey,  count)
            }
          }

          //}

          // chatUserList.forEach((user)=>{
          //   console.log('isConnected', user, user.isConnected)
          //   if (user.uid == connKey) {
          //     if(user.isConnected === undefined){
          //       user.isConnected = connValue.connection;
          //     }else{
          //       user.isConnected = !user.isConnected;
          //     }
          //   }
          // });


          //console.log('onlineEventHandler')



        }

        usersConnectionRef.on('child_added', cbUserConnection.bind(this));
        usersConnectionRef.on('child_changed', cbUserConnection.bind(this));
      },

      checkOnlineUser() {
        console.log('allUserListComponent :::=> checkOnlineUser')
        let vm = this;
        let userUid = this.currentUser.uid;
        let myConnectionsRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/UsersConnection/' + userUid + '/connection');
        let lastOnlineRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/UsersConnection/' + userUid + '/lastOnline');
        let connectedRef = this.$firebaseRealDB.ref('.info/connected');

        connectedRef.on('value', function (snap) {
          if (snap.val() === true) {
            //console.log("connected", snap);
            myConnectionsRef.set(true);
            // 연결 단절 이벤트
            myConnectionsRef.onDisconnect().set(false);
            lastOnlineRef.onDisconnect().set(vm.$firebase.database.ServerValue.TIMESTAMP);

          }else{
            //console.log("disconnected");
          }
        })
      },

      checkCurruntUserRoomList(targetUserUid) {
        let roomList = JSON.parse(sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_CHAT_ROOM_LIST));
        let isOpenRoom = false;
        let filterRoomList = roomList.filter((obj) => {
          // 조건1 roomType은 1:1만 검색
          // 조건2 나와 상대가 대화중인 방이 존재하는지 검색
          if(obj.roomType == CHAT_ROOM.TYPE_ONE_VS_ONE && obj.roomOneVSOneTarget == targetUserUid){
            isOpenRoom = true;
            this.setRoomId(obj.roomId);
          }
          return isOpenRoom;
        })

        //console.log('tmp', filterRoomList)
        return filterRoomList.length > 0;
      },

      openChatRoom(targetUser) {
        console.log('openChatRoom', targetUser)
        let storageCurrentUser = sessionStorage.getItem(USER_DATA.CURRENT_USER);
        if (storageCurrentUser === null) {
          location.reload(true);
        }

        //this.targetUserInfo(targetUser); //target을 채팅 목록에서 선택한 유저를 제외한 나머지 인원 정보도 모두 담기

        // 개설된 채팅방이 없다면?
        if (!this.checkCurruntUserRoomList(targetUser.uid)) {
          let chatRoomId = '@roomMaker@' + targetUser.uid + '@time@' + yyyyMMddHHmmsss();
          this.setRoomId(chatRoomId); // 채팅방ID 저장
        }

        // 채팅룸 활성 상태 저장
        let storageOpenRoom = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM);
        if (storageOpenRoom === null) {
          let tmpStorage = {
            roomId: this.roomId,
            roomUserList:[targetUser.uid, this.currentUser.uid],
            roomUserName:[targetUser.displayName, this.currentUser.displayName],
            targetUser: targetUser,
            isInviteUser : false,
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

        //id router
        this.$router.push({name: 'OpenedChatRoom', params: { userId: this.roomId }});

      },

      showModalpopup(title, componentName, post) {
        window.globalVars.pop_title = title;
        window.globalVars.pop_content = componentName;

        this.$EventBus.$emit('toggleClose');
      },


      loadChatRoomList() {
        console.log('loadChatRoomList!!!!')
        let vm = this;
        let rootRoomRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME);

        // ONE_VS_ONE, targetUserUid 정보로 쿼리하기...룸리스트
        let roomRef = rootRoomRef.child('UserRooms/' + this.currentUser.uid);
        roomRef.off();

        roomRef.once('value').then((snapShot) => {
          let tmpData = []
          snapShot.forEach((data) => {
            tmpData.push(data.val());
          });
          vm.saveRoomListToSessionStorage(tmpData);

        });
      },

      saveRoomListToSessionStorage(roomList) {
        console.log('session save', roomList)
        sessionStorage.setItem('chatRoomList', JSON.stringify(roomList));
      },

      loadChatUserList() {
        console.log('loadChatUserList==>')
        // useList Query를 줄일 수 있는 방법은?
        let vm = this;
        let userDBRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/' + USER_DATA.INDEXDB_STORE);
        userDBRef.off();

        userDBRef.orderByChild("displayName").once('value').then((snapShot) => {
          let chatUserList = [];
          snapShot.forEach((data) => {
            if (data.key !== vm.currentUser.uid) {
                let tmp = data.val();
                tmp.uid = data.key;
                //tmp.isConnection = statusOnline;
                chatUserList.push(tmp);
              }
          });
          return chatUserList;
        }).then((chatUserList) => {

          // chatUserList.forEach((user)=>{
          //
          //   if(user.uid === statusUid){
          //     user.isConnection = statusOnline;
          //   }
          // })

            console.log('callback')
          vm.fetchAftersaveUserListSession(chatUserList);
        })
      },

      fetchAftersaveUserListSession(chatUserList) {
        this.targetUserList = chatUserList; //load to session storage 'roomList'
        sessionStorage.setItem(CHAT_ROOM.STORAGE_KEY_CHAT_USER_LIST, JSON.stringify(chatUserList))
      }
    }
  }
</script>

<style scoped>
  .contacts {
    display: block;
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }

  .contacts li {
    display: inline-block;
    padding: 5px 10px;
    vertical-align: middle;
    text-align: center;
  }

  .contacts li a {
    text-decoration: none;
  }

  .user_img {
    height: 70px;
    width: 70px;
    border: 1.5px solid #f5f6fa;

  }

  .user_img_msg {
    height: 40px;
    width: 40px;
    border: 1.5px solid #f5f6fa;

  }

  .img_cont {
    display: block;
    position: relative;
    height: 70px;
    width: 70px;
    margin: 0 auto;
  }

  .img_cont_msg {
    height: 40px;
    width: 40px;
  }

  .online_icon {
    position: absolute;
    height: 15px;
    width: 15px;
    background-color: #4cd137;
    border-radius: 50%;
    bottom: 0.2em;
    right: 0.4em;
    border: 1.5px solid white;
  }

  .offline {
    background-color: #c23616 !important;
  }

  .user_info {
    display: block;
    padding: 0 0.25rem;
    margin-top: auto;
    margin-bottom: auto;
    line-height: 1.3;
    text-decoration: none;
  }

  .user_info span {
    font-size: 0.75rem;
  }

  .user_info p {
    margin-bottom: 0;
    font-size: 0.5rem;
    color: #999;
  }

  .contacts li a {
    text-decoration: none;
    color: #444;
  }

  .contacts li a:hover {
    color: #007bff;
    font-weight: bold;
  }

  .contacts li a:hover .user_img {
    border-color: #007bff;
  }

</style>
