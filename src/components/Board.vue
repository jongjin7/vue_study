<template>
  <div class="album py-5 bg-light">
    <div class="container">
      <button class="btn btn-lg btn-block btn-outline-primary mb-2" v-on:click="searchTerm">글 불러오기</button>
      
      <div class="row" v-if="hasResult">
        <div class="col-md-4" v-if="post.id <= 100" v-for="post in posts" v-bind:key="post.id">
          <div class="card mb-4 box-shadow">
            <img class="card-img-top" :src= "post.thumbnailUrl" data-holder-rendered="true">
            <div class="card-body">
              <p class="card-text">{{ post.title }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">상세보기</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">수정하기</button>
                </div>
                <small class="text-muted">포스트 ID: {{ post.id }}</small>
                <!-- <small class="text-muted">{{ post.id }} mins</small>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>  
</template>

<script>
import axios from "axios";
export default {
  name: "Board",
  data() {
    return {
      msg: "Album Component",
      posts: []
    };
  },

  computed: {
    hasResult: function() {
      console.log("posts", this.posts.length);
      return this.posts.length > 0;
    }
  },

  methods: {
    searchTerm: function() {
      this.$http.get(`/photos`).then(result => {
        console.log("result", result, result.data);
        this.posts = result.data;
      });
    }
  }
};
</script>
