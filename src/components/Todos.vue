<template>
<div class="container">
  <h2>Todo List</h2>
  <div class="input-group" style="margin-bottom:10px;">
    <input type="text" class="form-control" placeholder="할일을 입력하세요"
      v-model="name"
      @keyup.enter="createTodo(name)"
    >
    <span class="input-group-append">
      <button type="button" class="btn btn-info" @click="createTodo(name)">추가</button>
    </span>
  </div>
  <ul class="list-group">
    <li class="list-group-item d-inline-flex justify-content-between" v-for="(todo, index) in todos">
    {{todo.name}}
      <button 
        type="button" 
        class="btn btn-danger btn-sm"  @click="deleteTodo(index)">삭제</button>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: "TodoPage",
  data() {
    return {
      name: null,

      todos: [
        {
          name: "청소"
        },
        {
          name: "블로그 쓰기"
        },
        {
          name: "밥먹기"
        },
        {
          name: "안녕"
        }
      ]
    };
  },
  methods: {
    deleteTodo(i) {
      console.log(i)
      this.todos.splice(0, 1);
    },
    createTodo(name) {
      if (name != null) {
        this.todos.push({ name: name });
        this.name = null;
      }
    }
  }
};
</script>
