  <template>
    <div class="mb-5">

      <h1 class="mb-4">커뮤니티 게시판 상세페이지</h1>

        <div class="container">
          <div class="row">
            <div class="col pt-2 pb-3 mx-auto">
              <!-- 게시글 출력 -->
              <h1>Lorem Ipsum Dolor sit Amet</h1>
              <div class="post-meta mb-4">
                <a class="badge badge-pill badge-primary" href="post.html" title="등록자">홍길동</a>
                <span class="badge badge-pill badge-secondary" title="닉네임">아이디 &amp; Culture</span>
                <span class="badge badge-pill badge-secondary" title="등록일">2018.11.11</span>
              </div>
              <article>
              <!-- 에디터 입력 출력 -->
                <p class="subtitle">Pellentesque suscipit leo vitae venenatis congue. Pellentesque feugiat augue nisl, vitae aliquet ex accumsan quis. Duis quam sapien, volutpat quis dui at?</p>
                <figure>
                  <img class="img-fluid" src="https://picsum.photos/1600/900/?image=931" alt="">
                  <figcaption class="text-muted text-left pt-2">Suspendisse in lacus vel massa vulputate ornare. Ut sit amet auctor ex. Nulla quis nibh posuere, pulvinar enim eu, sagittis eros. Sed vehicula consequat ipsum quis ornare. (Unsplash/Paul Earle)</figcaption>
                </figure>

                <p>
                  Aliquam vitae nibh vel neque vehicula fermentum et id nunc.
                  Aenean sit amet lectus in justo iaculis volutpat.
                  Aliquam facilisis, ligula et bibendum laoreet, metus enim viverra nulla, euismod faucibus justo velit eu tortor.
                  Nulla facilisi. Aliquam dui ligula, varius quis feugiat at, luctus ac dui.
                  Suspendisse lobortis tincidunt orci, sed hendrerit sapien vulputate nec.
                  Maecenas rhoncus, velit dictum pretium mollis.
                </p>
                <p>
                  Morbi imperdiet ut arcu eu malesuada. Integer vestibulum leo eget enim facilisis scelerisque.
                  Nam justo augue, mollis a porttitor sed, finibus interdum lacus.
                  Pellentesque a lacus mi. Sed eleifend imperdiet arcu, eu sollicitudin neque rhoncus eu.
                  Donec malesuada consectetur molestie. Praesent dignissim pellentesque enim, vel dictum nisi condimentum vitae.
                  Duis pharetra ultricies nulla, a facilisis risus sodales id.
                </p>
                <p>
                  Nunc mollis iaculis purus eu commodo. Vestibulum rutrum cursus purus, eu efficitur lorem.
                  Pellentesque urna leo, faucibus vel lobortis vitae, congue et elit.
                  Donec viverra purus ut elit sodales, quis feugiat nibh blandit.
                  Praesent pellentesque molestie sem, ut feugiat diam aliquam vitae.
                  Fusce dui nibh, condimentum sed quam eget, malesuada rhoncus massa.
                  Suspendisse sapien urna, hendrerit nec tristique a, feugiat sed nibh.
                </p>
                <p>
                  Curabitur ultricies tortor leo. Nullam eu leo vestibulum, dapibus nisl vitae, pellentesque leo.
                  Vivamus sem nibh, placerat ut metus eu, tincidunt imperdiet leo.
                  Cras tincidunt varius turpis sit amet vulputate. Vestibulum pretium velit eu viverra aliquet.
                  Nullam sapien purus, venenatis id maximus vel, molestie ut mauris. Etiam commodo sem at luctus posuere.
                </p>

                <p>
                  <span>에디터 입력시 이미지에는 width값 100%를 넣어줘야 한다.</span>
                  <img width="100%" src="https://picsum.photos/1600/900/?image=931" alt="">
                </p>

                <p>
                  Nullam fringilla sollicitudin facilisis. Donec velit nunc, aliquam vitae suscipit at, vestibulum sit amet metus.
                  Aenean eu odio dui. Sed non erat nulla. Pellentesque tempus mauris in ultrices rutrum.
                  Maecenas id lorem sit amet enim euismod ultricies at non orci.
                  Quisque tristique interdum dictum. Sed ut condimentum dolor. Morbi vel vulputate elit.
                </p>
                <p>
                  Pellentesque suscipit leo vitae venenatis congue. Pellentesque feugiat augue nisl, vitae aliquet ex accumsan quis.
                  Duis quam sapien, volutpat quis dui at, porta luctus quam.
                  In sodales, ipsum id tempor suscipit, urna ligula iaculis nulla, nec sollicitudin sapien odio quis justo.
                  Mauris scelerisque, dui nec cursus iaculis, tortor nisi ullamcorper arcu, nec efficitur dui arcu tincidunt neque.
                  Nam at enim consectetur, facilisis nisl vitae, hendrerit orci.
                </p>
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
      <div class="media border p-3 mt-4">
        <img src="img_avatar3.png" alt="John Doe" class="mr-3 mt-3 rounded-circle" style="width:60px;">
        <div class="media-body">
          <h4>John Doe <small><i>Posted on February 19, 2016</i></small></h4>
          <p>Lorem ipsum...</p>
          <div class="media p-3">
            <img src="img_avatar2.png" alt="Jane Doe" class="mr-3 mt-3 rounded-circle" style="width:45px;">
            <div class="media-body">
              <h4>Jane Doe <small><i>Posted on February 20 2016</i></small></h4>
              <p>Lorem ipsum...</p>
            </div>
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
    created(){
      //Kakao.Auth.setAccessToken(localStorage.loginTokken);
    },
    methods:{
      showModalpopup(title, componentName){
        this.$store.state.pop_title = title;
        this.$store.state.pop_content = componentName;
      },
    }
  }
  </script>
