<!-- 반복문 -->
<template>
  <div class="list-group">
      <router-link :to="list.link" :key="list.id" v-for="list in linklist" class="list-group-item -active">
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
          title: "게시판 로직",
          content: "게시판 리스트,상세,등록 및 수정",
          link: "/board"
        },
        { title: "todo App", content: "Todo App Sample", link: "/todo" },
        { title: "글남기기", content: "contact us", link: "/contact" },
        { title: "테이블", content: "datatableJs를 이용한 Grid 출력", link: "/grid" },
        { title: "회원가입", content: "회원가입 입력폼", link: "/signup" }
      ]
    };
  }
};
</script>
