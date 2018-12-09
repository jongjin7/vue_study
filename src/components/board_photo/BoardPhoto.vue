<template>
  <div>
    <h1 class="mb-4">갤러리 게시판</h1>
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="card-title mb-2">학습 목표</h2>
        <ol class="col mb-4">
          <li>포토 갤러리 게시판으로 DB에 등록/수정/삭제</li>
          <li>LocalStorage와 FireBaseDB의 데이타 연동(기준 데이터는 서버데이타, 앱은 로컬스토리지 데이타 사용)</li>
        </ol>

        <h3 class="card-title mb-2">기능 정의 <button class="btn btn-sm btn-light">더보기...</button></h3>
        <ol class="col mb-0">
          <li>리스트에 100개씩 게시물 노출, 더보기 이벤트를 실행하 숨겨진 리스트 노출 (DB에서 가져오는 데이터 기본량은 1000개, 노출할 데이터가 없을때 DB에서 추가 데이터 로딩:구현예정) </li>
          <li>기능적인 내용 넣기</li>
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
              <p class="img-holder" :style="'background-image: url(' + post.imagePath + ');'"></p>
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
                      <button type="button" class="btn btn-sm btn-outline-light text-success" @click="showModalpopup('갤러리 수정하기', 'photo'); $EventBus.$emit('showModal');">수정하기</button>
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
      console.log('로컬과 서버 데이터 갯수 비교')
      return this.posts.length !== this.totalListLength;
    },
  },

  created(){
    this.getServerData();
  },

  methods: {
    showModalpopup(title, componentName){
      this.$store.state.pop_title = title;
      this.$store.state.pop_content = componentName;
    },

    getServerData(){
      const vmThis = this;

      //서버에 저장된 최종 인덱스 값 얻기
      this.$firebaseDB.collection('photo-gallery').doc('content').get().then((doc)=>{
        console.log('Last Index to DB', doc.data().lastIndex)
        this.$store.state.latestGalleryListIndex = doc.data().lastIndex;
      });

      this.$firebaseDB.collection('photo-gallery').doc('content').collection('gallery-data').get().then((querySnapshot) => {
        let localData = localStorage.getItem(STORAGE_KEY_PHOTO_GALLERY);
          querySnapshot.forEach((doc) => {
            //console.log('loadingServerData ==>', doc.data())
            this.getData.push(doc.data())
          })
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
      console.log('fatchData', addData)
      this.posts = this.posts.concat(addData);
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
    .card{
      .img-holder{
        padding-top:70%;
        margin-bottom: 0;
        overflow:hidden;
        background-color: #f9f9f9;
        background-repeat: no-repeat;
        background-position: center center;
        background-size:100% auto;

        @media (max-width:767px){
          padding-top:70%;
        }
      }
      .remove-chkbox{
        position: absolute; top:10px; right:10px;
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
