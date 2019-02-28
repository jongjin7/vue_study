import Constant from '../../common/Constant';

const state = {
  msgDatas:[],
  chatTargetUserName: null,
  chatRoomId: null,
};

//getter
const getters = {
  getChatTargetUser($state){
    return $state.chatTargetUserName;
  },
  getChatRoomId($state){
    return $state.chatRoomId;
  }
};

//mutations
const mutations = {
  currentTargetUserName:($state, $payload) =>{
    $state.chatTargetUserName = $payload;
  },
  currentChatRoomId:($state, $payload) =>{
    $state.chatRoomId = $payload;
  }
}

//actions
const actions = {
  saveTargetUserName: ({ commit }, $payload) => {
    commit('currentTargetUserName', $payload)
  },
  saveChatRoomId: ({ commit }, $payload) => {
    commit('currentChatRoomId', $payload)
  },
};



export default{
  state,
  getters,
  actions,
  mutations
}
