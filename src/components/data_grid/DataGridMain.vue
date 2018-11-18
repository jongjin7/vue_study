<template>
  <div>
    <h1 class="mb-4">DataTableJs를 이용한 DataGrid</h1>
    <demo-grid
      :data="gridData"
      :columns="gridColumns">
    </demo-grid>
  </div>
</template>

<script>
import gridDataFrame from "./GridTable.vue";

export default {
  name: "grid",
  data() {
    return {
      gridColumns: ['No.','Name','Email','Subject'],
      gridData: []
    };
  },
  mounted(){
    this.$http.get(`/comments`).then(result => {
      this.gridData = result.data;
      //console.log("result", result, result.data, this.gridData);
    });
  },
  components: {
    "demo-grid": gridDataFrame
  }
};
</script>
