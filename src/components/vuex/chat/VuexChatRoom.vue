<template>
  <div>
    <h1 class="mb-4">Vuex 라이브러리를 이용한 WebChat</h1>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <SearchChatRoomList />
          <ChatUserList :userList="chatUsersList" />
        </div>
        <div class="mesgs">
          <chatRoomView :msgDatas="getMessageData" />
          <messageInputForm v-on:submitMessage="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { USER_DATA } from '../../../common/Constant';
  import { timestampToTime, yyyyMMddHHmmsss } from '@/plugins/timestamp';

  import SearchChatRoomList from './SearchChatRoomList';
  import ChatRoomList from './ChatRoomList';
  import ChatRoomView from './ChatRoomView';
  import messageInputForm from './messageInputForm';
  import ChatUserList from './ChatUserList';

  import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

  export default {
    name: "VuexChatRoom",
    data(){
      return{

      }
    },
    computed: {
      ...mapState({
        roomId: ({ socket }) => socket.chatRoom.roomId,
        currentUser: ({ socket }) => socket.chatUsers.currentUserInfo,
        targetUser: ({ socket }) => socket.chatUsers.targetUserInfo,
        getMessageData: ({ socket }) => socket.chatRoom.msgDatas,
        chatUsersList: ({ socket }) => socket.chatUsersVsList,
      }),

      ...mapGetters([
        'getIsOpenChatRoom'
      ])


    },
    created(){
      this.checkCorrectAccess(); //정상적인 절차로 채팅방 입장하는지 체크
      this.getChatUserList();
    },
    destroyed(){
      if(this.getIsOpenChatRoom){
        this.changeIsOpenChatRoom();
        this.removeMessageList();
        this.removeChatUserList();
      }
    },
    watch:{
      $route : 'checkCorrectAccess'
    },
    methods:{
      ...mapActions([
        'changeIsOpenChatRoom',
        'getMessageList',
        'saveChatRoomId',
        'removeMessageList',
        'chatUserList',
        'removeChatUserList'
      ]),

      getChatUserList(){
        let vm = this;

        let chatUserListRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/UserRooms/'+ this.currentUser.uid);
        chatUserListRef.once('value', (snapshot)=> {
          let tmpData=[]
          snapshot.forEach((data)=>{
            console.log('userList', data.val())
            tmpData.push(data.val())
          })
          vm.chatUserList(tmpData)
        })
      },

      checkCorrectAccess(){
        if(this.getIsOpenChatRoom){
          //새로고침하면 잘못된 접근이라고 판단하고 있음.
          console.log('올바른 챗방접근')
          this.hasCurrentRoomeMessages();
        }else{
          alert('올바른 접근이 아닙니다.')
          this.$router.go(-1);
        }

      },

      hasCurrentRoomeMessages(){
        // 방 존재 체크 ==> 1:1 채팅룸(RoomUsers List)이 생성이 안되어 있다면, 새로운 룸을 생성하고 글쓰기폼을 활성화한다.
        // 글쓰기 안하고 채팅룸 리스트를 선택하면 방의 존재를 체크 후 새로운 방 활성
        let vm = this;
        let regCurrentUser = new RegExp(this.currentUser.uid, 'g');
        let regTargetUser = new RegExp(this.targetUser.uid, 'g');
console.log('uid', regCurrentUser, regTargetUser)

        let roomRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/RoomUsers/');
        roomRef.once('value', (snapshot)=>{
          let dataValue = snapshot.val();
          snapshot.forEach((data)=>{
            let testReg1 = regCurrentUser.test(data.key);
            let testReg2 = regTargetUser.test(data.key);
            console.log('dataKey와 활성화된 채팅방 ID',testReg1, testReg2, data.key)

            if(testReg1 && testReg2){
              console.log('저장되어 있는 채팅방')

              console.log('changeRoomId', vm.roomId)
              let tp = new Promise((resolve,reject)=>{
                setTimeout(()=>{
                  vm.saveChatRoomId(data.key)
                  resolve(data.key); // 채팅방ID 저장
                },30);

              });
              tp.then((newRoomId)=>{
                console.log('promise', vm.roomId, newRoomId)

                let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages/'+ newRoomId);
                messageRef.once('value', (snapshot)=>{
                  console.log('message', snapshot.val())
                })

                vm.fetchMessageList();
              });

            }

          })
        })
      },


      fetchMessageList(){
        let vm = this;
        let count=0;
        console.log('선택한 대화자와 1:1 시작  ==> 메시지 데이타 받기', this.roomId)
        if(this.roomId){
          let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages/' + this.roomId);
          if(messageRef) messageRef.off();

          messageRef.limitToLast(50).on('child_added', (dataSnapShot) => {
            let dataValue = dataSnapShot.val();
            let tmpData = {
              uid: dataValue.uid,
              userName: dataValue.userName,
              profileImg: dataValue.profileImg,
              timeStamp: timestampToTime(dataValue.timeStamp),
              message: dataValue.message
            };
            console.log('data', dataValue.timeStamp, count++)



            vm.getMessageList(tmpData);
          });
        }

      },

      timeStamp(){
        let today = new Date();
        let getDate = {
          currentDate:today,
          //DAY:today.getFullYear() +'.'+ (today.getMonth()+1) +'.'+ today.getDate(),
          fullDate:today.toISOString().slice(0, 10),
          currentTime:((today.getHours()>12)? today.getHours()-12 : today.getHours()) + ":" +
            ("0" + today.getMinutes()).slice(-2) + ":" +
            ("0" + today.getSeconds()).slice(-2),
          timeForm:(today.getHours() < 12 )? '오전':'오후',
          strWeekDay:['일','월','화','수','목','금','토'][today.getDay()],
        }

        //console.log(getDate);

        return getDate;
      },

      dateForm(date){
        let strlocalDate = date.split('');
        strlocalDate[0]+'년 ' + strlocalDate[1]+'월 ' + strlocalDate[2]+'일 ';
        return strlocalDate;
      },

      sendMessage(msg) {
        console.log('vueChat sendMessage')



        // this.pushMsgData({
        //   from: {
        //     name:'나',
        //     date:this.timeStamp().fullDate,
        //     time:this.timeStamp().timeForm +' '+ this.timeStamp().currentTime,
        //   },
        //   msg,
        // });
        // console.log('send', this.loginedMember.photo)
        // // send from message through socket & DB
        // this.$sendMessage({
        //   name: this.loginedMember.name,
        //   photo: this.loginedMember.photo,
        //   date: this.timeStamp().fullDate,
        //   time: this.timeStamp().timeForm +' '+ this.timeStamp().currentTime,
        //   msg,
        //
        // });
      },

      fetchData() {

      },
    },

    components:{
      SearchChatRoomList,
      ChatUserList,
      ChatRoomList,
      ChatRoomView,
      messageInputForm,
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
        &.inactive{
          &:before{
            position: absolute; left:0; top:0;
            display: flex;
            align-items: center;
            justify-content: center;
            width:100%; height:100%;
            background: #fff;
            content:'대화자를 선택하세요.';
            z-index: 10;
            font-size: 24px;
          }
        }

        .bg-view-title{
          background: #c1c1c1;
        }
      }
    }

    .sent_msg p {
      background: #05728f none repeat scroll 0 0;
      border-radius: 3px;
      font-size: 14px;
      margin: 0;
      color: #fff;
      padding: 5px 10px 5px 12px;
      width: 100%;
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
      border-top: 1px solid #c4c4c4;
      position: relative;
      padding-right: 50px;
      padding-left: 15px;

      &.inactive{
        background: rgba(gray,0.2);
      }
    }
    .input_msg_write input {
      background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
      border: medium none;
      color: #4c4c4c;
      font-size: 15px;
      min-height: 48px;
      width: 100%;

      &[readonly]{
        opacity: 0.5;
      }
    }

    .msg_send_btn {
      background: #05728f none repeat scroll 0 0;
      border: medium none;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      font-size: 17px;
      height: 33px;
      position: absolute;
      right: 15px;
      top: 8px;
      width: 33px;

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
