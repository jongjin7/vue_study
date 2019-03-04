<template>
  <div class="mb-5">
    <div class="text-center py-4">
      <h1>My 챗팅룸</h1>
      <h2 class="h6">Vuex를 이용한 챗팅방입니다.</h2>

      <div class="pt-3 text-center" v-if ="!isLogined">
        <button type="button" class="btn btn-primary" @click="$EventBus.$emit('loginPop')">로그인하기</button>
      </div>
      <div v-else>
        <SiteMemberList  />
      </div>
    </div>
  </div>
</template>
<script>
  const STORAGE_KEY_MEMBER_INFO = 'memberInfo';

  import SiteMemberList from './SiteMemberList';


  export default{
    name: 'ChatRoomByVuex',
    data(){
      return{
        datas: [],
        isLogined:false,
        isOpenedChatRoom:false,
        loginedMember : JSON.parse(sessionStorage.getItem(STORAGE_KEY_MEMBER_INFO))
      }
    },
    created(){
      const vm = this;
      if(this.loginedMember){ //로그인시
        //채팅방이 개설 되지 않았다면 개설, 대화자도 없는데 어떻게 대화하지...참여형 대화방...
        // 채팅방 리스트 용도
        //사용자가 참여한 대화 문서를 선택하여 읽어오기 ==> 선택한 리스트 채팅룸에 내용 출력
        //채팅에서 요일 블록을 기준으로 그룹핑하여 출력...


        //프로필은 회원 가입시 저장
        //채팅룸명은 방 개설자 닉네임으로 정의

        //let userData = window.globalVars.loginedUser;
        console.log(this.loginedMember.name)
        this.isLogined = true;

        //this.fetchData();

        //socket I/O trigger
        // this.$socket.on('chat', (data) => {
        //   this.pushMsgData(data);
        //   vm.datas.push(data);
        // });

      }else{
        alert('로그인이 필요합니다.')
      }

      this.$EventBus.$on('openChatRoom', () =>{


      })
    },

    methods:{

    },
    components:{
      SiteMemberList,
    }
  }
</script>


