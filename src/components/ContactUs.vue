<template>
  <div class="contact">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <h4>DB에 데이터 저장하고 출력하기</h4>
    <form>
      <div class="form-group">
        <label for="exampleFormControlTextarea1">의견사항 등록하기</label>
        <textarea class="form-control" rows="3" v-model="comment"></textarea>
      </div>
      <button type="sumit" class="btn btn-primary" @click="addComment">저장하기</button>
       <button type="button" class="btn btn-primary" @click="updateComment">업데이트</button>
    </form>
    
    <!-- 저장후 출력 -->
    <div class="mt-4" v-if="hasResult">
      <h5>DB에 저장된 내용 출력하기</h5>
      <ol v-if="posts && posts.length">
        <li v-for="post in posts" v-bind:key="post.id">{{ post.body }}</li>
      </ol>
    </div>
    
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ContactUs",
  data() {
    return {
      postTitle: null,
      comment: null,
      loading: false,
      error: null,
      posts: []
    };
  },
  computed: {
    hasResult: function() {
      return this.posts.length > 0;
    }
  },

  created() {
    // 뷰가 생성되고 데이터가 이미 감시 되고 있을 때 데이터를 가져온다.
    this.fetchData();
  },
  watch: {
    // 라우트가 변경되면 메소드를 다시 호출됩니다.
    $route: "fetchData"
  },
  methods: {
    addComment() {
      console.log("aaa", this.comment);
      var idCount = 0;
      this.$http
        .post("/posts/1/comments", {
          title: this.postTitle,
          body: this.comment,
          userId: 1
        })
        .then(response => {
          this.posts.push(response.data);
          console.log("create", this.posts, response.data);
        })
        .catch(e => {
          console.error(e);
        });
    },

    updateComment() {
      this.comment = null;
    },

    fetchData() {
      this.error = null;
      this.loading = true;

      this.$http
        .get("posts/1/comments")
        .then(response => {
          this.loading = false;
          this.posts = response.data;
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
