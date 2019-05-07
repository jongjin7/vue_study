<template>
    <div>
      <userList :chatUserList = "getInvitableList"></userList>
      <p class="text-center pt-2"><button @click="onClickConfirmInvite">초대하기</button></p>
    </div>
</template>

<script>
  import userList from './ChatUserList';
  import {mapActions, mapState, mapGetters, mapMutations } from "vuex";

  export default {
    name: "PopChatInvite",
    data(){
      return{
        inviteUserList:[
          {
            displayName:'jong',
            photoURL:'img src'
          },
          {
            displayName:'jong2',
            photoURL:'img src'
          }
        ],

        checkedMember:'',
      }
    },
    computed:{
      ...mapGetters([
        'getInvitableList',

      ]),

      ...mapState({
        targetUser: ({socket}) => socket.chatRoom.targetUserInfo,
        currentRoomUserList: ({ socket }) => socket.chatRoom.roomUsersList,
        currentRoomUserName: ({ socket }) => socket.chatRoom.roomUsersName,
        roomId: ({ socket }) => socket.chatRoom.roomId,
        newMember: ({ socket }) => socket.chatRoom.invitableList,
      }),

    },
    created(){
      this.fetchUserList();
    },
    mounted(){

    },
    methods:{

      ...mapActions([
        'getUserList'
      ]),

      ...mapMutations([
        'targetUserInfo',
        'roomUsersList',
        'roomUsersName',
        'inviteUserNewMember',
        'afterInviteUsers'
      ]),


      fetchUserList(){
        this.getUserList('invite');
      },

      onClickConfirmInvite(){
        // 초대
        this.inviteUserNewMember();
        // 초대 메시지
        console.log('초대되는 멤버',this.newMember)
        var arrInviteUserList = [];
        var arrInviteUserName = [];
        var updates = {};
        for(var i=0; i < this.newMember.length; i++){
          let inviteUserUid = this.newMember[i].uid;
          let inviteUserName = this.newMember[i].displayName;
          arrInviteUserList.push(inviteUserUid);
          arrInviteUserName.push(inviteUserName);
          updates['RoomUsers/'+ this.roomId +'/'+ inviteUserUid] = true;
        }

        //console.log('초대되는 멤버의 uid,name을 참여 유저별 uid리스트, name리스트와 합치기')
        this.roomUsersList(this.currentRoomUserList.concat(arrInviteUserList));
        this.roomUsersName(this.currentRoomUserName.concat(arrInviteUserName));
        this.afterInviteUsers();
        console.log('초대 update', updates, arrInviteUserName)
        //멤버가 초대되면 새로운 방이 생성되고 인사말이 자동 출력되도록 한다.(방 유지 목적)
        this.$EventBus.$emit('saveMessage',{messageType:'invite', message:'['+arrInviteUserName.join()+']님이 초대되었습니다.', inviteUserNames: arrInviteUserName.join()})
        //현재는 초대 메시지 보내고, 활성화된 챗팅방에서 유저 리스트와 이름을 DB에 저장한다. 0507
        this.$firebaseRealDB.ref().update(updates);

        this.$EventBus.$emit('toggleClose');
      },
    },
    components: {
      userList
    }
  }
</script>

<style scoped>

</style>
