<template>
    <div>
      <userList :chatUserList = "getInvitableList"></userList>
    </div>
</template>

<script>
  import userList from './ChatUserList';
  import {mapActions, mapState, mapGetters } from "vuex";

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
      }
    },
    computed:{
      ...mapGetters([
        'getInvitableList'
      ]),

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


      fetchUserList(){
        this.getUserList('invite');
      },
    },
    components: {
      userList
    }
  }
</script>

<style scoped>

</style>
