import Constant from '../../common/Constant';

const state = {
  isUserLogin:false,
  connectedUserData:'',
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
  chatUsersVsList:'',
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

};

//mutations
const mutations = {
  setIsUserLogin:($state, $payload)=>{
    $state.isUserLogin = !$state.isUserLogin;
  },

  setCurrentUserData:($state, $payload)=>{
    $state.connectedUserData = $payload;
  },

  setRoomId :($state, $payload)=>{
    $state.chatRoom.roomId = $payload;
  },

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

  updateMessageDatas:($state, $payload)=>{
    if($payload !== null){
      $state.chatRoom.msgDatas.push($payload);
    }else{
      $state.chatRoom.msgDatas = [];
    }
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

  chatUserList:($state, $payload)=>{
    $state.chatUsersVsList=$payload;
  },
  removeChatUserList:($state, $payload)=>{
    $state.chatUsersVsList='';
  }
}

//actions
const actions = {
  setIsUserLogin:({ commit }, $payload) =>{
    commit('setIsUserLogin');
  },

  // 접속한 유저 정보 저장
  setCurrentUserData:({ commit }, $payload) =>{
    commit('setCurrentUserData', $payload);
  },

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

  chatUserList:({commit}, $payload) =>{
    commit('chatUserList', $payload)
  },
  removeChatUserList:({commit}, $payload) =>{
    commit('chatUserList')
  }

};



export default{
  state,
  getters,
  actions,
  mutations
}
