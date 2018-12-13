  <template>
    <div class="mb-5">

      <p class="h6 mb-4">
        <router-link :to="link">
        커뮤니티 게시판 목록
        </router-link>
        > 상세페이지</p>

        <div class="container">
          <div class="row">
            <div class="col pt-2 pb-3 mx-auto">
              <!-- 게시글 출력 -->
              <h1>{{ post.title }}</h1>
              <div class="post-meta mb-4">
                <span class="badge badge-secondary" title="등록자">{{ post.author }}</span>
                <span class="badge badge-secondary" title="등록일">{{ post.newTimeStamp }}</span>
                <a class="badge badge-warning" title="첨부파일" :href=" post.filePath ">첨부파일: {{ post.fileName }}</a>
              </div>
              <article v-html="post.body">
              <!-- 에디터 입력 출력 -->
                <!--<p class="subtitle">Pellentesque suscipit leo vitae venenatis congue. Pellentesque feugiat augue nisl, vitae aliquet ex accumsan quis. Duis quam sapien, volutpat quis dui at?</p>
                <figure>
                  <img class="img-fluid" src="https://picsum.photos/1600/900/?image=931" alt="">
                  <figcaption class="text-muted text-left pt-2">Suspendisse in lacus vel massa vulputate ornare. Ut sit amet auctor ex. Nulla quis nibh posuere, pulvinar enim eu, sagittis eros. Sed vehicula consequat ipsum quis ornare. (Unsplash/Paul Earle)</figcaption>
                </figure>-->

                <!--<p>
                  <span>에디터 입력시 이미지에는 width값 100%를 넣어줘야 한다.</span>
                  <img width="100%" src="https://picsum.photos/1600/900/?image=931" alt="">
                </p>

                <p>
                  Nullam fringilla sollicitudin facilisis. Donec velit nunc, aliquam vitae suscipit at, vestibulum sit amet metus.
                  Aenean eu odio dui. Sed non erat nulla. Pellentesque tempus mauris in ultrices rutrum.
                  Maecenas id lorem sit amet enim euismod ultricies at non orci.
                  Quisque tristique interdum dictum. Sed ut condimentum dolor. Morbi vel vulputate elit.
                </p>-->

              <!-- // 에디터 입력 출력 -->
              </article>
            </div>
          </div>
        </div>

      <div class="row">
        <div class="col d-flex justify-content-between">
          <div class="bnts">
            <button type="button" class="btn btn-danger">삭제하기</button>
          </div>

          <div class="btns">
            <button type="button" class="btn btn-warning">수정하기</button>
            <router-link :to="link" class="btn btn-dark">
              목록보기
            </router-link>
          </div>
        </div>
      </div>

      <!-- comment -->
      <CommunityDetailComment />

    </div>
  </template>
  <script>
    import CommunityDetailComment from './BoardCommunityDetailComment.vue'
  export default {
    name: 'CommunityDetail',
    props:{

    },
    data(){
      return{
        link: "/community",
        post: '',
        currentPageId:'',
      }
    },
    created(){
      this.currentPageId = location.hash.split('/')[2];
      this.fetchData();
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

      deCompileHtmlTag(str){
        str = str.replace(/&lt;/g,"<");
        str = str.replace(/&gt;/g,">");
        str = str.replace(/&quot;/g,"\"");
        str = str.replace(/&#39;/g,"\\'");
        str = str.replace(/<br\/>/g,"\n");
        return str;
      },


      fetchData() {
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').collection('community-data').doc('community-data-'+ this.currentPageId).get().then((doc)=>{
          console.log('get Last Index to DB', doc.data())
          vm.post = doc.data();
          vm.post.newTimeStamp = this.changeDateFormat(vm.post.timeStamp.seconds)
        });
      },
    },

    components:{
      CommunityDetailComment,
    }
  }
  </script>
