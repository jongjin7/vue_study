<template>
  <div class="view-container" :class="{ inactive : getChatTargetUser === null }">
    <div class="bg-secondary py-2 text-center text-light"><strong>{{ getChatTargetUser }}</strong>님과 채팅중입니다.</div>
    <div class="msg_history" v-auto-bottom="msgs">
      <div class="hr-date small"><span>2019.01.29 (화)</span></div>
      <div :class="{'incoming_msg':(msg.from.name !== '나'), 'outgoing_msg':(msg.from.name === '나')}" v-for="(msg, index) in msgs">
        <div class="incoming_msg_img" v-if="msg.from.name !== '나'">
          <span :style="'background-image: url(' + msg.from.photo + ');'" class="pic rounded-circle"></span>
          {{msg.from.name}}
        </div>
        <div class="received_msg" v-if="msg.from.name !== '나'">
          <div class="received_withd_msg">
            <p>{{ msg.msg }}</p>
            <span class="time_date">{{ msg.from.time }}</span>
          </div>
        </div>
        <div class="sent_msg" v-else>
          <p>{{ msg.msg }}</p>
          <span class="time_date">{{ msg.from.time }}</span>
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
  import { mapGetters } from 'vuex'
    export default {
      name: "ChatRoomView",
      props: ['msgs'],
      data(){
        return{
          isOpenRoom:false,
        }
      },
      created(){
        this.test()
      },
      computed:{
        ...mapGetters(['getChatTargetUser']),
      },
      methods:{
        test(){
          console.log('mapGet', typeof this.getChatTargetUser)
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
