<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>

      <li v-for="list in linklist">
        <router-link :to="list.link">{{ list.content}}</router-link>
      </li>

    </ul>

    <button class="btn btn-primary" @click="clickBtn">Button</button>
  </div>
</template>

<script>

import $ from "jquery";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      linklist: [
        { content: "서브페이지로 이동하기", link: "/sub" },
        { content: "또다른 페이지", link: "/minor" }
      ]
    };
  },
  methods: {
      clickBtn (event) {
        console.log(event.target);
        $(event.target).text('loading')
        
        setTimeout(function() {
          $(event.target).text('reset')
        }, 1000);
      }
	},
  create:function(){

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
