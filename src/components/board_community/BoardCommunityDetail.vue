  <template>
    <div class="community-detail mb-5">
      <ul class="breadcrumb small py-2 bg-light">
        <li class="breadcrumb-item">
          <router-link :to="link.toList">
            커뮤니티 게시판 목록
          </router-link>
        </li>
        <li class="breadcrumb-item active">상세페이지</li>
      </ul>

      <div class="row">
        <div class="col pt-2 pb-3 mx-auto">
          <!-- 게시글 출력 -->
          <h1>{{ post.title }}</h1>
          <div class="post-meta mb-4">
            <span class="badge badge-secondary" title="등록자">{{ post.author }}</span>
            <span class="badge badge-secondary" title="등록일">{{ post.newTimeStamp }}</span>
            <a class="badge badge-warning included-file" download title="첨부파일" :href="post.filePath" v-if="post.fileName !== null">첨부파일: {{ post.fileName }}</a>
          </div>
          <article class="container" v-html="post.body">
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

          <div class="sns-shares">
            <a id="kakao-link-btn" href="#" class="btn-share">
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"/>
              <span>카카오 공유하기</span>
            </a>
            <div class="stitle">공유하기</div>
          </div>

        </div>
      </div>

      <div class="row">
        <div class="col d-flex justify-content-between">
          <div class="bnts">
            <button type="button" class="btn btn-danger" @click="deleteCurrentPost">삭제하기</button>
          </div>

          <div class="btns">
            <router-link :to="link.toModify" class="btn btn-warning">
              수정하기
            </router-link>
            <router-link :to="link.toList" class="btn btn-secondary">
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
    const STORAGE_KEY_COMMUNITY_DETAIL = 'community-detail';
    import CommunityDetailComment from './BoardCommunityDetailComment.vue'
  export default {
    name: 'CommunityDetail',
    props:{

    },
    data(){
      return{
        link: {
         toList:'/community',
         toModify:'/community-write'
        },
        post: '',
        currentPageId:'',
      }
    },
    created(){
      this.currentPageId = location.hash.split('/')[2];
      this.fetchData();


    },
    mounted(){

    },
    destroyed(){
      sessionStorage.removeItem(STORAGE_KEY_COMMUNITY_DETAIL);
    },
    methods:{
      sharePage(){

        const vm = this;
console.log('kakao Share')
        // 스토리 공유 버튼을 생성합니다.
        Kakao.Link.createDefaultButton({
          container: '#kakao-link-btn',
          objectType: 'feed',
          content: {
            title: vm.post.title,
            description: '#케익 #딸기 #삼평동 #카페 #분위기 #소개팅',
            imageUrl: vm.post.filePath ? vm.post.filePath : 'http://mud-kage.kakao.co.kr/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
            link: {
              mobileWebUrl: location.href,
              webUrl: location.href
            }
          },
          social: {
            likeCount: 286,
            commentCount: 45,
            sharedCount: 845
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: location.href,
                webUrl: location.href
              }
            },
            {
              title: '앱으로 보기',
              link: {
                mobileWebUrl: location.href,
                webUrl: location.href
              }
            }
          ]
        });
      },

      changeDateFormat(date) {
        function unixTime(unixtime) {
          let u = new Date(unixtime*1000);

          return u.getFullYear() +
            '-' + ('0' + (u.getMonth()+1)).slice(-2) +
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

      saveCurrentPostData(){
        let tmpData = {
            title: this.post.title,
            body: this.post.body,
            fileName: this.post.fileName,
            filePath: this.post.filePath,
            id: this.post.id
          }
        sessionStorage.setItem(STORAGE_KEY_COMMUNITY_DETAIL, JSON.stringify(tmpData));
      },

      deleteCurrentPost(){
        console.log('deleteCurrentPost')
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').collection('community-data').doc('community-data-' + this.currentPageId).delete()
          .then(function() {
            console.log("DB Document successfully Removed!");
            alert('현재글이 삭제되었습니다.');
            vm.$router.push('/community');
          }).catch(function(error) {
          console.error("Error removing document: ", error);
        });
      },

      fetchData() {
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').collection('community-data').doc('community-data-'+ this.currentPageId).get().then((doc)=>{
          console.log('fetchData ==> get DB...', doc.data())
          vm.post = doc.data();
          vm.saveCurrentPostData();
          vm.post.newTimeStamp = this.changeDateFormat(vm.post.timeStamp.seconds)

          vm.sharePage();
        });
      },
    },

    components:{
      CommunityDetailComment,
    }
  }
  </script>
  <style lang="scss">

    .community-detail{
      h1{
        word-break: break-all;
      }

      .post-meta{
        .badge{
          vertical-align: middle;

          &.included-file{
            max-width:100%;
            overflow: hidden;
            text-overflow:ellipsis;
          }
        }
      }

      article{
        width:100%;

        table{
          max-width:100%;

          @media (max-width:767px){
            th,
            td{
              width:auto !important;
              min-width:0 !important;
            }
          }
        }

        p{
          word-break: break-all;
          img{
            max-width:100%;
            height:auto !important;
          }
        }
      }

      .sns-shares{
        position: relative;
        padding: 0.5rem;
        background: #fafafa;
        border-radius: 0.2rem;
        line-height:1;
        .btn-share{
          display: inline-block;
          padding-right: 0.25rem;
          font-size: 0.75rem;
          overflow: hidden;
          text-decoration: none;
          vertical-align: top;

          img{
            height:20px;
            vertical-align: middle;
          }
          span{
            vertical-align: middle;
          }
        }
        .stitle{
          position: absolute; right:0; top:0;
          background: rgba(0,0,0,0.2);
          padding:0.1rem 0.4rem 0.2rem;
          font-size: 0.5rem;
          border-top-right-radius: 0.2rem;
          border-bottom-left-radius: 0.2rem;
          color:#fff;
          text-shadow:0.05rem 0.05rem rgba(0,0,0,0.3);
        }
      }

    }
  </style>
