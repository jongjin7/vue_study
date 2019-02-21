<template>
  <div>
    <todo-input
      :addItem="addItem"
    />
    <ul class="todo-list">
      <todo-item
        v-for="(todo, index) in todos" :key="index"
        :todo='todo'
        :toCompleteItem='toCompleteItem'
      />
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "@/store/modules/todos";
import * as actions from "@/store/modules/todos/types";
import * as getters from "@/store/modules/todos/getters";
import TodoItem from "./TodoItem.vue";
import TodoInput from "./TodoInput.vue";
import { filterType } from "@/common/Constant";

export default {
  data(){
    return {

    }
  },
  mounted(){

  },
  components: {
    TodoInput,
    TodoItem
  },
  computed: {
    ...mapState({
      currentFilter: ({ views }) => views.currentFilter,
      allItems: ({ items }) => items
    }),
    ...mapGetters({
      doneItems: getters.DONE_ITEMS,
      activeItems: getters.ACTIVE_ITEMS
    }),
    // ...mapGetters([...todosMappedGetters]),
    // ...mapGetters(["doneItems", "activeItems"]),
    // ...mapGetters({
    //   doneItems: "doneItems",
    //   activeItems: "activeItems"
    // }),
    // currentFilter() {
    //   return this.$store.state.todos.views.currentFilter;
    //   return this.$store.state["todos/views/currentFilter"]; (x)
    // },
    // allItems() {
    //   return this.$store.state.todos.items;
    // },
    // doneItems() {
    //   return this.$store.getters["todos/doneItems"];
    //   // return this.$store.getters.todos.doneItems; (x)
    // },
    // activeItems() {
    //   return this.$store.getters["todos/activeItems"];
    // },
    todos() {
      if (this.currentFilter === filterType.ALL) {
        return this.allItems;
      }
      if (this.currentFilter === filterType.DONE) {
        return this.doneItems;
        // return this[getters.DONE_ITEMS];
      }
      if (this.currentFilter === filterType.ACTIVE) {
        return this.activeItems;
        // return this[getters.ACTIVE_ITEMS];
      }
    }
  },

  methods: {
    ...mapActions([actions.ADD_ITEM, actions.TO_DONE]),
    // ...mapActions({
    //   addItem: actions.ADD_ITEM,
    //   toDone: actions.TO_DONE
    // }),

    toCompleteItem(event, todo) {
      this.TO_DONE(todo);
    },

    addItem(event) {
      if (event.target.value.trim() === "") {
        event.target.value = "";
        return;
      }
      const newItem = {
        content: event.target.value,
        isDone: false
      };
      //==>this.addItem({ newItem });
      //this[actions.ADD_ITEM]({ newItem });

      // dispatch 이용
      // this.$store.dispatch("todos/addItem", {
      //   newItem: {
      //     content: event.target.value,
      //     isDone: false
      //   }
      // });

      // 네임스페이스 모듈에서 전역 액션 등록하여 사용시
      this.$store.dispatch("localSomeAction");

      // 네임스페이스 모듈 내부에서 전역 자산 접근
      this.$store.dispatch("demo/hasNamespaceModuleDepth1/someAction",{gap:22222});

      event.target.value = "";
    }
  }
};
</script>

<style scoped>
.todo-list {
  margin-top: 20px;
  padding-left: 0px;
}
</style>
