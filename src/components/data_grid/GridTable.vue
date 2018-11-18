<template>
  <table id="example" class="table table-striped ui celled" style="width:100%">
    <caption class="text-hide">dataGrid Table</caption>
    <thead>
    <tr>
      <th v-for="tableHead in columns">{{ tableHead }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="trData in data">
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
import $ from "jquery";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-bs4/js/dataTables.bootstrap4.js";

export default {
  props: {
    data: Array,
    columns: Array
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  created(){
    $(document).ready(function() {
      setTimeout(function(){
        $('#example').DataTable();
      },700)
    });
  },

  filters: {

  },
  methods: {

  },
  components:{

  }
};
</script>
