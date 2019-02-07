<!-- 반복문 -->
<template>
  <div class="list-group">
      <router-link :to="list.link" :key="list.id" v-if="index < linklist.length-1" v-for="(list, index) in linklist" class="list-group-item" :class="list.class">
        <h4 class="list-group-item-heading">{{list.title}}</h4>
        <p class="list-group-item-text">{{list.content}}</p>
      </router-link>
      <a href="#" class="list-group-item" @click.stop.prevent="$EventBus.$emit('loginPop')" v-else>
        <h4 class="list-group-item-heading">{{list.title}}</h4>
        <p class="list-group-item-text">{{list.content}}</p>
      </a>
    </div>
</template>
<script>
export default {
  name: "appAllLinks",
  data() {
    return {
      linklist: [
        {
          title: "todo 심플앱",
          content: "내가 할 일 관리하기, 리스트 생성/삭제/서버와 로컬스토리지에 저장",
          link: "/todo",
          class:''
        },
        {
          title: "갤러리 게시판",
          content: "썸네일형 게시판 패키지 (내용,이미지 등록)",
          link: "/photo",
          class:''
        },
        {
          title: "커뮤니티 게시판",
          content: "일반 커뮤니티 게시판 패키지 (목록,상세,등록 및 수정 컴포넌트로 구분) - 파일첨부, 스마트 에디터 구현, SNS공유(카카오링크공유)",
          link: "/community",
          class:''
        },
        {
          title: "데이타 그리드(DataGrid)",
          content: "datatableJs를 이용한 Data Grid 구현, Search, FileDownload, Print",
          link: "/grid",
          class:''
        },
        {
          title: "문의사항 접수",
          content: "문의사항 접수 페이지",
          link: "/contact",
          class:''
        },
        {
          title: "Vuex 상태 관리 라이브러리를 이용한 채팅방 구현",
          content: "Vuex, Socket.io, 로그인 기반 채팅방",
          link: "/chat",
          class:''
        },
        {
          title: "구글 Firebase Auth API를 이용한 회원가입 및 로그인 구현",
          content: "모달 팝업으로 구현",
          link: "/",
          class:''
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
  .list-group-item{
    p {
      margin-bottom:0;
    }
  }
</style>

