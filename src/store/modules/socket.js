import Constant from '../../common/Constant';

const state = {
  msgDatas:[ ],
};

//getter
const getters = {

};

//actions
const actions = {

};

//mutations
const mutations = {
  [Constant.PUSH_MSG_DATA]:($state, $payload) =>{
    $state.msgDatas.push($payload);
  }
}

export default{
  state,
  getters,
  actions,
  mutations
}
