<template>
  <div class="mb-5">
    <h1 class="mb-4">
      <span>{{ pageTitle }}</span>
    </h1>
    <form class="">
      <div class="form-group">
        <label for="inp-pop-title">제목</label>
        <input type="text" class="form-control" id="inp-pop-title"  placeholder="제목을 입력하세요" v-model="newPost.title" autofocus autocomplete="off" @keyup="validateTitle" @focusout="validateTitle" required>
        <div class="invalid-feedback">{{ errorMessage.title}}</div>
      </div>
      <div class="form-group">
        <label>본문내용</label>
        <html-editor
          name="editor"
          :postBody="newPost.body"
          @change="editorChangeEvent"
          @blur="editorBlurEvent"
        ></html-editor>
        <div class="invalid-feedback">{{ errorMessage.body}}</div>
        <!--{{ replaceHtmlTag }}-->
      </div>

      <div class="form-group">
        <label>첨부파일</label>
        <div class="custom-file mb-3">
          <input type="file" class="custom-file-input" id="customFile" @change="onFileChange">
          <label class="custom-file-label" for="customFile"><span>{{ newPost.fileName }}</span></label>
        </div>
      </div>

      <div class="button-group d-flex justify-content-between">
        <router-link :to="link" class="btn btn-secondary">
          리스트로 이동하기
        </router-link>

        <button type="button" class="btn w-25 btn-primary" :disabled="!isActiveSubmit" @click="submitHandler">
          <span v-if="modeNewPost">등록하기</span>
          <span v-else>수정하기</span>
        </button>
      </div>

    </form>
  </div>
</template>
<script>
  const STORAGE_KEY_COMMUNITY_DETAIL = 'community-detail';
  import htmlEditor from "./BoardWebEditor.vue";

  export default {
    name:'boardGeneralWrite',
    data(){
      return{
        link:'/community',
        newPost:{
          title:'',
          body:'',
          author:'jongjin',
          fileName:null,
          filePath:null,
          commentCount:0,
          hit:0,
          id:0,
        },

        errorMessage:{
          title:'',
          body:'',
        },
        errorSubmitValidator:[true,true],
        isActiveSubmit:false,

        localFile:null,
        modeNewPost:true,
        pageTitle:'',
        standByValidateEditor:false,

        modeDev:false,
      }
    },
    created(){
      console.log('created');
      if(this.modeDev) this.writeDummyData(); //Dev모드시 더미 데이터 넣기

      this.fetchData();

      this.$EventBus.$on('change', this.editorChangeEvent)
      this.$EventBus.$on('blur', this.editorBlurEvent)
    },

    mounted(){

    },

    destroyed(){
      this.removeServerModifyData();
    },

    computed:{
      replaceHtmlTag(){
        let str = this.newPost.body;
        str = str.replace(/</g,"&lt;");
        str = str.replace(/>/g,"&gt;");
        str = str.replace(/\"/g,"&quot;");
        str = str.replace(/\'/g,"&#39;");
        str = str.replace(/\n/g,"<br />");
        return str;
      },
    },

    methods:{
      formValidation(){
        console.log('errorSubmitValidator')
        let sCount = this.errorSubmitValidator.filter((arg) =>{
          return arg === true
        });
        if(sCount.length == 0) this.isActiveSubmit = true;
        else this.isActiveSubmit = false;
      },

      editorChangeEvent(value){
        console.log('editorChangeEvent')
        this.newPost.body = value;
        if(this.standByValidateEditor) this.validateBodyContent();
      },

      editorBlurEvent(){
        console.log('editorBlurEvent')
        this.validateBodyContent();
      },

      setPageTitle(){
        if(this.modeNewPost) this.pageTitle ="새글 입력하기";
        else this.pageTitle="글 수정하기";
      },

      validateTitle(){
        const blank_pattern = /^\s+|\s+$/g;
        const thisContent = this.newPost.title.trim();
        if(!blank_pattern.test(thisContent) && thisContent.length < 1) {
          this.errorSubmitValidator[0] = true;
          this.errorMessage.title = '제목을 입력하지 않았습니다.';
        }else{
          this.errorSubmitValidator[0] = false;
          this.errorMessage.title = '';

        }
        this.formValidation();
        if(!this.standByValidateEditor) this.standByValidateEditor = true; //에디터 벨리데이터 실행을 늦추기 위해
      },

      validateBodyContent(){
        console.log('validate BodyContent')
        const blank_pattern = /^\s+|\s+$/g;
        const regExp = /(<(\/)?([a-zA-Z1-6]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>|&nbsp;|\\n)/ig;
        const thisContent = this.newPost.body.replace(regExp, '').replace(blank_pattern,'');
console.log('body ==>', this.newPost.body.trim(),this.newPost.body.length,  thisContent, thisContent.length)
        if(!blank_pattern.test(thisContent) && thisContent.length < 1) {
          this.errorSubmitValidator[1] = true;
          this.errorMessage.body = '본문을 입력하지 않았습니다.';
        }else{
          this.errorSubmitValidator[1] = false;
          this.errorMessage.body = '';
        }
        this.formValidation();
      },

      removeServerModifyData(){
        console.log('글쓰기 컴포넌트를 떠날때')
        sessionStorage.removeItem(STORAGE_KEY_COMMUNITY_DETAIL);
      },

      getServerModifyPostData(){
        const localData = sessionStorage.getItem(STORAGE_KEY_COMMUNITY_DETAIL);
        if(localData !== null){
          this.newPost = JSON.parse(localData);
          this.modeNewPost = false;
          this.validateTitle();
          this.validateBodyContent();
        }else{
          this.getServerLastindex();
        }

        this.setPageTitle();
      },

      getServerLastindex(){
        //서버에 저장된 최종 인덱스 값 얻기
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').get().then((doc)=>{
          console.log('get Last Index to DB', doc.data().lastIndex)
          vm.newPost.id = doc.data().lastIndex;
        });
      },

      updateServerLastIndex(){
        //console.log('updateId', this.newPost.id)
        const vm = this;
        this.$firebaseDB.collection('community').doc('content').update({
          lastIndex: vm.newPost.id,
        });
      },

      fetchData(){
        //수정시에는 서버에서 현재 포스트 얻기, 글쓰기 모드일때는 최종 인덱스값만 얻기
        this.getServerModifyPostData()
        console.log('fetchData')
      },


      onFileChange(e) {
        var file = e.target.files || e.dataTransfer.files;
        if (!file.length) return;
        this.localFile = file[0];
        this.newPost.fileName = file[0].name;
      },

      submitHandler: function () {
        console.log('submitHandler')
        this.uploadServerStorageFile();
      },

      writeToDataBase(){
        console.log('write Item', this.newPost)
        const vm = this;
        this.newPost.title = this.newPost.title.trim();
        this.newPost.body = this.newPost.body.trim();
        if(this.modeNewPost) this.newPost.id += 1;
        if(this.modeNewPost) this.newPost.timeStamp= new Date();
        if(this.modeNewPost) this.newPost.strTimeStamp = this.$firebase.firestore.Timestamp.fromDate(new Date()).seconds * 1;
        this.newPost.modifyTimeStamp= new Date();

        //console.log('writeToDataBase', this.newPost);
        if(this.modeNewPost){
          //console.log('새글 등록')
          this.$firebaseDB.collection('community').doc('content').collection('community-data')
            .doc('community-data-'+this.newPost.id)
            .set(this.newPost)
            .then(function(){
              vm.updateServerLastIndex(); //서버에 인덱스 저장
              if(!vm.modeDev) vm.completedWriteToDataBase();
            });
        }else{
          //console.log('수정 업데이트')
          this.$firebaseDB.collection('community').doc('content').collection('community-data')
            .doc('community-data-'+this.newPost.id)
            .update(this.newPost)
            .then(function(){
              vm.modeNewPost = true;
              vm.completedWriteToDataBase();
            });
        }

      },

      completedWriteToDataBase(){
        console.log(':: Add Content to Server... New Content')
        this.$router.push('/community');
      },

      uploadServerStorageFile(){
        console.log('uploadServerStorageImage!!', this.newPost.fileName);
        var vm = this;

        if(this.localFile !== null) { //이미지가 새로 등록되거나 수정되었다면?
          // Create a root reference
          var storageRef = this.$firebaseStorage.ref();

          var mountainsRef = storageRef.child('file_upload');
          // disk에서 가져오는 이미지를 참조하는 폴더에 정의한다.
          var mountainFilesRef = storageRef.child('file_upload/' + this.newPost.fileName);
          // While the file names are the same, the references point to different files
          mountainsRef.name === mountainFilesRef.name            // true
          mountainsRef.fullPath === mountainFilesRef.fullPath    // false

          console.log('mountainFilesRef', mountainFilesRef)

          mountainFilesRef.put(this.localFile).then(function (snapshot) {
            //console.log(snapshot, 'Uploaded a blob or file!');
            storageRef.child(snapshot.metadata.fullPath).getDownloadURL().then(function (url) {
              vm.newPost.filePath = url;
              vm.writeToDataBase();
            });
          });
        }else{
          vm.writeToDataBase();
        }
      },

      //dummyData를 만들때
      writeDummyData(){
        this.$http.get(`/comments`).then(result => {
          this.gridData = result.data;

          var count=120;
          var vm = this;
          var autoAdd = setInterval(function(){
            vm.newPost.title= result.data[count].name
            vm.newPost.body= result.data[count].body
            vm.getServerLastindex();
            vm.writeToDataBase()

            count++;
            console.log("result", count, vm.newPost.title, vm.newPost.body)
            if(count > 200){
              window.clearInterval(autoAdd);
              count =0;
            }
          },1000)

        });
      },
    },
    components: {
      htmlEditor
    },
  }
</script>
<style lang="scss" scoped>
  .custom-file-label span{
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .invalid-feedback{
    display: block;
  }
</style>
