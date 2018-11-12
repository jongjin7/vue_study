<!-- 반복문 -->
<template>
  <div class="list-group">
      <router-link :to="list.link" :key="list.id" v-for="list in linklist" class="list-group-item" :class="list.class">
        <h4 class="list-group-item-heading">{{list.title}}</h4>
        <p class="list-group-item-text">{{list.content}}</p>
      </router-link>
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
          content: "내가 할 일 관리하기, 리스트 생성/삭제",
          link: "/todo",
          class:''
        },
        {
          title: "썸네일 게시판",
          content: "썸네일형 게시판 패키지 (목록,상세,등록 및 수정) - 이미지 등록, 스마트 에디터, 원페이지 구현 가능할지...",
          link: "/photo",
          class:''
        },
        {
          title: "커뮤니티 게시판",
          content: "일반 커뮤니티 게시판 패키지 (목록,상세,등록 및 수정) - 파일첨부, 스마트 에디터 구현, 원페이지 구현 가능할지...",
          link: "/community",
          class:'disabled bg-secondary text-muted'
        },
        {
          title: "데이타 그리드(DataGrid)",
          content: "datatableJs를 이용한 Data Grid 구현, Search, FileDownload, Print",
          link: "/grid",
          class:''
        },
        {
          title: "문의사항 접수",
          content: "앱이 모두 구현되기 전까지 게시판 데이터 연동 테스트 중",
          link: "/contact",
          class:''
        },
        {
          title: "회원가입",
          content: "회원가입 입력폼",
          link: "/signup",
          class:''
        },
        {
          title: "SNS를 이용한 회원가입 및 로그인 구현",
          content: "모달 팝업으로 구현",
          link: "/",
          class:'disabled bg-secondary text-muted'
        }
      ]
    };
  }
};
</script>
