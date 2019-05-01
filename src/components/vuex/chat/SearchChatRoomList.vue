<template>
  <div class="headind_srch">
    <div class="recent_heading">
      <h4>최근 대화 목록
        <button class="toggle-room-list">
          <font-awesome-icon icon="chevron-circle-up" />
        </button>
      </h4>
    </div>
    <div class="srch_bar">
      <div class="inner_srch_bar">
        <input type="text" class="search-bar"  placeholder="채팅방 내용 검색어" >
        <span class="input-group-addon">
          <button type="button" v-on:click="thisTest()">
            <font-awesome-icon icon="search" />
          </button>
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

        $(this.$el).find('.toggle-room-list').click(function(){
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
