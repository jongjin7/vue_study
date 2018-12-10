<template>
  <div>
    <h1 class="mb-4">갤러리 게시판</h1>
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="card-title mb-2">학습 목표</h2>
        <ol class="col mb-4">
          <li>포토 갤러리 게시판으로 DB에 등록/수정/삭제</li>
          <li>LocalStorage와 FireBaseDB의 데이타 연동(기준 데이터는 서버데이타, 앱은 로컬스토리지 데이타 사용)</li>
          <li>추가/로컬스토리와 DB분기화/처리수정하지 않고 등록버튼 누르면 에러 ==> 닫기버튼만 닫을시 취소 처리/등록일 추가/글 등록 또는 수정 후 부모 페이지 자동고침 방법</li>
          <li>등록,수정 팝업/ 수정 팝업 실행후 바로 닫을때 남아있는 폼 데이터 제거</li>
          <li>삭제기능, 선택삭제</li>
        </ol>

        <h3 class="card-title mb-2">기능 정의 <button class="btn btn-sm btn-light">더보기...</button></h3>
        <ol class="col mb-0">
          <li>리스트에 100개씩 게시물 노출, 더보기 이벤트를 실행하 숨겨진 리스트 노출 (DB에서 가져오는 데이터 노드수는 1000개, 노출할 데이터가 없을때 DB에서 추가 데이터 로딩:구현예정) </li>
          <li>계정 권한에 따라 어드민은 선택적으로 아이템을 수정/삭제, 개인 계정은 등록 게시물에 한하여 수정/삭제(현재 권한설정 없음)</li>
        </ol>
      </div>
    </div>

    <div class="album bg-light">
      <div class="container">
        <div class="top-btns d-flex justify-content-between pt-2 pb-3">
          <button class="btn btn-lg btn-outline-danger my-2">선택한 게시물 삭제</button>
          <button class="btn btn-lg btn-outline-primary my-2" @click="showModalpopup('새글 등록하기', 'photo'); $EventBus.$emit('showModal');">새글 등록</button>
        </div>
        <div class="row" v-if="hasResult">
          <div class="col-lg-4 col-md-6" v-for="post in posts" v-bind:key="post.id">
            <div class="card mb-4 box-shadow">
              <p class="img-holder"><span :style="'background-image: url(' + post.imagePath + ');'"></span></p>
              <div class="card-body">
                <h2 class="card-title h5">{{ post.title }}</h2>
                <p class="card-text">{{ post.body }}</p>

                <div class="author text-right">
                  <small class="text-muted mr-2">작성자: hong.kim</small>
                  <small class="text-muted">등록일: 2018.12.12/ {{ post.id }}</small>
                </div>

                <div class="card-foot">
                  <hr>
                  <div class="d-flex justify-content-end">
                    <div class="remove-chkbox">
                      <input type="checkbox" :id="'remove-chk-' + post.id">
                      <label :for="'remove-chk-' + post.id">선택</label>
                    </div>
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-light text-danger">삭제하기</button>
                      <button type="button" class="btn btn-sm btn-outline-light text-success" @click="showModalpopup('갤러리 수정하기', 'photo', post); $EventBus.$emit('showModal');">수정하기</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-lg btn-block btn-outline-secondary my-2" @click="showMoreList();" v-if="compareDataLength">리스트 더 보기</button>
  </div>
</template>

<script>
const STORAGE_KEY_PHOTO_GALLERY = 'board-photo-gallery';

export default {
  name: "BoardPhoto",
  data() {
    return {
      msg: "Album Component",
      posts: [],
      getData:[],
      showingListLength:3,
      totalListLength:'',
    };
  },

  watch:{
    posts: {
      handler: function (todos) {
        this.saveToLocalStorage(todos)
      },
      deep: true
    }
  },

  computed: {
    hasResult: function() {
      console.log("posts", this.posts.length);
      return this.posts.length > 0;
    },
    compareDataLength(){
      console.log('로컬과 서버 데이터 갯수 비교',this.posts.length,this.totalListLength)
      return this.posts.length !== this.totalListLength;
    },
  },

  created(){
    this.getServerData();

  },

  methods: {
    showModalpopup(title, componentName, post){
      this.$store.state.pop_title = title;
      this.$store.state.pop_content = componentName;
      if(post !== undefined) this.$store.state.popGalleryContent = post; //수정용 post
    },

    getServerData(){
      const vmThis = this;

      //서버에 저장된 최종 인덱스 값 얻기
      this.$firebaseDB.collection('photo-gallery').doc('content').get().then((doc)=>{
        console.log('Last Index to DB', doc.data().lastIndex)
        this.$store.state.latestGalleryListIndex = doc.data().lastIndex;
      });

      this.$firebaseDB.collection('photo-gallery').doc('content').collection('gallery-data').get().then((querySnapshot) => {
        let dataLength = 0;
        querySnapshot.forEach((doc) => {
          //console.log('loadingServerData ==>', doc.data())
          dataLength++;
          this.getData.push(doc.data())
        });
        this.totalListLength = dataLength;
        //console.log('querySnapshot', dataLength, querySnapshot)
        this.fetchData();
      });

      /*let that = this;
      this.$http.get(`/photos`).then(result => {
        console.log("result", result);
        this.getData = result.data;
        this.totalListLength = result.data.length;
        this.fetchData();
      });*/
    },

    saveToLocalStorage(todos){
      localStorage.setItem(STORAGE_KEY_PHOTO_GALLERY, JSON.stringify(todos))
    },

    fetchData(newIndex) {

      const vmThis = this;



      let startIndex = newIndex === undefined? 0 : this.showingListLength;
      let endIndex = newIndex === undefined? this.showingListLength : newIndex;
     // console.log('fetchData', this.showingListLength, endIndex, this.totalListLength)
      let addData = this.getData.slice(startIndex, endIndex);
      this.posts = this.posts.concat(addData);
      console.log('fatchData', addData, this.posts);
    },

    showMoreList(){
      let addIndex = this.showingListLength + 3;
      this.fetchData(addIndex);
      this.showingListLength = addIndex;
      console.log('등록되는 새글', this.$store.state.popGalleryContent);
    },
  }
};
</script>
<style lang="scss" scoped>
  .album{
    /*.row{
      &:hover{
        .card{
          opacity: 0.6;
        }
        .card:hover{
          opacity: 1;
          .card-body{
            opacity: 0.6;
          }
        }
      }
    }*/
    .card{
      .img-holder{
        position: relative;
        padding-top:70%;
        margin-bottom: 0;


        span{
          display: block;
          position: absolute; left:0; top:0; bottom:0; right:0;
          border-radius:2px 2px 0 0;
          background-color: #f9f9f9;
          background-repeat: no-repeat;
          background-position: center center;
          background-size:100% auto;
          transform:scale(1);
          transition:all 0.3s ease-in-out;
        }

        &:hover{
          span{
            border-radius: 4px;
            box-shadow: 0 0 5px rgba(black,0.1);
            z-index: 2;
            transform:scale(1.15);
          }
        }



        @media (max-width:767px){
          padding-top:70%;
        }
      }
      .remove-chkbox{
        position: absolute; top:10px; right:10px;
        z-index: 10;
        text-align: center;
        padding:2px;
        line-height:1;
        background: rgba(white,0.3);
        border-radius:2px;
        label{
          display: block;
          margin-top: 2px;
          margin-bottom: 0;
          font-size: 10px;
          line-height:1;
          color:#444;
        }
      }

      .btn-group{
        button{
          opacity: 0.7;
          &:hover{
            opacity: 1;
            background: transparent;
          }
        }
      }
    }
  }
</style>
