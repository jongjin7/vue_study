<template>
    <div>
      <userList :chatUserList = "inviteUserList"></userList>
    </div>
</template>

<script>
  import userList from './ChatUserList';

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
        ]
      }
    },
    components: {
      userList
    }
  }
</script>

<style scoped>

</style>
