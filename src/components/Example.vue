<template>
  <div class="ajax">
      <div v-if="hasResult">
        <div v-for="post in posts" v-bind:key="post.id">
          <h1>{{ post.title }}</h1>
          <p>{{ post.body }}</p>
        </div>
      </div>
      <button lass="btn btn-primary" v-else v-on:click="searchTerm">글 불러오기</button>
  </div>
</template>

<script>
export default {
  name: "Example",
  data() {
    return {
      msg: "Basic panel example",
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
      // using JSONPlaceholder
      const baseURI = "https://jsonplaceholder.typicode.com";
      this.$http.get(`${baseURI}/posts`).then(result => {
        console.log("result", result, result.data);
        this.posts = result.data;
      });
    }
  }
};
</script>
