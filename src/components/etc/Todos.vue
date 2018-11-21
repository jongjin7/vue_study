<template>
<div>
  <h2>Todo List</h2>
  <div class="input-group" style="margin-bottom:10px;">
    <input type="text" class="form-control" placeholder="할일을 입력하세요"
      v-model="name"
      @keyup.enter="createTodo(name)">
    <span class="input-group-append">
      <button type="button" class="btn btn-info" @click="createTodo(name)">추가</button>
    </span>
  </div>
  <ul class="list-group">
    <li class="list-group-item d-inline-flex justify-content-between" v-for="(todo, index) in todos">
      <div  v-show="!state" :class="{'bg-success w-50': state}" >{{todo.name}}</div>
      <input v-show="state" type="text" v-model="edit_data" @keyup.enter="modifyCompleted()">
      <div class="buttons">
        <button type="button" class="btn btn-warning btn-sm"  @click="modifyTodo(index, edit_data)">수정</button>
        <button type="button" class="btn btn-danger btn-sm"  @click="deleteTodo(index)">삭제</button>
      </div>
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
      state:false,
      edit_data:'',

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
      this.todos.splice(i, 1);
    },
    modifyTodo(i,data){
      console.log('수정', this.todos[i], data);
      if(data != null){
        this.state = true;
        //this.todos[i].name = this.edit_data;
      }
    },
    modifyCompleted(){
      this.state = false;
      this.edit_data = '';
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
