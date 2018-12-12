<template>
  <div class="mb-5">
    <h1 class="mb-4">내용 입력하기</h1>
    <form class="">
      <div class="form-group">
        <label for="inp-pop-title">제목</label>
        <input type="text" class="form-control" id="inp-pop-title"  placeholder="제목을 입력하세요" v-model="newPostItem.title" autofocus autocomplete="off" required>
        <small class="text-muted">
          제목을 입력하세요.
        </small>
      </div>
      <div class="form-group">
        <label>본문내용</label>
        <html-editor height="200" :model.sync="newPostItem.body"></html-editor>
        {{ newPostItem.body }}
      </div>

      <div class="form-group">
        <label>첨부파일</label>
        <div class="custom-file mb-3">
          <input type="file" class="custom-file-input" id="customFile">
          <label class="custom-file-label" for="customFile">Choose file</label>
        </div>
      </div>
      <router-link :to="link" class="btn btn-primary w-100">
        등록 삭제버튼
      </router-link>
    </form>
  </div>
</template>
<script>
  import htmlEditor from "./BoardWebEditor.vue";
  export default {
    name:'boardGeneralWrite',
    data(){
      return{
        link:'/community',
        newPostItem:{
          title:null,
          body:null,
          file:null,
          id:0,
        },
      }
    },
    components: {
      htmlEditor
    },
  }
</script>
