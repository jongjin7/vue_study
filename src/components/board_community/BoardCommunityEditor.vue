<template>
  <div>
    <h1 class="mb-4">내용 입력하기</h1>
    <form class="">
      <div class="form-group">
        <label for="inp-pop-title">제목</label>
        <input type="text" class="form-control" id="inp-pop-title" autocomplete="email" placeholder="제목을 입력하세요" required>
        <small class="text-muted">
          제목을 입력하세요.
        </small>
      </div>
      <div class="form-group">
        <label>본문내용</label>
        <div id="summernote">Hello Summernote</div>
        <small class="text-muted">
          내용을 입력하세요.
        </small>
      </div>

      <div class="form-group">
        <label>첨부파일</label>
        <div class="custom-file mb-3">
          <input type="file" class="custom-file-input" id="customFile" name="filename">
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
  import $ from "jquery";
  //summer editor
  import "summernote/dist/summernote-bs4.js"
  import "summernote/dist/summernote-bs4.css"
  import "codemirror/lib/codemirror.css";
  //import "codemirror/theme/monokai.css";
  import "codemirror/theme/dracula.css";
  import "codemirror/lib/codemirror.js";
  import "codemirror-formatting/formatting.js";

  export default {
    name:'boardGeneralEditor',
    data(){
      return{
        link:'/community'
      }
    },
    created(){
      $(document).ready(function() {
        $('#summernote').summernote({
          height: 300,                 // set editor height
          minHeight: null,             // set minimum height of editor
          maxHeight: null,             // set maximum height of editor
          focus: true,
          codemirror: { // codemirror options
            theme: 'dracula'
          }
        });
      });
    }
  }
</script>
