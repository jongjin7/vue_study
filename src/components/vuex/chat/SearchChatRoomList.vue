<template>
  <div class="headind_srch">
    <div class="recent_heading">
      <h4>최근 대화 목록 <span><i class="fas fa-toggle-on"></i><i class="fas fa-toggle-off"></i></span></h4>
    </div>
    <div class="srch_bar">
      <div class="stylish-input-group">
        <input type="text" class="search-bar"  placeholder="검색" >
        <span class="input-group-addon">
          <button type="button" v-on:click="thisTest()"> <i class="fa fa-search" aria-hidden="true"></i></button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "SearchChatRoomList",
      mounted(){
        let vm = this;

        $(this.$el).find('.recent_heading').click(function(){
          $(this).parents('.messaging').toggleClass('closed');
        })
      },
      methods:{
        thisTest(){
          console.log(11111)
          this.$emit('test');
        }
      }
    }
</script>

<style scoped>

</style>
