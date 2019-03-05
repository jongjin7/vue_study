import Constant from '../../common/Constant';

const state = {
  msgDatas:[],
  chatTargetUserName: null,
  chatRoomId: null,

  chatRoom:{
    msgDatas:[
      // {
      //   message: '입력 메시지',
      //   userName:'사용자명',
      //   profileImg:'프로필 사진',
      //   timeStamp: 'new Date()'
      // }
    ],
    roomId:'',
    isOpenChatRoom:false,
    roomUsersList:'',
    roomUsersName:'',
  },
  chatUsers:{
    currentUserInfo:[], //name, uid
    targetUserInfo:[],
  },
};

//getter
const getters = {

  getChatTargetUser($state){
    return $state.chatTargetUserName;
  },
  getChatRoomId($state){
    return $state.chatRoom.roomId;
  },

  getIsOpenChatRoom($state){
    return $state.chatRoom.isOpenChatRoom;
  },

  getMessageData($state){
    return $state.chatRoom.msgDatas
  }
};

//mutations
const mutations = {
  roomUsersList:($state, $payload)=>{
    $state.chatRoom.roomUsersList = $payload;
  },
  roomUsersName:($state, $payload)=>{
    $state.chatRoom.roomUsersName = $payload;
  },

  currentUserInfo:($state, $payload) => {
    $state.chatUsers.currentUserInfo = $payload;
  },
  targetUserInfo:($state, $payload) => {
    $state.chatUsers.targetUserInfo = $payload;
  },



  currentTargetUserName:($state, $payload) =>{
    $state.chatTargetUserName = $payload;
  },
  currentChatRoomId:($state, $payload) =>{
    $state.chatRoom.roomId = $payload;
  },

  changeIsOpenChatRoom:($state, $payload)=>{
    $state.chatRoom.isOpenChatRoom = !$state.chatRoom.isOpenChatRoom;
  },

  sendChatMessage:($state, $payload)=>{
    $state.chatRoom.msgDatas.push($payload);
  },

  getMessageList:($state, $payload)=>{
    $state.chatRoom.msgDatas.push($payload);
  },

  removeMessageList:($state, $payload)=>{
    $state.chatRoom.msgDatas = [];
  }
}

//actions
const actions = {
  roomUsersList:({ commit } ,$payload)=>{
    commit('roomUsersList', $payload)
  },
  roomUsersName:({ commit } ,$payload)=>{
    commit('roomUsersName', $payload)
  },

  saveTargetUserName: ({ commit }, $payload) => {
    commit('currentTargetUserName', $payload)
  },
  saveChatRoomId: ({ commit }, $payload) => {
    commit('currentChatRoomId', $payload)
  },

  changeIsOpenChatRoom: ({ commit }, $payload) =>{
    commit('changeIsOpenChatRoom');
  },

  sendChatMessage:({ commit }, $payload) => {
    commit('sendChatMessage', $payload)
  },

  targetUserInfo:({ commit }, $payload) => {
    commit('targetUserInfo', $payload)
  },

  getMessageList:({ commit }, $payload) =>{
    commit('getMessageList', $payload)
  },
  removeMessageList:({ commit }, $payload) =>{
    commit('removeMessageList')
  },

};



export default{
  state,
  getters,
  actions,
  mutations
}
