<template>
  <div class="chat-main">
    <h1 class="mb-4">Vuex, RealDatabase를 이용한 웹 메신저</h1>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <SearchChatRoomList />
          <ChatRoomList :userRoomList="chatRoomListData" v-on:changeChatRoom ="changeChatRoom" />
        </div>
        <div class="mesgs">
          <chatRoomView :msgDatas="messageDatas" :targetUserNames="chatRoomTargetUserNames" :progress ="progressData" />
          <MessageInputForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { USER_DATA, CHAT_ROOM } from '@/common/Constant';
  import { Utils } from '@/plugins/utils';
  import { Timestamp } from '@/plugins/timestamp';

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

        targetUserNames:'',
        chatRoomTargetUserNames:'',
      }
    },
    computed: {
      ...mapState({
        roomId: ({ socket }) => socket.chatRoom.roomId,
        currentUser: ({ socket }) => socket.ownerInfo,
        targetUser: ({ socket }) => socket.chatRoom.targetUserInfo,
        roomUserList: ({ socket }) => socket.chatRoom.roomUsersList,
        openChatRoomInfoRead: ({ socket }) => socket.chatRoom.openChatRoomInfo,
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
        this.targetUserInfo(null);
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
        'openChatRoomInfo',
        'afterInviteUsers'
      ]),
      ...mapGetters([
        'getInvitableList',
      ]),

      refreshRoomData(){
        this.getChatRoomList();
        this.getMessageDatas();
      },

      // todo 구현대기
      // 스토리지 기반 컴포넌트를 사용할때 필수 컴포넌트가
      // 사용자에 의해 임의적으로 삭제되어 있는지 확인하는 함수를 캡슐화해서 플로그인으로 사용할 필요가 있음.
      hasUserLoginDataStorage(){
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

      chatRoomTitle(roomInfoData){
        if(roomInfoData.roomUserlist.length  == 2){
          //roomType 1:1
          this.chatRoomTargetUserNames = roomInfoData.targetUser.displayName;
        }else{
          //roomType: multi
          //채팅룸 참여자 타이틀
          this.chatRoomTargetUserNames = roomInfoData.targetUser.map((user) => {
            return user.displayName;
          }).join(',');
        }
      },

      checkOpenedChatRoom(){
        let openRoomInfo = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM);

        if(openRoomInfo !== null){
          let roomInfoData = JSON.parse(openRoomInfo);
          this.isOpenChatRoom = true;
          this.setRoomId(roomInfoData.roomId);

          //채팅 참여 가능 리스트 ==> 적당한 위치로 옮기기
          let chatUsers = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_CHAT_USER_LIST);
          this.chatUserList(JSON.parse(chatUsers));
          // targetUser 등록
          this.targetUserInfo(roomInfoData.targetUser);

          this.chatRoomTitle(roomInfoData);

          this.roomUsersList(roomInfoData.roomUserlist);
          this.roomUsersName(roomInfoData.roomUserName);

          this.getChatRoomList();
          this.openChatRoomInfo(roomInfoData);
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
            tmp.roomUserlist = tmp.roomUserlist.split(CHAT_ROOM.SPLIT_CHAR);
            tmp.timestamp = Timestamp.timeForRoomList(tmp.timestamp);
            tmp.lastMessage = (()=>{
              // html태그 존재시 일반 문자열로 변
              const regExp = /<(\/)?([a-zA-Z1-6]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;
              if(regExp.test(tmp.lastMessage)){
                return tmp.lastMessage.replace(regExp, '');
              }else{
                return tmp.lastMessage;
              }
            })();
            // todo 활성화된 룸 타이틀 변경 디버깅 중
            // refresh할때 invite값 존재 시 타이틀 값 변경 금지
            // 저장할때 룸리스트에 타켓유저 정보도 같이 넘겨야함...아니면 유저uid를 넘겨서 룸리스트 저장소를 업데이트 시켜야한다.
            //console.log('messageType:::=>', tmp.messageType, tmp.roomId ,this.roomId)
            if(tmp.messageType === 'invite' && tmp.roomId === this.roomId){
              let oldMemberName = this.chatRoomTargetUserNames;
              let newMemberName = [];
              console.log('isMember', this.roomUserList, this.targetUser)
              let oldUsersList = this.roomUserList;
              let filterMember =  oldUsersList.filter((uid) => {
                let isMember = tmp.inviteUserUid.includes(uid);
                if(isMember) {
                  let tmp = this.targetUser.filter(user => user.uid === uid);
                  let newMem = this.targetUser.concat(tmp);


                    this.targetUserInfo(newMem);
                    console.log('name', tmp, newMem, this.targetUser)
                    //newMemberName.push(tmp[0].displayName);
                }
                return isMember;
              });
              console.log('oldMember2', )
              //this.roomUsersList();
              //this.afterInviteUsers();
              if(filterMember.length < 1) this.chatRoomTargetUserNames =  oldMemberName+ ',' + tmp.inviteUserUid;
            }

            tmpData.push(tmp);
          });
          console.log('UserRooms roomList', tmpData)
          vm.chatRoomListData = tmpData;

          vm.chatRoomList(tmpData);

          //새로운 멤버 추가 ==> emit으로 룸 타이틀 갱신필요


          //sessionStorage.setItem('chatRoomList', JSON.stringify(tmpData));
        });
      },


      changeChatRoom(roomData){
        console.log('changeChantRoom', roomData, );

        sessionStorage.setItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM, JSON.stringify(roomData));
        this.setCurrentRoomTotalMessage(null);
        this.messageDatas = [];
        this.checkOpenedChatRoom();
        if($('.messaging').hasClass('closed')) $('.messaging').removeClass('closed');
      },

      getMessageDatas(){
        let vm = this;
        vm.messageDatas =[];

        console.log('getMessageData')
        let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages/' + this.roomId);
        if(messageRef) messageRef.off();
        //this.propTargetUser = roomInfo.targetUser; //자식 컴포넌트로 내보낼 대화상대 정보

        let dayCount=0;
        let prevDay = 0, currentDay = 0, prevMonth = 0, currentMonth = 0;
        messageRef.limitToLast(50).on('child_added', (dataSnapShot) => {
          let dataValue = dataSnapShot.val();
          if(this.roomId !== dataValue.roomId) return false;
          let tmpData = {
            uid: dataValue.uid,
            displayName: dataValue.displayName,
            photoURL: dataValue.photoURL,
            timeStamp: Timestamp.timestampToTime(dataValue.timeStamp, 'Hm'),
            strNewDay: (function(){
              let tmpDay = Timestamp.getDayTime(dataValue.timeStamp)
              prevDay = currentDay;
              currentDay = tmpDay.day;
              prevMonth = currentMonth;
              currentMonth = tmpDay.month;
              //console.log('dayTime', tmpDay);
              //조건 정리가 필요함
              // 이번달이 지난달보다 숫자가 작을때 ==> 추가비교: 년도로 평가
              // 오늘 날짜가 어제날짜보다 작을때 ==> 추가 비교: month값으로 평가
              //오늘 날짜가 어제날짜보다 클때 ==> 추가 비교 필요 없음.
              if((currentDay < prevDay && currentMonth > prevMonth) || (currentDay > prevDay)){
                return Timestamp.timestampToTime(dataValue.timeStamp, 'YMD');
              }else{
                return null;
              }
            })(),
            message: dataValue.message
          };

          vm.messageDatas.push(tmpData);
          vm.setCurrentRoomTotalMessage(tmpData);
        });
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
  .chat-main{
    
  }

  .messaging {
    padding: 0 0 50px 0;
    img {
      min-width: 30px;
      max-width: 100%;
    }
    .inbox_msg {
      height:650px;
      display: flex;
      border: 1px solid #c4c4c4;
      clear: both;
      overflow: hidden;
    }
    .inbox_people {
      background: #f8f8f8 none repeat scroll 0 0;
      float: left;
      overflow: hidden;
      width: 40%; height:100%;
      border-right: 1px solid #c4c4c4;

    }

    .inbox_chat {
      position: relative;
      height: calc(100% - 46px);
      overflow-y: auto;
      background: #c4c4c4;

      /*&:after{
        display: block;
        position: absolute; left:0; bottom:1px; right:0;
        border-top: 1px solid #fff;
        margin-top: -1px;
        content:'';
      }*/

      .chat_list {
        margin: 0;
        padding: 18px 16px 10px;
        background: #fff;
        border-bottom: 1px solid #c4c4c4;

        /*&:last-of-type{
          border-bottom: none;
        }*/

        &:hover{
          background: #eaeaea;
        }
      }

      .chat_people {
        overflow: hidden;
        clear: both;
      }
    }

    .active_chat {
      background: #ebebeb;
    }

    .top_spac {
      margin: 20px 0 0;
    }

    .headind_srch {
      position: relative;
      padding: 10px 29px 10px 20px;
      overflow: hidden;
      border-bottom: 1px solid #c4c4c4;

      .srch_bar {
        display: none;
        position: absolute; right:0; top:0;
        width:180px;
        padding: 7px 14px 7px 0;
        text-align: right;

        .inner_srch_bar{
          display: flex;
          background: rgba(white, 0.8);
          input {
            border: 1px solid #cdcdcd;
            border-width: 0 0 1px 0;
            width: 100%;
            padding: 2px 4px 4px 6px;
            background: transparent;
          }
          
        }
      }
    }

    .recent_heading {
      h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;

        .toggle-room-list {
          display: none;
          cursor: pointer;
          border:none;
          padding:0;
          background: none;
        }
      }
    }

    .srch_bar .input-group-addon button {
      background: none;
      border: none;
      padding: 0;
      margin: 4px 5px 3px;
      color: #707070;
      cursor:pointer;
    }
    .srch_bar .input-group-addon {

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



    .mesgs {
      float: left;
      width: 60%;
      position: relative;
      .view-container{
        padding-top: 46px;

        .bg-view-title{
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute; left:0; top:0; right:0;
          z-index: 2;
          background: #c1c1c1;
          min-height:46px;
          overflow: hidden;
          line-height:1.4;
        }

        .msg_history {
          height: 554px;
          padding-right: 10px;
          padding-left: 15px;
          overflow-y: scroll;
        }

        .hr-date {
          position: relative;
          margin: 0 0 1rem;
          text-align: center;

          &:before {
            display: block;
            position: absolute;
            left: 0;
            top: 50%;
            border-top: 1px solid #eee;
            width: 100%;
            content: '';
          }

          span {
            position: relative;
            background: #fff;
            padding: 0 1rem;
          }
        }

        .time_date {
          color: #747474;
          display: block;
          font-size: 12px;
          margin: 8px 0 0;
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
        .received_withd_msg {
          width: 57%;
        }

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
      }
    }



    .type_msg {
      display:flex;
      //height:80px;
      height:50px;
      align-items:center;
      border-top: 1px solid #c4c4c4;
      position: relative;
      background:#e9e9e9;

      input, button, textarea{
        outline:none;
        -webkit-border-radius:0;
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
      display: block;
      position:relative;
      border: none;
      cursor: pointer;
      margin-bottom:0;
      color:#05728f;
      line-height:1;


      &.send_msg{
        top:0;
        width:60px;
        font-size:36px;
        background:transparent;
        padding:0;
        i.txt{
          position:absolute; left:0; right:0;top:9px;
          text-align: center;
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
    .chat-main{
      h1{
        display: none;
      }
    }
    .messaging{
      padding: 2.4vh 0 2vh;
      .inbox_msg{
        display: block;
        position: relative;
        height:auto;
      }
      .inbox_people{
        float: none;
        width:100%;
        border-right: none;
        .headind_srch{

        }

        h4{
          .toggle-room-list{
            display: inline-block;
            transform:rotate(-180deg);
            color:#444;
          }
        }
        .inbox_chat{
          display: none;
          position: absolute; left:0; top:46px;
          z-index: 10;
          width:100%;
          background: rgba(#000, 0.5);

          &::-webkit-scrollbar-track{
            background: #f1f1f1;
          }
          &::-webkit-scrollbar-thumb{
            background: #888;
          }
          &::-webkit-scrollbar{
            width:6px;
            background: #fff;
          }

          .chat_list{

          }
        }
      }

      .mesgs{
        float:none;
        width:100%;

        .view-container{
          padding-top: 0;
          .bg-view-title{
            position: static;
          }
          .msg_history{
            height:54vh;
          }
        }
      }



      // 룸 리스트
      &.closed{
        .inbox_people{
          h4{
            .toggle-room-list{
              transform:rotate(0deg);
            }
          }
          &:after{
            display: none;
          }
          .inbox_chat{
            display: block;
          }
        }


      }
    }
  }

</style>
