  <template>
    <div>

      <h1 class="mb-4">커뮤니티 상세페이지</h1>

      <div class="row">
        게시판 상세내용
      </div>

      <div class="row">
        <div class="col d-flex justify-content-between">
          <div class="btn-group">
            <button type="button" class="btn btn-danger">삭제</button>
          </div>

          <div class="btn-group">
            <router-link :to="link" class="btn btn-dark">
              목록
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'CommunityBoardDetail',
    data(){
      return{
        link: "/community",
      }
    },
    methods:{
      showModalpopup(title, componentName){
        this.$store.state.pop_title = title;
        this.$store.state.pop_content = componentName;
      },
    }
  }
  </script>
