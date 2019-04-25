<template>
  <div>
    <h1 class="mb-4">Vuex, RealDatabase를 이용한 웹 메신저</h1>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <SearchChatRoomList />
          <ChatRoomList :userRoomList="chatRoomListData" v-on:changeChatRoom ="changeChatRoom" />
        </div>
        <div class="mesgs">
          <chatRoomView :msgDatas="messageDatas" :targetUser="propTargetUser" :progress ="progressData" />
          <MessageInputForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { USER_DATA, CHAT_ROOM } from '@/common/Constant';
  import { Utils } from '@/plugins/utils';
  import { timestampToTime, yyyyMMddHHmmsss, timeForRoomList } from '@/plugins/timestamp';

  import SearchChatRoomList from './SearchChatRoomList';
  import ChatRoomList from './ChatRoomList';
  import ChatRoomView from './ChatRoomView';
  import MessageInputForm from './MessageInputForm';

  import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

  export default {
    name: "VuexChatRoom",
    data(){
      return{
        chatRoomListData:'',
        messageDatas:[],
        progressData:'',

        chatRoomViewData:'',
        isOpenChatRoom:false,

        propTargetUser:'',
      }
    },
    computed: {
      ...mapState({
        roomId: ({ socket }) => socket.chatRoom.roomId,
        currentUser: ({ socket }) => socket.ownerInfo,
        targetUser: ({ socket }) => socket.chatRoom.targetUserInfo,
      }),


    },
    created(){
      //this.checkCorrectAccess(); //정상적인 절차로 채팅방 입장하는지 체크

      this.$EventBus.$on('changeProgressRatio', this.changeProgressRatio);
      this.$EventBus.$on('updateMessageData', this.getMessageDatas);
      //this.$EventBus.$on('changeChatRoom', this.changeChatRoom1);

      this.checkOpenedChatRoom();
    },
    destroyed(){
      if(this.isOpenChatRoom){
        this.isOpenChatRoom = false;

        this.messageDatas = [];
        this.chatRoomViewData ='';
        this.setCurrentRoomTotalMessage(null);
        sessionStorage.removeItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM);

        if(!/\/chat/gi.test(location.hash)){ //이동하는 페이지가 채팅룸 메인이 아니라면?
          sessionStorage.removeItem(CHAT_ROOM.STORAGE_KEY_CHAT_USER_LIST);
          sessionStorage.removeItem(CHAT_ROOM.STORAGE_KEY_CHAT_ROOM_LIST);
        }
      }
    },
    watch:{

    },
    methods:{
      ...mapMutations([
        'updateMessageDatas',
        'isCloseChatRoom',
        'setCurrentRoomTotalMessage',
        'chatUserList',
        'chatRoomList',
        'setRoomId',
        'roomUsersList',
        'roomUsersName',
        'targetUserInfo',
      ]),

      refreshRoomData(roomData){
        this.getChatRoomList();
        this.getMessageDatas(roomData);
      },

      // todo 구현대기
      // 스토리지 기반 컴포넌트를 사용할때 필수 컴포넌트가
      // 사용자에 의해 임의적으로 삭제되어 있는지 확인하는 함수를 캡슐화해서 플로그인으로 사용할 필요가 있음.
      checkHasNecessaryStorage(){
        //로그인 정보를 갖는 스토리지를 제거했는지 체크!
        let storageCurrentUser = sessionStorage.getItem(USER_DATA.CURRENT_USER);
        if(storageCurrentUser === null) {
          location.reload(true);
        }
      },

      changeProgressRatio(data){
        console.log('changeProgress', data)
        this.progressData = data;
      },

      checkOpenedChatRoom(){
        let openRoomInfo = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM);

        if(openRoomInfo !== null){
          let roomInfoData = JSON.parse(openRoomInfo);
          this.isOpenChatRoom = true;
          this.setRoomId(roomInfoData.roomId);

          let chatUsers = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_CHAT_USER_LIST);
          this.chatUserList(JSON.parse(chatUsers));
          //참여인원이 3인이상이면...
          console.log('aaaaa', roomInfoData.roomType, CHAT_ROOM.TYPE_MULTI)
          if(roomInfoData.roomType == CHAT_ROOM.TYPE_MULTI){
            console.log('targetUserInfo', roomInfoData.targetUser)
          }

          this.targetUserInfo(roomInfoData.targetUser);

          let roomUsersUid = [roomInfoData.targetUser.uid, this.currentUser.uid]; // 챗방 유저리스트
          let roomUsersName = [roomInfoData.targetUser.displayName, this.currentUser.displayName] // 챗방 유저 이름

          this.roomUsersList(roomUsersUid);
          this.roomUsersName(roomUsersName);

          this.getChatRoomList();
          this.getMessageDatas(roomInfoData);

        }else{
          alert('비정상적인 접근입니다.');
          this.$router.push('/chat');
        }

      },



      getChatRoomList(){
        let vm = this;
        console.log('getChatroomList',this.currentUser.uid)
        let rootRoomRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).child('UserRooms/'+this.currentUser.uid );
        rootRoomRef.off();

        rootRoomRef.on('value', (dataSnapShot) =>{
          let tmpData = []
          dataSnapShot.forEach((data) =>{
            let tmp = data.val();
            //console.log('getRoomList', tmp, tmp.roomUserName)
            tmp.roomUserName = tmp.roomUserName.split(CHAT_ROOM.SPLIT_CHAR);
            tmp.timestamp = timeForRoomList(tmp.timestamp);
            tmpData.push(tmp);
          });
          console.log('UserRooms roomList', tmpData)
          vm.chatRoomListData = tmpData;

          vm.chatRoomList(tmpData);
        });
      },


      changeChatRoom(roomData){
        console.log('vuexChatRoom changeChantRoom', roomData);

        sessionStorage.setItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM, JSON.stringify(roomData));
        //
        // this.setCurrentRoomTotalMessage(null);
        // this.messageDatas = [];
         this.checkOpenedChatRoom();
      },

      getMessageDatas(roomInfo){
        let vm = this;
        vm.messageDatas =[];

        console.log('getMessageData', roomInfo)
        if(roomInfo.roomId){
          let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages/' + roomInfo.roomId);
          if(messageRef) messageRef.off();
          this.propTargetUser = roomInfo.targetUser; //자식 컴포넌트로 내보낼 대화상대 정보

          messageRef.limitToLast(50).on('child_added', (dataSnapShot) => {
            let dataValue = dataSnapShot.val();
            let tmpData = {
              uid: dataValue.uid,
              displayName: dataValue.displayName,
              photoURL: dataValue.photoURL,
              timeStamp: timestampToTime(dataValue.timeStamp),
              message: dataValue.message
            };

            //console.log('data', tmpData.uid, roomInfo.targetUser.uid, vm.currentUser.uid)
            if( tmpData.uid == roomInfo.targetUser.uid || tmpData.uid == vm.currentUser.uid) {
              //console.log('data download...')
              vm.messageDatas.push(tmpData);
              vm.setCurrentRoomTotalMessage(tmpData);
            }
          });
        }

      },

    },

    components:{
      SearchChatRoomList,
      ChatRoomList,
      ChatRoomView,
      MessageInputForm,
    }
  }
</script>

<style lang="scss">
  .messaging {
    img {
      min-width: 30px;
      max-width: 100%;
    }
    .inbox_people {
      background: #f8f8f8 none repeat scroll 0 0;
      float: left;
      overflow: hidden;
      width: 40%;
      border-right: 1px solid #c4c4c4;
    }
    .inbox_msg {
      display: flex;
      border: 1px solid #c4c4c4;
      clear: both;
      overflow: hidden;
    }
    .top_spac {
      margin: 20px 0 0;
    }
    .srch_bar {
      display: inline-block;
      text-align: right;
      width: 60%;
      padding: 0;
    }
    .headind_srch {
      padding: 10px 29px 10px 20px;
      overflow: hidden;
      border-bottom: 1px solid #c4c4c4;
    }

    .recent_heading {
      float: left;
      width: 40%;

      h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;

        span {
          display: none;
        }
      }
    }
    .srch_bar input {
      border: 1px solid #cdcdcd;
      border-width: 0 0 1px 0;
      width: 80%;
      padding: 2px 0 4px 6px;
      background: none;
    }
    .srch_bar .input-group-addon button {
      background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
      border: medium none;
      padding: 0;
      color: #707070;
      font-size: 18px;
    }
    .srch_bar .input-group-addon {
      margin: 0 0 0 -27px;
    }

    .chat_ib h5 {
      font-size: 15px;
      color: #464646;
      margin: 0 0 8px 0;
    }
    .chat_ib h5 span {
      font-size: 13px;
      float: right;
    }
    .chat_ib p {
      font-size: 14px;
      color: #989898;
      margin: auto
    }
    .chat_img {
      float: left;
      width: 11%;
    }
    .chat_ib {
      float: left;
      padding: 0 0 0 15px;
      width: 88%;
    }

    .chat_people {
      overflow: hidden;
      clear: both;
    }
    .chat_list {
      border-bottom: 1px solid #c4c4c4;
      margin: 0;
      padding: 18px 16px 10px;

      &:hover{
        background: #eaeaea;
      }
    }
    .inbox_chat {
      height: 100%;
      overflow-y: scroll;
    }

    .active_chat {
      background: #ebebeb;
    }

    .incoming_msg{
      margin: 26px 0 26px;

      .incoming_msg_img {
        display: inline-block;
        width: 6%;
        font-size: 0.5rem;
        text-align: center;

        .pic{
          display: inline-block;
          width:100%; padding-top:100%;
          margin-bottom: 0.25rem;
          background-size: cover;
          background-position: center center;
          background-repeat:no-repeat;
          vertical-align: middle;
        }
      }
    }

    .received_msg {
      display: inline-block;
      padding: 0 0 0 10px;
      vertical-align: top;
      width: 92%;
    }
    .received_withd_msg p {
      background: #ebebeb none repeat scroll 0 0;
      border-radius: 3px;
      color: #646464;
      font-size: 14px;
      margin: 0;
      padding: 5px 10px 5px 12px;
      width: 100%;
      word-break: break-all;

    }
    .time_date {
      color: #747474;
      display: block;
      font-size: 12px;
      margin: 8px 0 0;
    }
    .received_withd_msg {
      width: 57%;
    }
    .mesgs {
      float: left;
      //padding: 12px 0 0 0;
      width: 60%;

      .view-container{
        position: relative;
        &.is-dragover{
          .dragdrop-input{
            display:block;
            pointer-events: none;
          }
        }

        &.after-drop{
          .dragdrop-input{
            .inner-wrap{
              &:before{
                display:block;
                position:absolute; width:100%; height:100%;
                content:'';
                border:1px solid transparent;
                animation:fileInputShow 2s infinite ease-in-out;
              }
              .result-msg{
                //pointer-events: auto;
                .file-upload-droparea{
                  .before-info{
                    display: none;
                  }
                  .after-info{
                    display: block;
                  }
                }
              }
            }
          }
        }

        //드래그드롭 인풋
        .dragdrop-input{
          display:none;
          //opacity:0;

          .inner-wrap{
            display:flex;
            align-items:center;
            justify-content:center;
            position:absolute; left:0; right:0; top:0; bottom:0;
            z-index:10;
            background:rgba(white, 0.8);

            .result-msg{
              position:relative;
              min-width:300px;
              //width:80%;
              h1{
                color:red;
                .icon{
                  display:block;
                }
              }
              .file-upload-droparea{
                background:rgba(#eaeaea,1);
                border-radius:10px;
                border:1px solid #e1e1e1;
                padding:15px 10px;
                max-width: 400px;

                .before-info{
                  .icon{
                    display:block;
                    font-size:72px;
                  }
                }
                .after-info{
                  display:none;

                  .file-list{
                    width:90%;
                    margin: 15px auto 0;
                  }

                  .file-name{
                    font-size: 0.5em;
                    margin-bottom: 0.5em;
                    line-height:1;
                  }
                  .progress{
                    background:#cbd4da;
                  }

                  button{
                    font-size: 0.65em;
                    padding:0.15em 0.5em;
                  }
                }
              }

              .btn-mini{
                position:absolute; top:-30px; right:-30px;
                cursor:pointer;
                width:50px; height:50px;
                border:none;
                border-radius:50%;
                box-shadow:2px 2px 10px rgba(black, 0.1);
              }
            }
          }
        }

        @keyframes fileInputShow{
          0%{
            border-width:1px;
            border-color:transparent;
          }
          50%{
            border-width:5px;
            border-color:#ffc107;
          }
        }



        .bg-view-title{
          background: #c1c1c1;
        }
      }
    }

    .sent_msg p {
      background: #eaeaea;
      border-radius: 3px;
      font-size: 14px;
      margin: 0;
      color: #444;
      padding: 5px 10px 5px 12px;
      width: 100%;
      word-break: break-all;
    }
    .outgoing_msg {
      overflow: hidden;
      margin: 26px 0 26px;
    }
    .sent_msg {
      float: right;
      width: 46%;

    }

    .type_msg {
      display:flex;
      //height:80px;
      height:45px;
      align-items:center;
      border-top: 1px solid #c4c4c4;
      position: relative;
      background:#e9e9e9;

      input, button, textarea{
        outline:none;
      }
    }
    .file-label{
      position:absolute; left:0; top:0;
    }
    .input_msg_write {
      position:relative;
      height: inherit; width:100%;
      .blank{
        position:absolute; top:0; right:-50px;
        display:block;
        vertical-align:top;
        width:50px; height:inherit;
        content:'';
        background:#f8f8f8;
      }
      .write_msg {
        position:absolute; left:0; top:0; z-index:2;
        background: #f8f8f8;
        border: none;
        color: #4c4c4c;
        font-size: 15px;
        width: 100%; height:inherit;
        vertical-align:top;
        overflow-y:auto;
        resize: none;

        &[readonly]{
          opacity: 0.5;
        }
        &:focus{
          background:#fff;
          &+.blank{
            display:block;
            background:#fff;
          }
        }
      }

      input[type="file"] {
        position:absolute; left:0; top:0;
        //width:100%; height:100%;
        z-index:1;
        //border:1px solid blue;
      }
    }


    .btn_send {
      //background: #05728f;
      position:relative;
      border: medium none;
      cursor: pointer;
      margin-bottom:0;
      color:#05728f;
      line-height:1;

      &.send_msg{
        top:2px;
        font-size:36px;
        background:transparent;
        i.txt{
          position:absolute; left:14px; top:9px;
          font-size:11px;
          color:#fff;
        }
      }

      &.send_file{
        margin:-2px 8px 0 6px;
        font-size:30px;
      }

      &[disabled]{
        cursor:default;
        opacity: 0.5;
      }
    }
    .messaging {
      padding: 0 0 50px 0;
    }
    .msg_history {
      height: 560px;
      padding-right: 10px;
      padding-left: 15px;
      overflow-y: scroll;
    }

    .msg_box{
      img{
        border-radius:3px;
        margin: 4px 0;
      }
      a:hover{
        img{
          opacity: 0.8;
        }
      }
    }
  }





  @media (max-width:767px){
    .messaging{
      .inbox_msg{
        display: block;
      }
      .inbox_people{
        width:100%;

        .headind_srch{
          .recent_heading{
            cursor: pointer;
            &:hover{
              opacity: 0.5;
            }
          }

        }

        h4{
          span{
            display: inline-block;

            .fa-toggle-off{
              display: none;
            }
          }
        }
      }
      .inbox_chat{
        height:30vh;
        border-bottom: 10px solid #f1f1f1;
      }
      .inbox_people:after{
        display: block;
        border-bottom: 1px solid #dadada;
        content: '';
        width:100%;
      }
      .mesgs{
        width:100%;
      }

      .msg_history{
        height:50vw;
      }

      // 룸 리스트
      &.closed{
        .inbox_people{
          h4{
            .fa-toggle-on{
              display: none;
            }
            .fa-toggle-off{
              display: block;
            }
          }
          &:after{
            display: none;
          }
          .inbox_chat{
            display: none;
          }
        }

        .msg_history{
          height:80vw;
        }
      }
    }
  }

</style>
