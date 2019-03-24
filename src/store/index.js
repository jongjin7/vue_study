// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import socket from './modules/socket';
import todos from './modules/todos'; //vuex study
import demo from './modules/demo'; //vuex guide demo

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export const store = new Vuex.Store({
  modules: {
    socket,
    //todos,
    // demo
  },

  // state:{
  //   jData:''
  // },
  //
  // getters:{
  //   someOtherGetter: state => {
  //     console.log('rootSomeOtherGetter: 루트 getters')
  //   }
  // },
  //
  // mutations:{
  //   testMutaion(state, payload){
  //     console.log('변이됨', payload.gap)
  //     state.jData = payload.gap;
  //   },
  //
  //   someMutation(){
  //     console.log('rootSomeMutation: 루트 mutation')
  //   }
  // },
  //
  // actions:{
  //   testAction(context, payload){
  //     context.commit('testMutaion', payload)
  //   },
  //
  //
  //
  //   someOtherAction (ctx, payload) {
  //     console.log('rootSomeOtherAction: 루트 action')
  //   }
  //
  // }

});
