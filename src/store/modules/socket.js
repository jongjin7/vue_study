import Vue from 'vue';
import { USER_DATA, CHAT_ROOM } from '../../common/Constant';

const state = {
  isUserLogin:false,
  ownerInfo:'',
  chatUserList:[],
  chatRoomList:[],
  usrsOnline:'',
  chatRoom:{
    msgDatas:[],
    currentRoomMessage:[],
    roomId:'',
    roomUsersList:'',
    roomUsersName:'',
    invitableList:[],
    targetUserInfo:[],
    openChatRoomInfo:'',
  },
};

//getter
const getters = {
  getInvitableList: ($state, $payload) => {
    console.log('초대 가능한 멤버 리스트', $state.chatRoom.targetUserInfo, $state.chatUserList, $state.chatUsers)

    let filterMember =  $state.chatUserList.filter((user) => {
      let isMember = $state.chatRoom.roomUsersList.includes(user.uid)
      console.log('find', isMember)
      return !$state.chatRoom.roomUsersList.includes(user.uid);
    });
    return filterMember;
  },
};

//mutations
const mutations = {
  inviteUserNewMember: ($state, $payload)=>{
     let tmp = getters.getInvitableList($state);
    // console.log('checked list111', tmp.filter(user => user.checked))
    let newMember = getters.getInvitableList($state).filter(user => user.checked);
    let newMemberListUid = newMember.map(mem => mem.uid);
    let prevMember = $state.chatRoom.newMember;
    console.log('join', newMember,newMemberListUid, prevMember)
    $state.chatRoom.invitableList = getters.getInvitableList($state).filter(user => user.checked);
  },

  afterInviteUsers:($state, $payload)=>{
    $state.chatRoom.invitableList = getters.getInvitableList($state).forEach((user)=>{
      if(user.checked) user.checked = false;
    })
  },

  setIsUserLogin:($state, $payload)=>{
    $state.isUserLogin = !$state.isUserLogin;
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

  setCurrentUserData:($state, $payload)=>{
    $state.ownerInfo = $payload;
  },
  targetUserInfo:($state, $payload) => {
    if($payload !== null){
      $state.chatRoom.targetUserInfo = $payload;
    }else{
      $state.chatRoom.targetUserInfo = [];
    }
  },

  updateMessageDatas:($state, $payload)=>{
    if($payload !== null){
      $state.chatRoom.msgDatas.push($payload);
    }else{
      $state.chatRoom.msgDatas = [];
    }
  },

  chatUserList:($state, $payload)=>{
    $state.chatUserList=$payload;
  },

  getUserList:($state, $payload)=>{
    $state.chatUserList = $payload;
  },

  chatRoomList:($state, $payload)=>{
    $state.chatRoomList = $payload;
  },

  openChatRoomInfo:($state, $payload)=>{
    $state.chatRoom.openChatRoomInfo = $payload;
  },

  setCurrentRoomTotalMessage:($state, $payload)=>{
    if($payload === null){
      $state.chatRoom.currentRoomMessage = [];
    }else{
      $state.chatRoom.currentRoomMessage.push($payload);
    }
  },


}

//actions
const actions = {
  getUserList:({commit}, $payload) => {
    console.log('currentUser action', Vue.prototype.$firebaseRealDB)
    const currentUser = state.ownerInfo;
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



};



export default{
  state,
  getters,
  actions,
  mutations
}
