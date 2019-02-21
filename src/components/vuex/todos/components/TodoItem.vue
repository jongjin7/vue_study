<template>
  <li
      class="todo-item"
      :class="[ todo.isDone ? 'done' : '' ]">
      <input
        type="checkbox"
        class="todo-checkbox"
        :checked="todo.isDone"
        @click="toCompleteItem($event, todo)"
      />
      <span>{{ todo.content }}</span>
  </li>
</template>

<script>
export default {
  name: "TodoItem",
  props: {
    todo: Object,
    toCompleteItem: Function
  },
  data(){
    return{

    }
  }
};
</script>

<style scoped>
.todo-item {
  list-style: none;
}

.todo-item.done {
  text-decoration: line-through;
  color: grey;
}
</style>
