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
        <label for="inp-pop-cont">본문내용</label>
        <textarea class="form-control" id="inp-pop-cont"  rows="3"></textarea>
        <small class="text-muted">
          내용을 입력하세요.
        </small>
      </div>

      <div class="form-group">
        <label>첨부파일</label>
        <div v-if="!image">
          <div class="custom-file mb-3">
            <input type="file" class="custom-file-input" id="customFile" name="filename" @change="onFileChange">
            <label class="custom-file-label" for="customFile">Choose file</label>
          </div>
        </div>

        <div v-else>
          <img :src="image" width="300" />
          <button @click="removeImage">Remove image</button>
        </div>
      </div>
      <router-link :to="link" class="btn btn-primary w-100">
        등록 삭제버튼
      </router-link>
    </form>
  </div>
</template>
<script>
  export default {
    name:'boardGeneralEditor',
    data(){
      return{
        link:'/community'
      }
    }
  }
</script>
