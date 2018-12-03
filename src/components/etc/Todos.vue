<template>
<div>
  <h1 class="mb-2">Todo List</h1>
  <div class="mb-4">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">학습 목표</h4>
        <ol class="col mb-0">
          <li><a href="https://kr.vuejs.org/v2/examples/todomvc.html" target="_blank" title="demo보기">Todo App Demo</a>를 바탕으로 커스텀화된 App 구현</li>
          <li>Todo 항목 생성/수정/삭제, 필터(Todo 완료, 미완료)</li>
          <li>LocalStorage와 FireBaseDB간의 데이터 연동</li>
        </ol>
      </div>
    </div>
  </div>

  <div class="input-group input-group-lg mb-2">
    <div class="input-group-prepend">
        <span class="input-group-text">
          <input id="chk-todo-all" type="checkbox" v-model="allDone">
        </span>
    </div>
    <input type="text" class="form-control" placeholder="할일을 입력하세요"
           v-model="newTodo" autofocus autocomplete="off"
           @keyup.enter="addTodo">
      <span class="input-group-append">
        <button type="button" class="btn btn-info" @click="addTodo">추가</button>
      </span>
  </div>

  <div class="scrolling-wrap">
    <div class="inner-wrap">
      <ul class="list-group todo-list" v-show="todos.length" v-cloak>
        <li class="list-group-item  d-flex justify-content-between" v-for="todo in filteredTodos"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo == editedTodo }">
          <div class="view">
            <input :id="todo.id" type="checkbox" v-model="todo.completed">
            <label :for="todo.id" @dblclick="editTodo(todo)">{{todo.title}}</label>
          </div>
          <input class="edit" type="text"
                 v-model="todo.title"
                 v-todo-focus="todo == editedTodo"
                 @blur="doneEdit(todo)"
                 @keyup.enter="doneEdit(todo)"
                 @keyup.esc="cancelEdit(todo)">
          <div class="buttons ml-auto">
            <button type="button" class="btn btn-warning btn-sm"  @click="editTodo(todo)">수정</button>
            <button type="button" class="btn btn-danger btn-sm btn-del"  @click="removeTodo(todo)">삭제</button>
          </div>
        </li>
      </ul>
    </div>
  </div>


  <div class="d-md-flex justify-content-between py-2">
    <div class="todo-count my-1">
      <strong>{{ remaining }}</strong> {{ remaining | pluralize }} 남음
    </div>

    <div class="btn-group category my-1">
      <button class="btn btn-secondary" @click="changeCategory('all')" :class="{ selected: visibility == 'all' }">All</button>
      <button class="btn btn-secondary" @click="changeCategory('active')" :class="{ selected: visibility == 'active' }">Active</button>
      <button class="btn btn-secondary" @click="changeCategory('completed')" :class="{ selected: visibility == 'completed' }">Completed</button>
    </div>

    <button class="btn btn-danger my-1" @click="removeCompleted" v-show="todos.length > remaining">
      완료된 항목 삭제
    </button>
  </div>

</div>
</template>

<script>
const STORAGE_KEY = 'todos-vuejs-2.0';

// visibility filters
const filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    console.log('filter completed')
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}


export default {
  name: "TodoPage",
  data() {
    return {
      todos: [],
      newTodo: '',
      editedTodo: null,
      visibility: 'all',
      uid : '',
      timestamp:'',
    };
  },
  watch:{
    todos: {
      handler: function (todos) {
        this.saveToLocalStorage(todos)
      },
      deep: true
    }
  },
  created(){
    this.fetchData();
  },
  computed: {
    filteredTodos: function () {
      console.log('computed filterTodo')
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      console.log('remaining', this.todos)
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        console.log('allDone get!!')
        return this.remaining === 0
      },
      set: function (value) {
        console.log('allDone set')
        let that = this;
        this.todos.forEach(function (todo) {
          that.updateTodo(todo, value);
          todo.completed = value;
        })
      }
    }
  },
  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },
  methods: {
    updateTotalIndex(){
      var that = this;
      this.$firebaseDB.collection('todo-app').doc('todos').update({
        lastIndex: that.uid
      });
    },

    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }

      var that = this;
      this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').doc('data_'+(++that.uid)).set({
        id: that.uid,
        title:value,
        completed: false
      }).then(function(){
        that.updateTotalIndex(); //서버에 인덱스 저장
        //로컬스토리지에 저장
        that.todos.push({
          id: that.uid,
          title:value,
          completed: false
        });


        console.log(':: Register New Todo')
      })

      this.newTodo = ''
    },

    editTodo(todo){
      console.log('editTodo',todo)
      this.beforeEditCache = todo.title;

      console.log('editTodo', this.editedTodo)
      this.editedTodo = todo;
    },
    doneEdit: function (todo) {
      console.log('doneEdit', todo)
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim();
      this.updateTodo(todo); //서버에 업데이트 ==> title이 수정안되었으면 호출안되게...

      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    saveToLocalStorage(todos){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    },

    removeTodo(todo) {
      console.log('removeTodo', todo.id)

      var that = this;
      this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').doc('data_'+todo.id).delete().then(function() {
        that.todos.splice(that.todos.indexOf(todo), 1);

      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
    },

    cancelEdit(todo) {
      //console.log('cancelEdit!', this.beforeEditCache)
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    updateTodo(todo,value){
      let that = this;
      let valCompleted = value!== undefined? value : todo.completed;

      console.log('updatedTodo', valCompleted)
      this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').doc('data_'+todo.id).update({
        title: todo.title,
        completed: valCompleted
        //timestamp: that.$firebaseDB.FieldValue.serverTimestamp()
      })
      .then(function() {
        console.log("Document successfully updated!");
      });
    },

    removeCompleted() {
      this.todos = filters.active(this.todos)
    },

    changeCategory(category){
      this.visibility = category;
    },

    fetchData() {
      let that = this;
      let localData = localStorage.getItem('todos-vuejs-2.0');

      //서버에 저장된 최종 인덱스 값 얻기
      this.$firebaseDB.collection('todo-app').doc('todos').get().then((doc)=>{
        console.log('Last Index to DB', doc.data().lastIndex)
        that.uid = doc.data().lastIndex;
      });


      if(localData == null){
        console.log('none LocalData')
        this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) =>{
            console.log('loadingServerData ==>', doc.data())
            this.todos.push(doc.data());
          })
        })
      }else{
        console.log('has LocalData ==>', localData);
        this.todos = JSON.parse(localData);
      }
    },
  },

  directives: {
    'todo-focus': function (el, binding) {
      //console.log('todo-focus', el, binding)
      if (binding.value) {
        el.focus()
      }
    }
  }
};
</script>
<style scoped>
  .scrolling-wrap{
    background: #f0f0f0;
    padding:4px;
  }
  .scrolling-wrap .inner-wrap{
    max-height: 400px; overflow-y: auto;
  }
  .completed{background: #eaeaea;}
  .completed .view label{color:#666;}
  .view + input{display:none; position: absolute; left:20px; }
  .editing .view {display:none;}
  .editing .view + input{display:block;}
  .buttons{opacity:0.1}
  .todo-list li:hover .buttons{opacity:1;}
  .category button{
    background-color: #8594a0;
    border-color: #8594a0;
    color:#adb7bf;
  }
  .category .selected{
    background-color:#6d7b86;
    border-color: #6d7b86;
    color:#fff;
  }
</style>
