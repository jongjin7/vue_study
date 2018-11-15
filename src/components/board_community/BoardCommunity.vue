  <template>
    <div>

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
        <tbody>
        <tr>
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
        </tr>
        <tr>
          <td>88</td>
          <td><a href="">게시물 제목입니다.</a></td>
          <td>멍구리</td>
          <td>2018.11.30</td>
          <td>999</td>
        </tr>
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
          <router-link :to="link.editor" class="btn btn-primary btn-block">
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
          detail:'community_detail'
        }
      }
    },
    methods:{

    }
  }
  </script>
