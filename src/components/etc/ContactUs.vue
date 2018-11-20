<template>
  <div class="contact">


    <h4>DB에 데이터 저장하고 출력하기</h4>
    <form>
      <div class="form-group">
        <label>의견사항 등록하기</label>
        <textarea class="form-control" id="tarea"  rows="3" v-model="comment"></textarea>
      </div>

      <div class="form-group">
        <div v-if="!image">
          <input type="file" @change="onFileChange" id="img-input">
        </div>

        <div v-else>
          <img :src="image" width="300" />
          <button @click="removeImage">Remove image</button>
        </div>
      </div>

      <button type="button" class="btn btn-primary" @click="addComment">내용 입력 후 리스트 추가</button>
      <button type="button" class="btn btn-primary" @click="deleteComment">선택한 데이터 삭제하기</button>
    </form>

    <!-- 저장후 출력 -->
    <div class="mt-4" v-if="hasResult && posts && posts.length">
      <h5>DB에는 현재 {{ posts.length }}개의 게시물이 등록되어 있습니다.</h5>
      <ol>
        <li v-for="post in posts" v-bind:key="post.id">
          <div v-if="post.type"><img :src="post.first" alt="" width="100"></div>
          <div v-else class="txt">{{ post.first }}</div>
        </li>
      </ol>
    </div>

    <div class="contact-block">
      <div class="section-header">
        <h2 class="section-title">Contact <span>Us</span></h2>
        <hr>
      </div>
      <form id="contactForm" novalidate="true">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <input type="text" class="form-control" id="name" name="name" placeholder="Your Name" required="" data-error="Please enter your name">
              <div class="invalid-feedback">에러정보 출력</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group has-error">
              <input type="text" placeholder="Your Email" id="email" class="form-control" name="name" required="" data-error="Please enter your email">
              <div class="invalid-feedback">에러정보 출력</div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <input type="text" placeholder="Subject" id="msg_subject" class="form-control" required="" data-error="Please enter your subject">
              <div class="invalid-feedback">에러정보 출력</div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <textarea class="form-control" placeholder="Your Message" rows="11" data-error="Write your message" required=""></textarea>
              <div class="invalid-feedback">에러정보 출력</div>
            </div>
            <div class="submit-button text-center">
              <button class="btn btn-common disabled" id="submit" type="submit" style="pointer-events: all; cursor: pointer;">Send Message</button>
            </div>
          </div>
        </div>
      </form>
    </div>

  </div>
</template>

<script>


// 생성:documentName은 랜덤정의
// db.collection("users").add({
//   first: "jong",
//   middle: "jin",
//   last: "Lim",
//   born: 20000
// })
// .then(function(docRef) {
//   console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//   console.error("Error adding document: ", error);
// });

// 읽기
// db.collection('users').get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) =>{
//     console.log('read', `${doc.id} :=> ${doc.data().first}`)
//   })
// })

// db.collection('users').doc('mirra').set({
//   first:'태태태태',
//   middle:'md',
//   last:'lmi'
// })





export default {
  name: "ContactUs",
  props:['currentContent'],
  data() {
    return {
      postTitle: null,
      comment: null,
      loading: false,
      error: null,
      posts: [],
      image:'',
      isDataImage: false,

    };
  },
  // firebase binding
  // https://github.com/vuejs/vuefire
  firebase:{
    users:this.$firebaseDB
  },

  computed: {
    hasResult: function() {
      return this.posts.length > 0;
    }
  },

  created() {
    // 뷰가 생성되고 데이터가 이미 감시 되고 있을 때 데이터를 가져온다.
    this.fetchData();
  },
  watch: {
    // 라우트가 변경되면 메소드를 다시 호출됩니다.
    $route: "fetchData"
  },
  methods: {


    addComment() {
      console.log("입력받은 내용", this.isDataImage);
      var that = this;
      this.$firebaseDB.collection('users').add({
        first:this.comment,
        middle:'md',
        last:'lmi',
        type:this.isDataImage
      }).then(function(){
        that.isDataImage = false;
        that.posts = [];
        that.fetchData();
        that.updateComment();
        that.image = '';
      })
    },

    updateComment() {
      console.log('update list')
      this.comment = null;
    },

    deleteComment(){
      var that = this;
      const selectedDoc = prompt('현재 삭제고픈 게시물 이름', '')
      this.$firebaseDB.collection("users").doc(selectedDoc).delete().then(function() {
        that.posts = []
        that.fetchData();
        console.log(selectedDoc + "Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });

    },

    fetchData() {
      console.log('fetchData!!!')

      this.$firebaseDB.collection('users').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) =>{
          console.log('read', `${doc.id} :=> ${doc.data().type}`)
          this.posts.push(doc.data());
        })
      })
    },

    sendImage(img_file){
      console.log('sendImage!!');
      // Create a root reference
      this.isDataImage = true;
      var storageRef = this.$firebaseStorage.ref();

      var mountainsRef = storageRef.child('img_upload');
      // disk에서 가져오는 이미지를 참조하는 폴더에 정의한다.
      var mountainImagesRef = storageRef.child('img_upload/'+ img_file.name);
      // While the file names are the same, the references point to different files
      mountainsRef.name === mountainImagesRef.name            // true
      mountainsRef.fullPath === mountainImagesRef.fullPath    // false

      var that = this;
      mountainImagesRef.put(img_file).then(function(snapshot) {
        //console.log(snapshot, 'Uploaded a blob or file!');
        storageRef.child(snapshot.metadata.fullPath).getDownloadURL().then(function(url){
          that.comment = url;
        });
      });
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
      this.sendImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
        //console.log('read', e.target.result)
      };
      reader.readAsDataURL(file);

    },
    removeImage(e) {
      this.image = '';
    }

  }
};
</script>
