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
          <tr v-for="(post, index) in posts">
            <td>{{ totalListLength - index }}</td>
            <td>
              <router-link :to="{ name: 'BoardCommunityDetail', params: { userId: post.id }}">{{ post.title }}</router-link>
              <span class="badge badge-warning" v-if="post.fileName !== null">첨부파일</span>
              <span class="badge badge-dark" v-if="post.commentCount > 1">{{ post.commentCount }}</span>
              <span class="badge badge-primary">New</span>
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


      <CommunityListPaging :listPagination="totalListLength"/>

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
        getData:[],
        showingListLength:3,
        totalListLength:0,
        pagingData:{
          tatalItemLength:'',
          showingList: 3,
          currentPage:0,
        },
      }
    },

    created(){
      console.log('list created')
      this.getServerData();
      this.$EventBus.$on('changeList', (arg) => {
        this.changeListHandler(arg);
        console.log(arg, ':: changepageEvent', this)
      })
    },
    mounted(){
      console.log('list mounted')
    },
    computed:{
      hasResult(){
        return this.posts.length > 0;
      }
    },
    methods:{
      removeServerModifyData(){
        console.log('CurrentPost값 제거')
        this.$firebaseDB.collection('community').doc('content').update({
          currentPost : null
        });
      },

      changeDateFormat(date) {
        function unixTime(unixtime) {
          let u = new Date(unixtime*1000);

          return u.getFullYear() +
            '-' + ('0' + u.getMonth()).slice(-2) +
            '-' + ('0' + u.getDate()).slice(-2) +
            ' ' + ('0' + u.getHours()).slice(-2) +
            ':' + ('0' + u.getMinutes()).slice(-2) +
            ':' + ('0' + u.getSeconds()).slice(-2) +
            '.' + (u.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
        };
        let changeDate = unixTime(date).split(' ')[0];
        //console.log('변환',unixTime(date))
        return changeDate;
      },
      getServerData(){
        const vmThis = this;

        const dataCollection = this.$firebaseDB.collection('community').doc('content').collection('community-data');
        dataCollection
          .orderBy('timeStamp')
          .get().then((querySnapshot) => {
          let dataLength = 0;
          querySnapshot.forEach((doc) => {
            //console.log('loadingServerData ==>', doc.id)
            dataLength++;

            let tmp = doc.data();
            tmp.newTimeStamp = this.changeDateFormat(tmp.timeStamp.seconds);
            this.getData.push(tmp)
          });
          this.getData.reverse();
          // id 기준으로 내림 정렬
          /*this.getData.sort(function (a, b) {
            if (a.id < b.id) {
              return 1;
            }
            if (a.id > b.id) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });*/
          this.totalListLength = dataLength;
          this.$store.state.communityTotalList = dataLength;
          this.fetchData();
          this.removeServerModifyData();
        })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
      },

      fetchData(newIndex) {
        console.log('totalList',this.$store.state.communityTotalList)
        const vmThis = this;
        this.pagingData.startPage = newIndex === undefined? 0 : this.showingListLength;
        this.pagingData.endPage = newIndex === undefined? this.showingListLength : newIndex;
        //console.log('fetchData', 'getData',this.getData, 'totalListLength:' + this.totalListLength, 'showingListLength:'+this.showingListLength)

        let addData = this.getData.slice(this.pagingData.startPage, this.pagingData.endPage);
        this.posts = this.posts.concat(addData);

        console.log('fetch',this.posts)
      },

      //paging
      gotoStartPageIndex(){

      },
      gotoEndPageIndex(){

      },

      changeListHandler(index){
        console.log('changeListHandler', index)
        // let addIndex = this.showingListLength + 3;
        // this.fetchData(addIndex);
        // this.showingListLength = addIndex;
      },
      showCurrentPage(){

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
