<template>
  <div class="type_msg">
    <label class="btn_send send_file" for="inp-file" title="파일 보내기">
      <font-awesome-icon icon="cloud-upload-alt"  />
      <i class="blind">파일 보내기</i>
    </label>

    <div class="input_msg_write">
      <input type="file" class="write_msg" id="inp-file" @change="onFileChange">
      <textarea id="message-field" class="write_msg" placeholder="메시지를 입력하세요"  v-model="inputMessageData" @keydown ="keyEventSubmitChatMessage" autocomplete="off"></textarea>
      <div class="blank"></div>
    </div>
    <button class="btn_send send_msg" type="button" @click="submitChatMessage"><font-awesome-icon far icon="comment-alt" /><i class="txt">전송</i></button>
  </div>
</template>

<script>
  import { Utils } from '@/plugins/utils';
  import {timestampToTime, yyyyMMddHHmmsss, timeForRoomList} from '@/plugins/timestamp';
  import {USER_DATA, CHAT_ROOM} from '../../../common/Constant';
  import {mapState, mapMutations, mapActions} from "vuex";

export default {
    name: "MessageInputForm",
    props:[

    ],
    data() {
      return {
        inputMessageData: '',
        isFileAttach:false,
        isOpenUpChatRoom:false,
        typeFileMessage:false,
        messageType : null,
        inviteUserUid:null,
      };
    },
    computed:{
      ...mapState({
        roomId: ({ socket }) => socket.chatRoom.roomId,
        roomList: ({ socket }) => socket.chatRoomList,
        roomMsgData: ({ socket }) => socket.chatRoom.msgDatas,
        currentRoomMessage:({ socket }) => socket.chatRoom.currentRoomMessage,

        roomUsersList: ({ socket }) => socket.chatRoom.roomUsersList,
        roomUsersName: ({ socket }) => socket.chatRoom.roomUsersName,

        currentUser: ({ socket }) => socket.ownerInfo,
        targetUser: ({ socket }) => socket.chatRoom.targetUserInfo,

        openChatRoomInfo: ({ socket }) => socket.chatRoom.openChatRoomInfo
      }),

    },
    created(){
      this.$EventBus.$on('fileChange', this.onDragDropFileChange)
      this.$EventBus.$on('saveMessage', this.typeSendMessage)


    },
    mounted(){
      // html태그를 포함하는 내용 붙여넣기 할때 일반 텍스트로 치환
      document.querySelector('#message-field').addEventListener('paste', this.onPasteAfterClearTag.bind(this));
    },

    methods: {
      ...mapMutations([
        'setCurrentRoomTotalMessage',
        'setRoomId'
      ]),

      onFileChange(e){
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        console.log('onFileChange',e)
        this.typeSendMessage({messageType:'file', message : files[0]});
      },

      onDragDropFileChange(files){
        this.typeSendMessage({messageType:'file', message : files});
      },

      typeSendMessage(parm){
        var vm = this;
        console.log('type', typeof parm, parm.messageType)
        if(parm.messageType !== undefined){
          if(parm.messageType === 'invite'){
            this.inputMessageData = parm.message;
            this.messageType = parm.messageType;
            this.inviteUserUid = parm.inviteUserUid;
            vm.submitChatMessage();
          }else if(parm.messageType === 'file'){
            console.log('파일을 보냈습니다.')
            console.log(parm.message)



            if(parm.message !== null) { //이미지가 새로 등록되거나 수정되었다면?
              // Create a root reference
              var storageRef = this.$firebaseStorage.ref();

              var mountainsRef = storageRef.child('file_upload_chat');
              // 참조하는 스토어 폴더
              var path = yyyyMMddHHmmsss().substr(0, 8) + '/'+ this.roomId + '/' + this.currentUser.uid + '/' + parm.message.name;
              var mountainFilesRef = storageRef.child('file_upload_chat/' + path);
              // While the file names are the same, the references point to different files
              mountainsRef.name === mountainFilesRef.name            // true
              mountainsRef.fullPath === mountainFilesRef.fullPath    // false

              //console.log('mountainFilesRef', mountainFilesRef)

              var uploadTask = mountainFilesRef.put(parm.message);
              uploadTask.on('state_changed', function(snapshot){
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //console.log('Upload is ' + progress + '% done');
                vm.$EventBus.$emit('changeProgressRatio', progress.toFixed(2) + '%');
                if(progress == 100){
                  //setTimeout(function(){ vm.$EventBus.$emit('removeDropzone') }, 1000);
                }
                switch (snapshot.state) {
                  case vm.$firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case vm.$firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function(error) {
                // Handle unsuccessful uploads
                console.log('chat file error code', error.code)
                switch (error.code) {
                  //에러 코드는 api문서를 참조한다.
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                  case 'storage/canceled':
                    // User canceled the upload
                    break;

                  case 'storage/retry-limit-exceeded':
                    alert('작업(업로드, 다운로드, 삭제 등)의 최대 제한 시간이 초과되었습니다. 다시 업로드해 보세요.');
                    break;
                }
              }, function() {
                // Handle successful uploads on complete

                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  console.log('File available at', downloadURL);
                  if(/image\/(png|jpe?g|gif|svg)/.test(parm.message.type)){
                    vm.inputMessageData = '<a href="'+ downloadURL +'"><img src="'+ downloadURL +'"></a>';
                  }else{
                    vm.inputMessageData = '<a href="'+ downloadURL +'">' + parm.message.name + '</a>';
                  }

                  vm.typeFileMessage = true;
                  vm.submitChatMessage();
                });
              });
            }


            // [파일 첨부 프로세스]
            // 파일 첨부 버튼을 누르면, 첨부할 이미지를 선택하고 서버에 이미지를 등록한다.
            // 메시지 리스트창에 파일 업로드 진행상태 레이어를 보여주고
            // 이미지가 서버에 등록되면, 콜백을 받아서 챗팅 메시지 리스트에 등록
            // 내용과 이미지태그를 생성하여 최종적으로 채팅화면을 갱신시켜주도록 한다.
          }
        }else{
          console.log('일반 메시지 상태')
          vm.submitChatMessage();
        }
      },

      keyEventSubmitChatMessage(e){
        if (e.keyCode === 13 && !e.shiftKey) {
          e.preventDefault();
          // dom 도메인 만 추출
          // par 도메인, 파라미터, 경로 전부 추출
          var test = {
            dom : /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi,
            par : /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi
          };

          let reUrl = /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi;

          if(reUrl.test(this.inputMessageData)){
            let matchUrl = this.inputMessageData.match(reUrl);
            matchUrl.forEach((url, index) =>{
              let wrapLink = '<a href="'+ url + '" target="_blank">'+ url +'<\/a>';
              this.inputMessageData = this.inputMessageData.replace(url, wrapLink);
            });
            console.log('match', this.inputMessageData)
          }

          this.submitChatMessage();
        }
      },

      checkCurruntUserRoomList(targetUserUid) {
        let isOpenRoom = false;
        let filterRoomList = this.roomList.filter((obj) => {

          let a = obj.roomOneVSOneTarget === targetUserUid;
          let b = obj.roomType === CHAT_ROOM.TYPE_ONE_VS_ONE;

          //console.log(obj, targetUserUid, a, obj.roomOneVSOneTarget, b)
          if (a === true && b === true) {
            console.log('현재 개설된 챗방 roomId', obj.roomId)
            isOpenRoom = true;
            this.setRoomId(obj.roomId);
          }
          return isOpenRoom;
        })

        console.log('tmp message input', filterRoomList)
        return filterRoomList.length > 0;
      },

      submitChatMessage() {
        console.log('submitChatMessage', this.messageType);
        if (this.inputMessageData.length === 0 ) return false;

        // 메시지를 첫 입력전에 방이 개설되었는지 체크, 방이 존재하면 개설된 roomId를 할당한다.
        let afterTime = 0;
        if (!this.isOpenUpChatRoom) {
          if(this.checkCurruntUserRoomList(this.targetUser.uid)){
            this.isOpenUpChatRoom = true;

            // 채팅룸 활성 상태 저장
            let tmpStorage = {
              roomId: this.roomId,
              targetUser: this.targetUser,
            }
            sessionStorage.setItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM, JSON.stringify(tmpStorage));
            let openRoomInfo = sessionStorage.getItem(CHAT_ROOM.STORAGE_KEY_OPEN_ROOM);
            let roomInfoData = JSON.parse(openRoomInfo);

            //todo 입력된 메시지가 먼저 화면에 뿌려진 후 DB에서 받은 메시지 리스트를 뿌리는 문제... 해결 필요
            this.$EventBus.$emit('updateMessageData', roomInfoData);
            afterTime = 500;
          }
        }

        console.log('방체크후 다음 진행')

        setTimeout(()=>{
          let vm = this;
          let multiUpdates ={};
          //let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME + '/Messages');
          let messageRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).child('Messages');
          let messageRefKey = messageRef.push().key; //message key
          //console.log('messageRefKey', messageRefKey);

          let roomUserList = this.roomUsersList;
          let roomUserListLength = this.roomUsersList.length;  //채팅멤버

          if(this.currentRoomMessage.length === 0 || this.messageType === 'invite'){ //메시지 처음 입력하는 경우, 유저 초대시
            for(var i=0; i < roomUserListLength; i++){
              multiUpdates['RoomUsers/' +this.roomId + '/' + roomUserList[i]] = true;
            }
            //권한때문에 먼저 저장
            this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).update(multiUpdates);
          }

          multiUpdates ={}; // 변수 초기화
          // 테스트 메세지 저장
          multiUpdates['Messages/' + this.roomId + '/' + messageRefKey] = {
            uid: this.currentUser.uid,
            roomId : this.roomId,
            message: this.inputMessageData,
            messageType: this.messageType,
            displayName:this.currentUser.displayName,
            photoURL:this.currentUser.photoURL,
            timeStamp: this.$firebase.database.ServerValue.TIMESTAMP,

          }

          //유저별 룸리스트 저장
          if(roomUserList && roomUserListLength > 0){
            for(var i = 0; i < roomUserListLength ; i++){
              multiUpdates['UserRooms/' + this.roomUsersList[i] + '/' + this.roomId ] = {
                roomId : this.roomId,
                roomUserName : this.roomUsersName.join(CHAT_ROOM.SPLIT_CHAR),
                roomUserList : this.roomUsersList.join(CHAT_ROOM.SPLIT_CHAR),
                roomType : roomUserListLength > 2 ? CHAT_ROOM.TYPE_MULTI : CHAT_ROOM.TYPE_ONE_VS_ONE,
                roomOneVSOneTarget : roomUserListLength === 2 && i === 0 ? roomUserList[1] :  // 1대 1 대화이고 i 값이 0 이면
                  roomUserListLength === 2 && i === 1 ? roomUserList[0]   // 1대 1 대화 이고 i값이 1이면
                    : '', // 나머지
                lastMessage : this.typeFileMessage ? '파일을 보냈습니다.' : this.inputMessageData,
                // todo 이름과 사진은 대화 상대 이미지로 고정 필요
                displayName: this.currentUser.displayName,
                photoURL : this.currentUser.photoURL,
                timestamp: this.$firebase.database.ServerValue.TIMESTAMP,
                messageType: this.messageType === undefined ? null : this.messageType,
                inviteUserUid: this.inviteUserUid === undefined ? null : this.inviteUserUid,
              };
            }
          }
          console.log('multiUpdates', this.roomId+'::::', multiUpdates)
          this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME).update(multiUpdates);
          this.inputMessageData = '';
          this.typeFileMessage = false;
          this.messageType = null;
          this.inviteUserUid = null;

          if(!this.isOpenUpChatRoom) this.isOpenUpChatRoom = true; //방 개설할때 사용하는 플래그
        }, afterTime);
      },

      onPasteAfterClearTag : function(e){
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }
    },
  }
</script>

<style scoped>

</style>
