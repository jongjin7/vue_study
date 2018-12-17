  <template>
    <div class="mb-5">
      <h1 class="mb-4">커뮤니티 게시판</h1>

      <div class="row">
        <CommunityListSearch />

        <div class="col-md-4 mb-3 text-right">
          <div class="form-group">
            <router-link :to="link.editor" class="btn btn-primary btn-block">
              글쓰기
            </router-link>
          </div>
        </div>
      </div>

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
          <!--<tr>
            <td>999</td>
            <td>
              <router-link :to="link.detail" class="community_detail">
                게시판 제목입니다.
              </router-link>
              <span class="badge badge-warning">첨부파일</span>
              <span class="badge badge-dark">4</span>
              <span class="badge badge-primary">New</span>
            </td>
            <td>멍구리</td>
            <td>2018.11.30</td>
            <td>99</td>
          </tr>-->
          </tbody>
        </table>
      </div>


      <CommunityListPaging />

      <div class="row">
        <div class="col text-right">
          <router-link :to="link.editor" class="btn btn-primary btn-block d-md-none">
            글쓰기
          </router-link>
        </div>
      </div>
    </div>
  </template>
  <script>
    import CommunityListSearch from './BoardCommunityListSearch';
    //import CommunityListTable from 'BoardCommunityListTable';
    import CommunityListPaging from './BoardCommunityListPaging';
  export default {
    name: 'CommunityBoard',
    data(){
      return{
        link: {
          editor:'community-write',
          detail:'community-detail',
        },
        posts: [],
        totalListLength:'',

      }
    },

    beforeCreate(){
      console.log('beforeCreate');
    },
    created(){
      console.log('created')
      this.removeServerModifyData();
      this.$EventBus.$on('changeList', (arg) => {
        this.changeListHandler(arg);
        this.totalListLength = this.$store.state.communityTotalList;
      })
    },
    mounted(){
      console.log('mounted')

    },
    computed:{
      hasResult(){
        return this.posts.length > 0;
      },

    },
    methods:{
      removeServerModifyData(){
        //console.log('저장된 임시 CurrentPost값 제거')
        this.$firebaseDB.collection('community').doc('content').update({
          currentPost : null
        });
      },

      changeListHandler(pages){
        //console.log('changeListHandler', pages)
        this.posts = pages;
      },
    },
    components:{
      CommunityListSearch,
      CommunityListPaging,
    }
  }
  </script>

  <style lang="scss" scoped>
    .tbl-wrap{
      width:100%;
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
