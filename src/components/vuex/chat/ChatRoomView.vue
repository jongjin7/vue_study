<template>
  <div class="view-container">
    <div class="bg-view-title py-2 text-center"><strong>{{ targetUser.displayName }}</strong>님과 채팅중입니다.</div>
    <div class="msg_history" v-auto-bottom="msgDatas">
      <div class="hr-date small"><span>2019.01.29 (화)</span></div>
      <div :class="{'incoming_msg':(msg.uid === targetUser.uid ), 'outgoing_msg':(msg.uid === currentUser.uid )}" v-for="(msg, index) in msgDatas">
        <div class="incoming_msg_img" v-if="msg.uid === targetUser.uid">
          <span :style="'background-image: url(' + msg.profileImg + ');'" class="pic rounded-circle"></span>
          {{ msg.displayName }}
        </div>
        <div class="received_msg" v-if="msg.uid === targetUser.uid">
          <div class="received_withd_msg">
            <p>{{ msg.message }}</p>
            <span class="time_date">{{ msg.timeStamp }}</span>
          </div>
        </div>
        <div class="sent_msg" v-else>
          <p>{{ msg.message }}</p>
          <span class="time_date">{{ msg.timeStamp }}</span>
        </div>
      </div>
      <!--<div class="outgoing_msg">
        <div class="sent_msg">
          <p>Test which is a new approach to have all
            solutions</p>
          <span class="time_date"> 11:01 AM    |    June 9</span> </div>
      </div>
      <div class="incoming_msg">
        <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
        <div class="received_msg">
          <div class="received_withd_msg">
            <p>Test, which is a new approach to have</p>
            <span class="time_date"> 11:01 AM    |    Yesterday</span></div>
        </div>
      </div>
      <div class="outgoing_msg">
        <div class="sent_msg">
          <p>Apollo University, Delhi, India Test</p>
          <span class="time_date"> 11:01 AM    |    Today</span> </div>
      </div>
      <div class="incoming_msg">
        <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
        <div class="received_msg">
          <div class="received_withd_msg">
            <p>We work directly with our designers and suppliers,
              and sell direct to you, which means quality, exclusive
              products, at a price anyone can afford.</p>
            <span class="time_date"> 11:01 AM    |    Today</span></div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
    export default {
      name: "ChatRoomView",
      props:[
        'msgDatas'
      ],
      data(){
        return{
          tmp:''
        }
      },
      created(){
      },
      computed:{
        ...mapState({
          roomId: ({ socket }) => socket.chatRoom.roomId,
          currentUser: ({ socket }) => socket.connectedUserData,
          targetUser: ({ socket }) => socket.chatUsers.targetUserInfo
        }),
      },
      methods:{
        fetchMessageList(){

        }
      }

    }
</script>

<style lang="scss" scoped>
  .hr-date{
    position: relative;
    padding:1rem 0;
    text-align: center;
    &:before{
      display: block;
      position: absolute; left:0; top:50%;
      border-top: 1px solid #eee;
      width:100%;
      content: '';
    }
    span{
      position: relative;
      background: #fff;
      padding:0 1rem;
    }
  }

</style>
