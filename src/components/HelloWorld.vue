<template>
  <div class="hello">

    <div class="jumbotron">
      <h1>{{ msg }}</h1>
      <p>
      This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
      <p>
      <a class="btn btn-primary btn-lg" href="#" role="button" @click="clickBtn">Learn more</a></p>
    </div>

    <h2 class="title">Essential Links</h2>
      <div class="list-group">
        <router-link :to="list.link" :key="list.id" v-for="list in linklist" class="list-group-item -active">
          <h4 class="list-group-item-heading">{{list.title}}</h4>
          <p class="list-group-item-text">{{list.content}}</p>
        </router-link>
      </div>
  </div>
 
</template>

<script>
//import $ from "jquery";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      linklist: [
        { title:'서브페이지', content: "서브페이지로 이동하기", link: "/sub" },
        { title:'todo App', content: "Todo App Sample", link: "/todo" },
        { title:'dataStore', content: "DataStore Sample", link: "/datastore" },
        { title:'grid', content: "Grid Table", link: "/grid" }
      ]
    };
  },
  methods: {
    clickBtn(event) {
      console.log(event.target);
      $(event.target).text("loading");

      setTimeout(function() {
        $(event.target).text("reset");
      }, 1000);
    }
  },
  create: function() {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul,ol, dl, li{
  margin:0; padding:0;
}
li{
  list-style: none;
}
a {
  color: #42b983;
}
</style>
