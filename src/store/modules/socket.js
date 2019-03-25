import Vue from 'vue';
import { USER_DATA } from '../../common/Constant';

const state = {
  isUserLogin:false,
  connectedUserData:'',
  chatUserList:[],
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
  getIsOpenChatRoom($state){
    return $state.chatRoom.isOpenChatRoom;
  },

  getInvitableList: ($state, $payload) => {
    console.log('초대 가능한 멤버 리스트', $state.chatUsers.targetUserInfo.uid, $state.chatUserList)

    return $state.chatUserList.filter(user => user.uid !== $state.chatUsers.targetUserInfo.uid)

  }

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

  chatUserList:($state, $payload)=>{
    $state.chatUsersVsList=$payload;
  },

  getUserList:($state, $payload)=>{
    $state.chatUserList = $payload;
  },







  changeIsOpenChatRoom:($state, $payload)=>{
    $state.chatRoom.isOpenChatRoom = !$state.chatRoom.isOpenChatRoom;
  },

}

//actions
const actions = {
  getUserList:({commit}, $payload) => {
    console.log('currentUser action', Vue.prototype.$firebaseRealDB)
    const currentUser = state.connectedUserData;
    const rootRoomRef = Vue.prototype.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME);
    let userDBRef = rootRoomRef.child('Users/');
    userDBRef.off();

    userDBRef.orderByChild("displayName").once('value').then((dataSnapShot) =>{
      let tmpData=[];
      dataSnapShot.forEach((data) =>{
        if (data.key !== currentUser.uid) {
          let tmp = data.val();
          tmp.uid = data.key;
          tmpData.push(tmp);
        }
      });

      commit('getUserList', tmpData);
    });
  },




  setIsUserLogin:({ commit }, $payload) =>{
    commit('setIsUserLogin');
  },

  // 접속한 유저 정보 저장
  setCurrentUserData:({ commit }, $payload) =>{
    commit('setCurrentUserData', $payload);
  },

  changeIsOpenChatRoom: ({ commit }, $payload) =>{
    commit('changeIsOpenChatRoom');
  },


};



export default{
  state,
  getters,
  actions,
  mutations
}
