<template>
  <div class="mb-5">
    <div class="text-center py-4">
      <h1>My 챗팅룸</h1>
      <h2 class="h6">Vuex를 이용한 챗팅방입니다.</h2>

      <div class="pt-3 text-center" v-if ="!isUserLogin">
        <button type="button" class="btn btn-primary" @click="$EventBus.$emit('openLoginPopup')">로그인하기</button>
      </div>
      <div v-else>
        <AllUserList />
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapMutations, mapActions } from "vuex";
  import AllUserList from './AllUserList';

  export default{
    name: 'ChatRoomByVuex',
    data(){
      return{
        datas: [],
        isOpenedChatRoom:false,
        //loginedMember : JSON.parse(sessionStorage.getItem(STORAGE_KEY_MEMBER_INFO))
        loginedMember:true,
      }
    },
    computed:{
      ...mapState({
        isUserLogin: ({ socket }) => socket.isUserLogin,
      })
    },
    created(){
      this.$EventBus.$on('currentConnectionStatus', this.currentConnection); //로그인 프로세스쪽에서 호출하는 이벤트
    },
    mounted(){

    },

    methods:{
      currentConnection(){
        console.log('새로 고침시 로그인 상태를 확인받고 메신저 게이트 프로세스 진행')

        if(!this.isUserLogin){
          console.log('vueX Chat gate 로그인이 필요합니다.')
        }else{
          console.log('vueX Chat gate 로그인이 된 상태입니다.')
        }
      },
      fetch(){

      }
    },
    components:{
      AllUserList,
    }
  }
</script>


