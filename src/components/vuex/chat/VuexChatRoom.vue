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
          <chatRoomView :msgDatas="messageDatas" :progress ="progressData" />
          <MessageInputForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { USER_DATA, CHAT_ROOM } from '../../../common/Constant';
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
      }
    },
    computed: {
      ...mapState({
        roomId: ({ socket }) => socket.chatRoom.roomId,
        currentUser: ({ socket }) => socket.connectedUserData,
        targetUser: ({ socket }) => socket.chatUsers.targetUserInfo,
      }),

      ...mapGetters([
        'getIsOpenChatRoom',
      ])


    },
    created(){
      this.checkCorrectAccess(); //정상적인 절차로 채팅방 입장하는지 체크
      this.getChatRoomList();

      this.$EventBus.$on('changeProgressRatio', this.changeProgressRatio)
    },
    destroyed(){
      if(this.getIsOpenChatRoom){
        this.changeIsOpenChatRoom();
        this.messageDatas = [];
      }
    },
    watch:{
      $route : 'checkCorrectAccess'
    },
    methods:{
      test(){
        console.log('search에서 트리거')
      },

      changeProgressRatio(data){
        console.log('changeProgress', data)
        this.progressData = data;
      },
      ...mapMutations([
        'updateMessageDatas',
      ]),
      ...mapActions([
        'changeIsOpenChatRoom',
      ]),

      getChatRoomList(){
        let vm = this;
        let rootRoomRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME);
        let roomRef = rootRoomRef.child('UserRooms/'+this.currentUser.uid );
        roomRef.off();

        roomRef.on('value', (dataSnapShot) =>{
          let tmpData = []
          dataSnapShot.forEach((data) =>{
            let tmp = data.val();
            tmp.roomUserName = tmp.roomUserName.split(CHAT_ROOM.SPLIT_CHAR);
            tmp.timestamp = timeForRoomList(tmp.timestamp);
            tmpData.push(tmp);
          });
          console.log('roomList', tmpData)
          vm.chatRoomListData = tmpData;
        });
      },

      checkCorrectAccess(){
        if(this.getIsOpenChatRoom){
          //새로고침하면 잘못된 접근이라고 판단하고 있음.
          console.log('올바른 챗방접근')
          this.getMessageDatas();
        }else{
          alert('올바른 접근이 아닙니다.')
          this.$router.push('/chat');
        }

      },

      changeChatRoom(){
        this.messageDatas = [];
        this.getMessageDatas();
      },

      getMessageDatas(){
        let vm = this;
        let count=0;
        console.log('선택한 대화자와 1:1 시작  ==> 메시지 데이타 받기', this.targetUser)
        if(this.roomId){
          let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages/' + this.roomId);
          if(messageRef) messageRef.off();

          messageRef.limitToLast(50).on('child_added', (dataSnapShot) => {
            let dataValue = dataSnapShot.val();
            let tmpData = {
              uid: dataValue.uid,
              displayName: dataValue.displayName,
              photoURL: dataValue.photoURL,
              timeStamp: timestampToTime(dataValue.timeStamp),
              message: dataValue.message
            };

            //console.log('data', tmpData.uid, vm.targetUser.uid, vm.currentUser.uid)
            if( tmpData.uid == vm.targetUser.uid || tmpData.uid == vm.currentUser.uid) vm.messageDatas.push(tmpData);
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
                padding:10px;
                .before-info{
                  .icon{
                    display:block;
                    font-size:72px;
                  }
                }
                .after-info{
                  display:none;
                  .progress{
                    background:#cbd4da;
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
      textarea {
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
        width:100%; height:100%;
        z-index:1;
        border:1px solid blue;
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
