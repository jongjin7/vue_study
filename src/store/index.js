// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loginTokken:'',
    pop_title:'타이틀',
    pop_content : '',
    popGalleryContent:null,
    latestGalleryItemIndex:'',
    communityTotalList:'',
  },
});
