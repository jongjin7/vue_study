<template>
<div id="todo-container">
    <header>
        <slot name="todo-header" />
    </header>
    <section>
        <slot name="todo-container" />
    </section>
    <section>
        <slot name="todo-filters" />
    </section>
    <footer>
        <slot name="todo-footer" :author='"Jbee"' />
    </footer>
</div>
</template>

<script>
export default {
  //   props: "todoConatiner",
  //   components: {
  //     todoContainer: this.todoContainer
  //   }
};
</script>


<style scoped>
#todo-container {
  margin-top: 60px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
