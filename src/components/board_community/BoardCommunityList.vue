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


      <CommunityListTable />

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
    const STORAGE_KEY_COMMUNITY_DETAIL = 'community-detail';

    import CommunityListSearch from './BoardCommunityListSearch';
    import CommunityListTable from './BoardCommunityListTable';
    import CommunityListPaging from './BoardCommunityListPaging';

  export default {
    name: 'CommunityBoard',
    data(){
      return{
        link: {
          editor:'community-write',
          detail:'community-detail',
        },
      }
    },

    created(){
      console.log('created')
    },

    beforeMount(){
      console.log('beforeCreate');
      this.removeDetailPost();
    },
    mounted(){
      console.log('mounted')

    },
    computed:{

    },
    methods:{
      removeDetailPost(){
        const localData = sessionStorage.getItem(STORAGE_KEY_COMMUNITY_DETAIL);
        if(localData !== null){
          sessionStorage.removeItem(STORAGE_KEY_COMMUNITY_DETAIL);
        }
      },

    },
    components:{
      CommunityListSearch,
      CommunityListTable,
      CommunityListPaging,
    }
  }
  </script>

