<template>
  <form class="">
    <div class="form-group">
      <label for="inp-pop-title">타이틀</label>
      <input type="text" class="form-control" id="inp-pop-title" autocomplete="email" placeholder="제목을 입력하세요" required>
    </div>
    <div class="form-group">
      <label for="inp-pop-cont">본문내용</label>
      <textarea class="form-control" id="inp-pop-cont"  rows="3" v-model="pop_content"></textarea>
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
    <button type="submit" class="btn btn-primary w-100">등록하기</button>
  </form>
</template>
<script>
  export default {
    name:'boardPhotoEditor',
    data(){
      return{
        pop_content:''
      }
    }
  }
</script>
