<template>
<div>
  <h1 class="mb-4">DataTableJs를 이용한 DataGrid</h1>
  <demo-grid
    :data="gridData"
    :columns="gridColumns"
    :filter-key="searchQuery">
  </demo-grid>
</div>
</template>

<script>
import demo_grid from "./gridTable.vue";

export default {
  name: "grid",
  data() {
    return {
      searchQuery: "",
      gridColumns: ["name", "power"],
      gridData: [
        { name: "Chuck Norris", power: Infinity },
        { name: "Bruce Lee", power: 9000 },
        { name: "Jackie Chan", power: 7000 },
        { name: "Jet Li", power: 8000 }
      ]
    };
  },
  components: {
    "demo-grid": demo_grid
  }
};
</script>
