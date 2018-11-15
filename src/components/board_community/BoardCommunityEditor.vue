<template>
  <form class="">
    <div class="form-group">
      <label for="inp-pop-title">제목</label>
      <input type="text" class="form-control" id="inp-pop-title" autocomplete="email" placeholder="제목을 입력하세요" required>
    </div>
    <div class="form-group">
      <label for="inp-pop-cont">본문내용</label>
      <textarea class="form-control" id="inp-pop-cont"  rows="3"></textarea>
    </div>

    <div class="form-group">
      <div v-if="!image">
        <input type="file" @change="onFileChange" id="img-input">
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
