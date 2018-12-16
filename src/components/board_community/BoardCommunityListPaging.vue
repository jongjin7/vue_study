<template>
  <ul class="pagination justify-content-end" >
    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
    <li class="page-item" v-for="page in pages"><a href="#" class="page-link" @click.stop.prevent="changePage(page)">{{ page }}</a></li>
    <!--<li class="page-item  active"><a class="page-link" href="#">{{ changePaging.endPage }}</a></li>-->
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>
</template>

<script>
    export default {
      name: "BoardCommunityListPaging",
      props:{
        listPagination: Number
      },
      data(){
        return {
          totalpage : this.listPagination,
          pages: []
        }
      },
      created(){
        console.log('paginate created')
        this.createPageItems();
      },
      mounted(){
        console.log('paginate mounted')

      },
      methods:{
        createPageItems(){
          console.log('createPaginate total', this.totalpage);
          let totalLength = this.$store.state.communityTotalList;
          let showingList = 3;
          let pgCount = Math.round(15/3);
          console.log('pgCount',totalLength, showingList)
          for(let i=1; i<= pgCount; i++){
            this.pages.push(i);
          }

          console.log('pg1', this.pages)
        },
        changePage(pageIndex){
          console.log('changepage')
          this.$EventBus.$emit('changeList', pageIndex);
        }
      }
    }
</script>

<style scoped>

</style>
