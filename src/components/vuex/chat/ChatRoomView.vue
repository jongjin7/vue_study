<template>
  <div id="file-dropzone" class="view-container" :class="{ 'after-drop': isDropzone, 'is-dragover': isDragover }">
    <div class="bg-view-title py-2 text-center">
      <strong>{{ targetUserNames }}</strong>님과 채팅중입니다.
      <a href="#" @click.stop.prevent="showModalpopup('대화상대 초대하기', 'chatInvite'); $EventBus.$emit('showModal');">초대</a>
    </div>
    <div class="msg_history" v-auto-bottom="msgDatas">

      <div :class="{'incoming_msg':(msg.uid !== currentUser.uid ), 'outgoing_msg':(msg.uid === currentUser.uid )}"
           v-for="(msg, index) in msgDatas">
        <div class="hr-date small" v-if="msg.strNewDay !== null"><span>{{ msg.strNewDay }}</span></div>

        <div class="incoming_msg_img" v-if="msg.uid !== currentUser.uid">
          <span :style="'background-image: url(' + msg.photoURL + ');'" class="pic rounded-circle"></span>
          {{ msg.displayName }}
        </div>
        <div class="received_msg" v-if="msg.uid !== currentUser.uid">
          <div class="received_withd_msg msg_box">
            <p v-html="msg.message.replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
            <span class="time_date">{{ msg.timeStamp }}</span>
          </div>
        </div>
        <div class="sent_msg msg_box" v-else>
          <p v-html="msg.message.replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
          <span class="time_date">{{ msg.timeStamp }}</span>
        </div>

      </div>
    </div>

    <!-- 박스 드래그인드롭 파일 인풋 -->
    <div class="dragdrop-input">
      <div class="inner-wrap">
        <div class="result-msg text-center">
          <h1 class="title">
            <span>Drag&Drop</span>
          </h1>
          <div class="file-upload-droparea">
            <div class="before-info">
              <span class="icon"><font-awesome-icon icon="cloud-upload-alt"/></span>
              <span>여기에 파일을 끌어다 놓으세요!</span>
            </div>
            <!-- 파일을 선택한다면? -->
            <div class="after-info">
              <h3 class="txt h5 is-file">다중 파일 전송중...</h3>
              <div class="file-list" v-for="list in fileList">
                <p class="file-name">{{ list }}</p>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" :style="'width:' + progress[1] + ''">{{ progress[1] }}</div>
                </div>
                <div class="btns pt-1">
                  <button type="button" class="btn btn-sm">일시중지 토글</button>
                  <button type="button" class="btn btn-sm btn-warning">취소</button>
                </div>
              </div>


              <!-- 메시지 출력 -->
              <div class="info-msg pb-1 mt-3 small invalid-feedback">
                <font-awesome-icon icon="exclamation"  />
                <span>진행상태 메시지나 에러메시지를 출력한다.</span>
              </div>
            </div>
          </div>

          <button class="btn-mini" title="파일 등록창 숨기기">
            <font-awesome-icon far icon="eye-slash" size="lg"/>
            <span class="blind">파일 등록창 최소화</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Utils } from '@/plugins/utils';
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: "ChatRoomView",
    props: [
      'targetUserNames',
      'msgDatas',
      'progress',
    ],
    data() {
      return {
        isDropzone: false,
        isDragover: false,
        fileList:[],
      }
    },

    computed: {
      ...mapState({
        roomId: ({socket}) => socket.chatRoom.roomId,
        currentUser: ({socket}) => socket.ownerInfo,
        targetUser: ({socket}) => socket.chatRoom.targetUserInfo,
      }),

      replaceBr(msg){
        console.log('msg', msg)
        //return msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
      }
    },
    created() {
      this.$EventBus.$on('removeDropzone', this.removeDropzone)

    },
    mounted() {
      let dropzone = $('#file-dropzone');
      var vm = this;

      dropzone.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function (e) {
        vm.isDragover = true;
      })
      .on('dragleave dragend drop', function () {
        vm.isDragover = false;
      })
      .on('drop', function (e) {
        console.log('drop...', vm.isDragover, vm.isDropzone)
        if(!vm.isDropzone){
          vm.isDropzone = true;
          vm.isDragover = true;
          let droppedFiles = e.originalEvent.dataTransfer.files;
          console.log('droppedFiles', droppedFiles)
          for(var i=0; i < droppedFiles.length; i++){
            console.log(droppedFiles[i].name + " - " + droppedFiles[i].size);
            vm.fileList.push(droppedFiles[i].name);
            vm.$EventBus.$emit('fileChange', droppedFiles[i]); //파일 전송 트리거
          }
          console.log('vmList', vm.fileList)
          //vm.$EventBus.$emit('fileChange', droppedFiles)
        }else{
          console.log('파일전송중입니다.')
        }
      });

    },
    methods: {
      showModalpopup(title, componentName, post) {
        window.globalVars.pop_title = title;
        window.globalVars.pop_content = componentName;

        this.$EventBus.$emit('toggleClose');
      },
      removeDropzone(){
        console.log('removeDropzone')
        this.isDragover = false;
        this.isDropzone = false;
      }
    }

  }
</script>

<style lang="scss" scoped>
  .hr-date {
    position: relative;
    padding: 1rem 0;
    text-align: center;

    &:before {
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      border-top: 1px solid #eee;
      width: 100%;
      content: '';
    }

    span {
      position: relative;
      background: #fff;
      padding: 0 1rem;
    }
  }

</style>
