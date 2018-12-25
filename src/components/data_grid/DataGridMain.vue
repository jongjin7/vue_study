<template>
  <div>
    <h1 class="mb-4">DataTableJs를 이용한 DataGrid</h1>
    <div class="row">
      <div class="col-12 col-md-9">
          믹스인, 렌더함, 플러그인(할까말까)
        필터는 검색폼에 적용 필요(커뮤니티)
      </div>
      <div class="col-12 col-md-3">

      </div>
    </div>

  </div>
</template>

<script>
import datatable from './DataTable.vue';
import 'datatables.net-bs4/js/dataTables.bootstrap4.js'
// import the rest
import 'datatables.net-buttons'
import 'datatables.net-buttons-bs4'
import 'datatables.net-select-bs4'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'
import 'datatables.net-select-bs4/css/select.bootstrap4.min.css'

export default {
  name: "grid",
  data() {
    return {

    }
  },
  created(){

  },
  methods:{

  },
  components: {
    'v-server-table' : datatable
  },

};


</script>
