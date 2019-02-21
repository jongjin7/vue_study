<template>
<div>
  <h1 class="mb-4">vuex를 이용한 todo List</h1>
  <ol>
    <li v-for="todo in todoList" class="my-2">
      <input type="checkbox" v-model="todo.isDone" @change="checkCompleted(todo)">
      <span class="d-inline-block" style="width:140px;">{{ todo.todo }}</span>
      <input type="text" :value="todo.todo">
      <button @click="reverseSingleText(todo)">문자열 뒤집기</button>
      <button @click="deleteTodoItem(todo)">제거</button>
    </li>
  </ol>

  <button @click="filterActiveItems">todo Active</button>
  <button @click="filterDoneItems">todo Completed</button>


  <hr>
  <div class="mb-2 text-center">
    할것등록하기: <input type="text" v-model="newTodo" @keyup.enter="addNewTodo">
    <button @click="addNewTodo">Todo 생성</button>
  </div>

</div>
</template>

<script>
  import Constant from '../../../common/Constant';
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

  export default {
    name: "TodoVuex",
    data(){
      return{
        //todoList: [{name:'김씨'},{name:'양씨'}]  //기본형식
        newTodo:'',
        editedTodo: '',
      }
    },
    mounted() {
      // 마운트된 시점에 데이터를 불러온다(비동기)
      this[Constant.FETCH_DATA]();
    },
    computed:{
      // store 직접 참조
      // todoList(){
      //   return this.$store.state.todos.todoList;  //Vuex라이브러리 Store참조
      // }

      aaa(){
        console.log('aaaa')
      },

      // use mapState helper Method
      ...mapState({
        todoList: state => state.todos.todoList
      }),


      //use mapGetter
      ...mapGetters([
        [Constant.ACTIVE_ITEMS],
        [Constant.DONE_ITEMS],
      ])
    },
    methods:{
      ...mapMutations([
        Constant.REVERSE_TEXT,
        Constant.DONE_TOGGLE,
        Constant.DELETE_TODO,
      ]),

      ...mapActions([
        Constant.FETCH_DATA,
        Constant.ADD_TODO
      ]),

      addNewTodo(){
        this[Constant.ADD_TODO](this.newTodo);
        this.newTodo ='';
      },

      deleteTodoItem(todo){
        this[Constant.DELETE_TODO](todo);
      },


      reverseSingleText(todo){
        this[Constant.REVERSE_TEXT](todo);
      },

      checkCompleted(todo){
        if(!todo.isDone) todo.isDone;
      },

      filterActiveItems(){
        console.log('filterActiveItems')
        //this[Constant.ACTIVE_ITEMS]();
        this.aaa();
      },

      filterDoneItems(){
        console.log('filterDoneItems')
        //this.doneItems();
      }

    }
  }
</script>

<style scoped>

</style>
