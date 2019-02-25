<template>
  <div  class="inbox_chat">
    <div v-for="user in userList" class="chat_list _active_chat">

        <div class="chat_people">
          <a class="" href="#" title="유저 프로파일창 열기" @click.stop.prevent="showModalpopup('유저팝업', 'chatUser'); $EventBus.$emit('showModal');">
            <div class="chat_img">
              <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
            </div>
          </a>
          <a href="#" @click.stop.prevent="openChatRoom">
            <div class="chat_ib">
              <h5>{{ user.userName }}<span class="chat_date">Dec 25</span></h5>
              <p>Test, which is a new approach to have all solutions
                astrology under one roof.</p>
            </div>
          </a>
        </div>
    </div>
  </div>
</template>

<script>
    import {USER_DATA} from "../../../common/Constant";

    export default {
        name: "ChatUserList",
      props:{

      },
      data(){
        return{
          userList:[],
        }
      },
        created(){

          this.getUserData();
        },
        methods:{
          openChatRoom(){
            console.log('채팅 시작!')
          },

          showModalpopup(title, componentName, post){
            window.globalVars.pop_title = title;
            window.globalVars.pop_content = componentName;

            this.$EventBus.$emit('toggleClose');
          },

          getUserData(){
            let vm = this;
            let currentUid ='';
            let userDBRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME +'/'+ USER_DATA.INDEXDB_STORE);
            userDBRef.off();

            userDBRef.orderByChild("userName").once('value').then((dataSnapShot) =>{
              console.log('현재 접속한 유저 uid:', window.globalVars.currentUserUID)
              dataSnapShot.forEach((data) =>{
                if (data.key !== window.globalVars.currentUserUID) {
                  //console.log(data.key, data.val())
                  vm.userList.push(data.val())
                }
              });

            });
          },

          fetchUserList(users){

            // if(data.key !== this.auth.currentUser.uid){
            //   console.log(data.key, val.profileImg, val.userName)
            // }

          }
        }
    }
</script>

<style scoped>

</style>
