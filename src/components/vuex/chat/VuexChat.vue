<template>
  <div class="mb-5">
    <div class="text-center py-4">
      <h1>웹 메신저</h1>
      <p><a href="https://vuex.vuejs.org/kr/" target="_blank">Vuex</a>와 <a href="https://firebase.google.com/docs/database/?authuser=1" target="_blank">RealDatabase</a>를 이용하여 메신저를 구현하였습니다.</p>

      <div class="pt-3 text-center" v-if ="!isUserLogin">
        <div class="card mb-4">
          <div class="card-body text-left">
            <h3 class="h5 mb-2">학습 목표</h3>
            <ol class="col mb-4">
              <li>웹 메신저 개발을 통해서 중앙 집중식 상태 관리에 대한 이해 및 Vue의 상태관리 라이브러리인 Vuex에 대해 학습을 하고자 한다.</li>
              <li>메신저 기능 구현에 필요한 백엔드 서비스(데이터베이스, 스토리지, 유저 상태 관리, 푸시 기능(Service Worker))는 Firebase의 라이브러리를 이용하여 개발하도록 한다.</li>
            </ol>

            <h3 class="h5 mb-2">기능 구현 단계 및 참고 사항</h3>
            <ol class="col mb-0">
              <li><a href="https://cionman.tistory.com/51" target="_blank">Firebase Web 채팅앱 만들기</a> 블로그를 참고하여 VueJS 버전의 웹 메신저 개발</li>
              <li>Firebase의 RealtimeDataBase API를 라이브 메시지 관리 및 반응형 구현</li>
              <li>저장소는 Firebae Storage API를 이용한 첨부파일 관리 및 Download URL생성</li>
              <li>자동 링크 생성</li>
            </ol>
          </div>
        </div>
        <button type="button" class="btn btn-primary" @click="$EventBus.$emit('openLoginPopup')">로그인하기</button>
      </div>
      <div v-else>
        <AllUserList />
      </div>
    </div>
  </div>
</template>
<script>
  import { USER_DATA, CHAT_ROOM } from '@/common/Constant';
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

    destroyed(){
      if(!/\/chat\//gi.test(location.hash)){
        sessionStorage.removeItem(CHAT_ROOM.STORAGE_KEY_CHAT_USER_LIST);
        sessionStorage.removeItem(CHAT_ROOM.STORAGE_KEY_CHAT_ROOM_LIST);
      }

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


