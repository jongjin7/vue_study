<template>
  <div class="mb-5">
    <div v-if="!isLogined">
      <div class="text-center py-4">
        <h1>챗팅!</h1>
        <h2 class="h6">Vuex를 이용한 챗팅방입니다.</h2>
        <p class="pt-3 text-center">
          <button type="button" class="btn btn-primary" @click="$EventBus.$emit('loginPop')">로그인하기</button>
        </p>
      </div>
    </div>
    <!-- 로그인 후 챗팅방 활성 -->
    <div v-else>
      <h1 class="mb-4">Vuex 라이브러리를 이용한 Chat</h1>
      <UserList />

      <div class="messaging">
        <div class="inbox_msg">
          <div class="inbox_people">
            <SearchChatRoomList />
            <ChatRoomList />
          </div>
          <div class="mesgs">
            <chatRoomView :msgs="msgDatas" />
            <messageInputForm v-on:submitMessage="sendMessage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const STORAGE_KEY_MEMBER_INFO = 'memberInfo';

  import Constant from '../../../common/Constant';
  import { mapMutations, mapState } from 'vuex';

  import SearchChatRoomList from './SearchChatRoomList';
  import ChatRoomList from './ChatRoomList';
  import ChatRoomView from './ChatRoomView';
  import messageInputForm from './messageInputForm';
  import UserList from './UserList';

  export default{
    name: 'ChatRoomByVuex',
    data(){
      return{
        datas: [],
        isLogined:false,
        loginedMember : JSON.parse(sessionStorage.getItem(STORAGE_KEY_MEMBER_INFO))
      }
    },
    created(){
      const vm = this;
      if(this.loginedMember){ //로그인시
        //채팅방이 개설 되지 않았다면 개설, 대화자도 없는데 어떻게 대화하지...참여형 대화방...
        // 채팅방 리스트 용도
        //사용자가 참여한 대화 문서를 선택하여 읽어오기 ==> 선택한 리스트 채팅룸에 내용 출력
        //채팅에서 요일 블록을 기준으로 그룹핑하여 출력...


        //프로필은 회원 가입시 저장
        //채팅룸명은 방 개설자 닉네임으로 정의

        //let userData = window.globalVars.loginedUser;
        console.log(this.loginedMember.name)
        this.isLogined = true;

        this.fetchData();

        //socket I/O trigger
        // this.$socket.on('chat', (data) => {
        //   this.pushMsgData(data);
        //   vm.datas.push(data);
        // });

      }else{
        alert('로그인이 필요합니다.')
      }
    },
    computed: {
      ...mapState({
        'msgDatas': state => state.socket.msgDatas,
      }),

    },
    methods:{
      ...mapMutations({
        'pushMsgData': Constant.PUSH_MSG_DATA,
      }),

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



        this.pushMsgData({
          from: {
            name:'나',
            date:this.timeStamp().fullDate,
            time:this.timeStamp().timeForm +' '+ this.timeStamp().currentTime,
          },
          msg,
        });
console.log('send', this.loginedMember.photo)
        // send from message through socket & DB
        this.$sendMessage({
          name: this.loginedMember.name,
          photo: this.loginedMember.photo,
          date: this.timeStamp().fullDate,
          time: this.timeStamp().timeForm +' '+ this.timeStamp().currentTime,
          msg,

        });
      },

      fetchData() {

        //채팅방 개설


        const vm = this;
        this.$firebaseDB.doc('/myChat/chatList/chatRooms/roomA/messages/message2').get().then((doc)=>{
          console.log('fetchData ==> get DB...', doc.data().from)
          vm.$firebaseDB.doc(doc.data().from.path).get().then((doc) => {
            console.log('ref', doc.data().name)
          })
        });
      },
    },
    components:{
      SearchChatRoomList,
      UserList,
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
      height: 570px;
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
    .input_msg_write input {
      background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
      border: medium none;
      color: #4c4c4c;
      font-size: 15px;
      min-height: 48px;
      width: 100%;
    }

    .type_msg {
      border-top: 1px solid #c4c4c4;
      position: relative;
      padding-right: 50px;
      padding-left: 15px;
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

