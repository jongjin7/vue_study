// store.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import { SOME_MUTATION } from '../mutations/mutaion-types';

export const store = new Vuex.Store({
  state: {
    loginTokken:'',
    pop_title:'타이틀',
    pop_content : '',
    popGalleryContent:null,
    latestGalleryItemIndex:'',
    communityTotalList:'',

    count: 0,
    myMessage:'',
  },
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    },
    discrement(state){
      state.count--
    },
    [SOME_MUTATION] (state, value) {
      // 변이 상태
      state.myMessage ='상수를 함수 이름으로 사용'+ value;
    }
  }

});
