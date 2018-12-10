<template>
  <form class="">
    <div class="form-group">
      <label for="inp-pop-title">제목</label>
      <input type="text" class="form-control" id="inp-pop-title" autofocus autocomplete="off" placeholder="제목을 입력하세요" required v-model="newGalleryListItem.title">
    </div>
    <div class="form-group">
      <label for="inp-pop-cont">본문내용</label>
      <textarea class="form-control" id="inp-pop-cont"  rows="3" autocomplete="off" v-model="newGalleryListItem.body"></textarea>
    </div>

    <div class="form-group">
      <label>등록 이미지</label>
      <div v-if="!newGalleryListItem.imagePath">
        <div class="custom-file mb-3">
          <input type="file" class="custom-file-input" id="customFile" name="filename" @change="onFileChange">
          <label class="custom-file-label" for="customFile">이미지...</label>
        </div>
      </div>

      <div class="img-holder" v-else>
        <img :src="newGalleryListItem.imagePath" width="100%" />
        <button @click="removeImage"><span>이미지 다시 선택</span></button>
      </div>
    </div>
    <button type="button" class="btn btn-primary w-100" @click="addContent(); $EventBus.$emit('close');">
      <span v-if="newInsertMode">등록하기</span>
      <span v-else>수정하기</span>
    </button>
  </form>
</template>
<script>
  export default {
    name:'boardPhotoEditor',
    data(){
      return{
        newGalleryListItem:{
          title:'',
          body:'',
          imagePath:'',
          id:0,
        },
        localImage:'',
        newInsertMode:true,
      }
    },
    created(){
      if(this.$store.state.popGalleryContent !== undefined ){
        this.newGalleryListItem = this.$store.state.popGalleryContent;
        this.newInsertMode = false;
      }
      console.log('created', this.$store.state.latestGalleryListIndex , this.newGalleryListItem.id);
    },
    methods:{
      updateServerLastIndex(){
        const vmThis = this;
        this.$firebaseDB.collection('photo-gallery').doc('content').update({
          lastIndex: vmThis.$store.state.latestGalleryListIndex
        });
      },

      addContent: function () {
        const vmThis = this;
        console.log('newContent', this.newGalleryListItem)
        this.uploadServerStorageImage();
      },

      insertToDBstorage(){
        console.log('insertToDBstorage');
        const vmThis = this;
        this.newGalleryListItem.title = this.newGalleryListItem.title && this.newGalleryListItem.title.trim()
        this.newGalleryListItem.body = this.newGalleryListItem.body && this.newGalleryListItem.body.trim();
        this.newGalleryListItem.id = (this.newGalleryListItem.id == 0)? ++this.$store.state.latestGalleryListIndex : this.newGalleryListItem.id;

        this.$firebaseDB.collection('photo-gallery').doc('content').collection('gallery-data')
          .doc('galley-data-'+this.newGalleryListItem.id).set(this.newGalleryListItem).then(function(){
            vmThis.updateServerLastIndex(); //서버에 인덱스 저장

            //폼 밸리데이션 조건적기
            vmThis.newGalleryListItem =[];
            vmThis.localImage ='';
            vmThis.$store.state.popGalleryContent = '';
            vmThis.newInsertMode = true;
            console.log(':: Add Content to Server... New Content')
        })
      },

      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.createImage(files[0]);

      },
      createImage(file) {
        this.localImage = file;
        var reader = new FileReader();
        console.log('createImage')
        reader.onload = (e) => {
          this.newGalleryListItem.imagePath = e.target.result;

          console.log('read', this.localImage)
        };
        reader.readAsDataURL(file);

      },
      removeImage(e) {
        this.newGalleryListItem.imagePath = '';
      },
      uploadServerStorageImage(){
        console.log('uploadServerStorageImage!!', this.localImage);
        // Create a root reference
        var storageRef = this.$firebaseStorage.ref();

        var mountainsRef = storageRef.child('gallery_upload');
        // disk에서 가져오는 이미지를 참조하는 폴더에 정의한다.
        var mountainImagesRef = storageRef.child('gallery_upload/'+ this.localImage.name);
        // While the file names are the same, the references point to different files
        mountainsRef.name === mountainImagesRef.name            // true
        mountainsRef.fullPath === mountainImagesRef.fullPath    // false

        var that = this;
        mountainImagesRef.put(this.localImage).then(function(snapshot) {
          //console.log(snapshot, 'Uploaded a blob or file!');
          storageRef.child(snapshot.metadata.fullPath).getDownloadURL().then(function(url){
            that.newGalleryListItem.imagePath = url;
            that.insertToDBstorage();
          });
        });
      },
    },
  }
</script>
<style lang="scss">
  .img-holder{
    position: relative;

    button{
      position: absolute;left:0; top:0;
      width:100%; height:100%;
      background: transparent;
      border:none;

      span{
        position: absolute; left:0; bottom:0;
        width:100%;
        padding:10px;
        background: rgba(white,0.5);
        font-size: 18px;
      }
      &:hover{
        span{
          background: rgba(white,0.8);
        }
      }
    }
  }

  .custom-file-label:after{
     content:'파일찾기'
  }
</style>
