<template>
<div>
  <h1 class="mb-2">Todo List</h1>
  <div class="">
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="card-title mb-2">학습 목표</h2>
        <ol class="col mb-4">
          <li><a href="https://kr.vuejs.org/v2/examples/todomvc.html" target="_blank" title="Vue2.x 예제 TodoApp 보기">Todos App Demo</a>를 바탕으로 데이터 연동형 Todos App 구현</li>
          <li>Todo 항목 생성/수정/삭제, 필터(Todo 완료, 미완료)</li>
          <li>LocalStorage와 FireBaseDB의 데이타 연동(기준 데이터는 서버데이타, 앱은 로컬스토리지 데이타 사용)</li>
        </ol>

        <h3 class="card-title mb-2">기능 정의 <button class="btn btn-sm btn-light">더보기...</button></h3>
        <ol class="col mb-0">
          <li>로컬/서버 데이터 비교 평가(수량), 로컬스토리지 API사용 </li>
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
        <li class="list-group-item  d-flex justify-content-between align-items-center" v-for="todo in filteredTodos"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo == editedTodo }">
          <input :id="'todo-chk-' + todo.id" type="checkbox" v-model="todo.completed" @change="checkCompleted(todo)" class="mr-1">
          <div class="view">
            <label :for="'todo-chk-' + todo.id" @dblclick="editTodo(todo)">{{todo.title}}</label>
          </div>
          <input class="edit w-75" type="text"
                 v-model="todo.title"
                 v-todo-focus="todo == editedTodo"
                 @blur="doneEdit(todo)"
                 @keyup.enter="doneEdit(todo)"
                 @keyup.esc="cancelTodoEdit(todo)">
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

    <button class="btn btn-danger my-1" @click="removeAllTodoCompleted" v-show="todos.length > remaining">
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
    },
    $route: "fetchData"
  },

  created(){
    this.fetchData();
  },

  computed: {
    filteredTodos: function () {
      console.log('computed filterTodo')
      return filters[this.visibility](this.todos);
    },
    remaining: function () {
      console.log('remaining')
      return filters.active(this.todos).length;
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
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
    updateServerLastIndex(){
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
        that.updateServerLastIndex(); //서버에 인덱스 저장
        //로컬스토리지에 저장
        that.todos.push({
          id: that.uid,
          title:value,
          completed: false
        });
        console.log(':: Add Todo to Server... New Todo')
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

    cancelTodoEdit(todo) {
      //console.log('cancelTodoEdit!', this.beforeEditCache)
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    updateTodo(todo,value){
      let that = this;
      let valCompleted = value !== undefined? value : todo.completed;

      console.log('updatedTodo', '::value Completed==>',valCompleted, todo)
      this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').doc('data_'+todo.id).update({
        title: todo.title,
        completed: valCompleted
        //timestamp: that.$firebaseDB.FieldValue.serverTimestamp()
      })
      .then(function() {
        console.log("DB Document successfully updated!");
      });
    },

    checkCompleted(todo){
      console.log('checkCompleted ==> Todo Completed 값을 서버에 업데이트')
      this.updateTodo(todo);
    },

    removeTodo(todo) { //개별 Todo삭제
      console.log('removeTodo', todo.id)
      var that = this;
      this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').doc('data_'+todo.id).delete()
        .then(function() {
          console.log("DB Document successfully Removed!");
          that.todos.splice(that.todos.indexOf(todo), 1);
        }).catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },

    removeAllTodoCompleted() {
      console.log('removeAllTodoCompleted')
      let activeItem = filters.completed(this.todos);
      let that = this;
      activeItem.forEach(function(todo){
        that.removeTodo(todo);
      })
    },

    changeCategory(category){
      this.visibility = category;
    },

    fetchData() {
      let that = this;

      //서버에 저장된 최종 인덱스 값 얻기
      this.$firebaseDB.collection('todo-app').doc('todos').get().then((doc)=>{
        console.log('Last Index to DB', doc.data().lastIndex)
        that.uid = doc.data().lastIndex;
      });

      //데이타 받기
      this.$firebaseDB.collection('todo-app').doc('todos').collection('todo_data').get().then((querySnapshot) => {
        let localData = localStorage.getItem('todos-vuejs-2.0');
        //console.log('querySnapshot', localDataLength, dbDataLength)
        if(localData == null){
          console.log('none LocalData ==> 서버데이터 사용');
          querySnapshot.forEach((doc) =>{
            console.log('loadingServerData ==>', doc.data())
            this.todos.push(doc.data());
          })
        }else{
          console.log('has LocalData ==> 로컬과 서버데이터 갯수 불일치시 무조건 서버데이터 기준, 같으면 로컬데이터 사용');

          let dbDataLength = querySnapshot.docs.length;
          let localDataLength = JSON.parse(localData).length;

          if(dbDataLength != localDataLength){
            let confirmCondition = confirm('서버의 자료와 일치하지 않습니다. 연동하시겠습니까?');
            if(confirmCondition){
              console.log('서버데이터를 사용합니다.')
              querySnapshot.forEach((doc) =>{
                this.todos.push(doc.data());
              })
            }else{
              console.log('로컬데이터를 사용합니다.')
              this.todos = JSON.parse(localData);
            }
          }else{
            this.todos = JSON.parse(localData);
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    },
  },

  directives: {
    'todo-focus': function (el, binding) { //todo내용 업데이트 시 사용하는 폼에 focusin
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
  .view label{margin-bottom: 0;}
  .completed{background: #eaeaea;}
  .completed .view{line-height:1;}
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
