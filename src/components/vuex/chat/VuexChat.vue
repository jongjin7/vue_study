<template>
  <div class="mb-5">
    <div class="text-center py-4">
      <h1>My 챗팅룸</h1>
      <h2 class="h6">Vuex를 이용한 챗팅방입니다.</h2>

      <div class="pt-3 text-center" v-if ="!isUserLogin">
        <button type="button" class="btn btn-primary" @click="$EventBus.$emit('openLoginPopup')">로그인하기</button>
      </div>
      <div v-else>
        <!--<SiteMemberList  />-->
      </div>
    </div>
  </div>
</template>
<script>
  const STORAGE_KEY_MEMBER_INFO = 'memberInfo';

  import { mapState, mapMutations, mapActions } from "vuex";
  import SiteMemberList from './SiteMemberList';

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
      this.$EventBus.$on('currentConnectionStatus', this.currentConnection);
      const vm = this;
      console.log('vuexChat created')
      if(this.loginedMember){ //로그인시

        //채팅방이 개설 되지 않았다면 개설, 대화자도 없는데 어떻게 대화하지...참여형 대화방...
        // 채팅방 리스트 용도
        //사용자가 참여한 대화 문서를 선택하여 읽어오기 ==> 선택한 리스트 채팅룸에 내용 출력
        //채팅에서 요일 블록을 기준으로 그룹핑하여 출력...


        //프로필은 회원 가입시 저장
        //채팅룸명은 방 개설자 닉네임으로 정의

        //let userData = window.globalVars.loginedUser;

        //this.fetchData();

        //socket I/O trigger
        // this.$socket.on('chat', (data) => {
        //   this.pushMsgData(data);
        //   vm.datas.push(data);
        // });

      }else{

      }

      this.$EventBus.$on('openChatRoom', () =>{


      })
    },
    mounted(){

      console.log('vuexChat mounted')


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
      SiteMemberList,
    }
  }
</script>


