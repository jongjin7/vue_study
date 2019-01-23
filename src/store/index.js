// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import socket from './modules/socket';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export const store = new Vuex.Store({
  modules: {
    socket,
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : [],
  state: {
    loginTokken:'',
    pop_title:'타이틀',
    pop_content : '',
    popGalleryContent:null,
    latestGalleryItemIndex:'',
    communityTotalList:'',

    count: 0,
    myMessage:'',
  }
});
