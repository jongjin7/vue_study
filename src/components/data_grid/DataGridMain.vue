<template>
  <div>
    <h1 class="mb-4">DataTableJs를 이용한 DataGrid</h1>
    <datatable :columns="gridColumns" />

  </div>
</template>

<script>
import datatable from './DataTable.vue';


export default {
  name: "grid",
  data() {
    return {
      gridColumns: ['No.','Name','Email','Subject'],
      gridData: ''
    };
  },
  created(){
    console.log('parent created')
  },

  mounted(){
    console.log('parent mounted')
  },
  components: {
    datatable
  }
  ,
  methods:{

  }
};
</script>
