// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  // counter 라는 state 속성을 추가
  state: {
    loginTokken:'',
    pop_title:'타이틀',
    pop_content : '',
    popGalleryContent:null,
    latestGalleryListIndex:'',
    statusShowModalPopup:false,
  },
});
