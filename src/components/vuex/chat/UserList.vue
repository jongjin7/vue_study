<template>
    <div>
      <h5>채팅 유저 리스트</h5>
      <ul>
        <li v-for="user in userList" class="collection-item avatar list">
          <!--<img :src="user.profileImg" alt="" class="circle">-->
          <span class="title">{{ user.userName }}</span>
          <!--<span class="small material-icons right hiddendiv done">{{ user.isDone }}</span>-->
          <!--<span class="small material-icons right hiddendiv mood yellow-text">mood</span>-->
        </li>
      </ul>
    </div>
</template>

<script>
    import {USER_DATA} from "../../../common/Constant";

    export default {
        name: "UserList",
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
