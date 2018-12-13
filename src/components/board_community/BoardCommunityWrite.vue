<template>
  <div class="mb-5">
    <h1 class="mb-4">새글 입력하기</h1>
    <form class="">
      <div class="form-group">
        <label for="inp-pop-title">제목</label>
        <input type="text" class="form-control" id="inp-pop-title"  placeholder="제목을 입력하세요" v-model="newPostItem.title" autofocus autocomplete="off" required>
        <small class="text-muted">
          제목을 입력하세요.
        </small>
      </div>
      <div class="form-group">
        <label>본문내용</label>
        <html-editor height="200" :model.sync="newPostItem.body"></html-editor>
        {{ replaceHtmlTag }}
      </div>

      <div class="form-group">
        <label>첨부파일</label>
        <div class="custom-file mb-3">
          <input type="file" class="custom-file-input" id="customFile" @change="onFileChange">
          <label class="custom-file-label" for="customFile">{{ newPostItem.fileName }}</label>
        </div>
      </div>

      <button type="button" class="btn btn-primary w-100" @click="addContent">
        <span v-if="modeNewPost">등록하기</span>
        <span v-else>수정하기</span>
      </button>

      <router-link :to="link" class="btn">
        리스트로 이동하기
      </router-link>
    </form>
  </div>
</template>
<script>
  import htmlEditor from "./BoardWebEditor.vue";
  export default {
    name:'boardGeneralWrite',
    data(){
      return{
        link:'/community',
        oldPostItem: '',
        newPostItem:{
          title:'',
          body:'',
          author:'jongjin',
          fileName:null,
          filePath:null,
          commentCount:0,
          hit:0,
          id:0,
        },
        getData:[],
        localFile:null,
        modeNewPost:true,
      }
    },
    created(){
      console.log('created', 'store:',this.$store.state.communityDetailContent, 'new:',this.newPostItem);
      this.getServerLastindex();

      if(this.$store.state.popGalleryContent !== null ){
        this.oldPostItem = this.$store.state.communityDetailContent;
        this.newPostItem = this.$store.state.communityDetailContent;
        this.modeNewPost = false;
      }else{

      }
    },
    watch:{

    },
    computed:{
      replaceHtmlTag(){
        let str = this.newPostItem.body;
        str = str.replace(/</g,"&lt;");
        str = str.replace(/>/g,"&gt;");
        str = str.replace(/\"/g,"&quot;");
        str = str.replace(/\'/g,"&#39;");
        str = str.replace(/\n/g,"<br />");
        return str;
      },
    },

    methods:{
      getServerLastindex(){
        //서버에 저장된 최종 인덱스 값 얻기
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').get().then((doc)=>{
          //console.log('get Last Index to DB', doc.data().lastIndex)
          vm.newPostItem.id = doc.data().lastIndex;
        });
      },
      updateServerLastIndex(){
        //console.log('updateId', this.newPostItem.id)
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').update({
          lastIndex: vm.newPostItem.id
        });
      },

      onFileChange(e) {
        var file = e.target.files || e.dataTransfer.files;
        if (!file.length) return;
        this.localFile = file[0];
        this.newPostItem.fileName = file[0].name;
      },

      addContent: function () {
        console.log('addContent')
        const vm = this;
        if(vm.newPostItem.title != '' && vm.newPostItem.body != '' ){
          vm.uploadServerStorageFile();
        }else{
          console.log('내용을 입력하시요 form validation을 작성')
        }
      },

      writeToDataBase(){
        console.log('write Item', this.newPostItem)
        const vm = this;
        this.newPostItem.title = this.newPostItem.title.trim();
        this.newPostItem.body = this.newPostItem.body.trim();
        this.newPostItem.id += 1;
        if(this.modeNewPost) this.newPostItem.timeStamp= new Date(); //firestore timestamp 객체로 저장
        this.newPostItem.modifyTimeStamp= new Date();

        console.log('writeToDataBase', this.newPostItem);
        this.$firebaseDB.collection('community').doc('content').collection('community-data')
          .doc('community-data-'+this.newPostItem.id).set(this.newPostItem).then(function(){
          vm.updateServerLastIndex(); //서버에 인덱스 저장
          vm.completedWriteToDataBase();
        });
      },

      completedWriteToDataBase(){
        console.log(':: Add Content to Server... New Content')
        this.$router.push('/community');
      },

      uploadServerStorageFile(){
        console.log('uploadServerStorageImage!!', this.newPostItem.fileName);
        var vm = this;

        if(this.localFile !== null) { //이미지가 새로 등록되거나 수정되었다면?
          // Create a root reference
          var storageRef = this.$firebaseStorage.ref();

          var mountainsRef = storageRef.child('file_upload');
          // disk에서 가져오는 이미지를 참조하는 폴더에 정의한다.
          var mountainFilesRef = storageRef.child('file_upload/' + this.newPostItem.fileName);
          // While the file names are the same, the references point to different files
          mountainsRef.name === mountainFilesRef.name            // true
          mountainsRef.fullPath === mountainFilesRef.fullPath    // false

          console.log('mountainFilesRef', mountainFilesRef)

          mountainFilesRef.put(this.localFile).then(function (snapshot) {
            //console.log(snapshot, 'Uploaded a blob or file!');
            storageRef.child(snapshot.metadata.fullPath).getDownloadURL().then(function (url) {
              vm.newPostItem.filePath = url;
              vm.writeToDataBase();
            });
          });
        }else{
          vm.writeToDataBase();
        }
      },
    },
    components: {
      htmlEditor
    },
  }
</script>
