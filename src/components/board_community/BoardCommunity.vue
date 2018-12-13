  <template>
    <div class="mb-5">

      <h1 class="mb-4">커뮤니티 게시판</h1>
      <ul class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Photos</a></li>
        <li class="breadcrumb-item"><a href="#">Summer 2017</a></li>
        <li class="breadcrumb-item"><a href="#">Italy</a></li>
        <li class="breadcrumb-item active">Rome</li>
      </ul>

      <div class="row">
        <div class="col-md-8">
          <form class="" action="">
            <div class="input-group mb-3">
              <div class="flex-grow-1">
                <label for="bs-search" class="d-none">검색</label>
                <input class="form-control" id="bs-search" type="text" placeholder="검색할 내용">
              </div>
              <div class="input-group-append">
                <button class="btn btn-dark w-100" type="button">검색하기</button>
              </div>
            </div>
          </form>
        </div>

        <div class="col-md-4 mb-3 text-right">
          <div class="form-group">
            <router-link :to="link.editor" class="btn btn-primary btn-block">
              글쓰기
            </router-link>
          </div>
        </div>
      </div>

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
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
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
      <ul class="pagination justify-content-end">
        <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item active"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>

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
  export default {
    name: 'CommunityBoard',
    data(){
      return{
        link: {
          editor:'community_editor',
          detail:'community_detail',
        },
        posts: [],
        getData:[],
        showingListLength:3,
        totalListLength:'',
        arrCheckedPost :[],
        doRefresh:true,
      }
    },

    created(){
      this.getServerData();
    },
    computed:{
      hasResult(){
        return this.posts.length > 0;
      }
    },
    methods:{
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

        this.$firebaseDB.collection('photo-gallery').doc('content').collection('gallery-data').get().then((querySnapshot) => {
          let dataLength = 0;
          querySnapshot.forEach((doc) => {
            //console.log('loadingServerData ==>', doc.data())
            dataLength++;
            let tmp = doc.data();
            tmp.newTimeStamp = this.changeDateFormat(tmp.timeStamp.seconds);
            this.getData.push(tmp)
          });
          this.getData  = this.getData.reverse();
          this.totalListLength = dataLength;
          this.fetchData();
        })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
      },

      fetchData(newIndex) {
        console.log('fetch',this.posts,
          'getData',this.getData,
          'totalListLength:' + this.totalListLength, 'showingListLength:'+this.showingListLength)
        const vmThis = this;
        let startIndex = newIndex === undefined? 0 : this.showingListLength;
        let endIndex = newIndex === undefined? this.showingListLength : newIndex;
        //console.log('fetchData', this.showingListLength, endIndex, this.totalListLength)
        let addData = this.getData.slice(startIndex, endIndex);
        this.posts = this.posts.concat(addData);
      },
    }
  }
  </script>
