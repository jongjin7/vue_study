<template>
  <div class="tbl-wrap">
    <table class="table table-striped">
      <thead>
      <tr>
        <th>No.</th>
        <th>제목</th>
        <th>등록자</th>
        <th>등록일</th>
        <th>조회수</th>
      </tr>
      </thead>
      <tbody v-if="hasResult">
      <tr v-for="post in posts">
        <td>{{ post.listCount }}</td>
        <td>
          <router-link :to="{ name: 'BoardCommunityDetail', params: { userId: post.id }}">{{ post.title }}</router-link>
          <span class="badge badge-warning" v-if="post.fileName !== null">첨부파일</span>
          <span class="badge badge-dark" v-if="post.commentCount > 1">{{ post.commentCount }}</span>
          <span class="badge badge-primary" v-if="post.latest">New</span>
        </td>
        <td>{{ post.author }}</td>
        <td>{{ post.newTimeStamp }}</td>
        <td>{{ post.hit }}</td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td colspan="5" class="text-center" v-if="callbackMessage !== null">
          <div>콜백 메시지 출력~</div>
        </td>
        <td colspan="5" class="text-center"v-else>
          <div>로딩중입니다...</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    export default {
        name: "BoardCommunityListTable",
      data(){
          return{
            posts: [],
            totalListLength:'',
            callbackMessage:null
          }
      },
      created(){
        this.$EventBus.$on('changeList', (arg) => {
          this.changeListHandler(arg);
          this.totalListLength = this.$store.state.communityTotalList;
        })
      },
      computed:{
        hasResult(){
          return this.posts.length > 0;
        },

      },
      methods:{
        changeListHandler(pages){
          //console.log('changeListHandler', pages)
          this.posts = pages;
        },
      }
    }
</script>

<style lang="scss" scoped>
  .tbl-wrap{
    width:100%;
    margin-bottom: 1rem;
    .table{
      margin-bottom: 0;
    }
    thead {
      th {
        &:nth-child(1) {
          width: 8%;
          padding-right: 2%;
          text-align: right;
        }
        &:nth-child(2) {
          width: 53%;
          text-align: center;
        }
        &:nth-child(3) {
          width: 15%;
          text-align: center;
        }
        &:nth-child(4) {
          width: 14%;
          text-align: center;
        }
        &:nth-child(5) {
          width: 10%;
          text-align: center;
        }
      }
    }

    tbody{
      td{

        &:nth-child(1){
          padding-right: 2%;
          text-align: right;
        }
        &:nth-child(2){
          word-break: break-all;
        }

        &:nth-child(3){
          text-align: center;
        }
        &:nth-child(4){
          text-align: center;
        }
        &:nth-child(5){
          text-align: center;
        }
      }

      .badge{
        vertical-align: middle;
      }
    }

    @media (max-width:1024px){
      thead {
        th {
          &:nth-child(1) {
            width: 8%;
          }
          &:nth-child(2){
            width:43%;
          }
          &:nth-child(3) {
            width: 15%;
          }
          &:nth-child(4) {
            width: 18%;
          }
          &:nth-child(5) {
            width: 16%;
          }
        }
      }
    }
    @media (max-width:480px){
      overflow-x:scroll;
      table{
        width:160%;
      }
    }
  }
</style>
