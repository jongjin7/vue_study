<template>
    <div>
      <div v-if="getInvitableList.length > 0">
        <userList :chatUserList = "getInvitableList" />
        <p class="text-center pt-2"><button @click="onClickConfirmInvite">초대하기</button></p>
      </div>
      <div v-else>
        초대하고자하는 사용자가 없습니다.
      </div>
    </div>
</template>

<script>
  import userList from './ChatUserList';
  import {mapActions, mapState, mapGetters, mapMutations } from "vuex";

  export default {
    name: "PopChatInvite",
    data(){
      return{
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

      ]),


      fetchUserList(){
        this.getUserList('invite');
      },

      onClickConfirmInvite(){
        // 초대
        this.inviteUserNewMember();
        // 초대 메시지
        console.log('초대되는 멤버',this.newMember)
        if(this.newMember.length > 0){
          var arrInviteUserList = [];
          var arrInviteUserName = [];
          var updates = {};
          for(var i=0; i < this.newMember.length; i++){
            let inviteUserUid = this.newMember[i].uid;
            let inviteUserName = this.newMember[i].displayName;
            arrInviteUserList.push(inviteUserUid);
            arrInviteUserName.push(inviteUserName);
          }

          //초대되는 멤버의 uid,name을 참여 유저별 uid리스트, name리스트와 합치기
          //this.roomUsersName(this.currentRoomUserName.concat(arrInviteUserName));
          console.log('초대 update', updates, arrInviteUserName)
          //멤버가 초대되면 새로운 방이 생성되고 인사말이 자동 출력되도록 한다.

          //todo 에러::: 1:1방에서 한사람을초대하고, 초대받은 사람이 챗팅룸에 들어올 수 가 없다. 활성화된 채팅룸이 없다.
          this.$EventBus.$emit('saveMessage',{
            messageType:'invite',
            message:'['+arrInviteUserName.join()+']님이 초대되었습니다.',
            inviteUserUid: arrInviteUserList,
          });

          //this.$firebaseRealDB.ref().update(updates);
          this.$EventBus.$emit('toggleClose');
        }else{
          alert('초대하고자하는 사용자를 선택하세요.');
        }

      },
    },
    components: {
      userList
    }
  }
</script>
