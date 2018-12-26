<template>
  <table id="example" class="table table-striped ui celled" style="width:100%">
    <caption class="text-hide">dataGrid Table</caption>
    <thead>
    <tr>
      <th v-for="tableHead in columns">{{ tableHead }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="trData in thisData">
      <td>{{ trData.id }}</td>
      <td>{{ trData.name }}</td>
      <td>{{ trData.email }}</td>
      <td>{{ trData.body }}</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th v-for="tableHead in columns">{{ tableHead }}</th>
    </tr>
    </tfoot>
  </table>
</template>

<script>
  import "datatables.net-bs4/css/dataTables.bootstrap4.css";
  import "datatables.net-bs4/js/dataTables.bootstrap4.js";

  // import the rest
  import 'datatables.net-buttons'
  import 'datatables.net-buttons-bs4'
  import 'datatables.net-select-bs4'
  import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'
  import 'datatables.net-select-bs4/css/select.bootstrap4.min.css'

  export default {
    props: {
      columns: Array
    },
    data() {
      return {
        thisData : '',
      };
    },
    watch:{

    },
    created(){
      console.log('child created')
      this.startDataTable();
    },
    mounted() {
      console.log('child mounted')
    },

    methods: {
      startDataTable(){
        const vm = this;
        console.log('dataTable start!!!')
        this.$http.get(`/comments`).then(result => {
          console.log("result", result, result.data);
          let thisData = vm.thisData = result.data;
          return thisData;

        }).then((thisData)=>{
          if(thisData){
            console.log('thisData callback')

            $('#example').DataTable({
              dom: 'Bfrtip',
              buttons: [
                'copy', 'excel', 'pdf'
              ],
              //"scrollY":        "200px",
              //"scrollCollapse": true,
              //"paging":         false

            });
          }
        });

      }
    },
    components:{

    }
  };
</script>
