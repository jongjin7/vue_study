import state from "./state";
import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,

  //1차중첩
  modules:{
    // 부모 모듈로부터 네임스페이스를 상속받음
    noneNamespaceModuleDepth1: {
      state: {
        depth1ModuleData:''
      },
      getters: {

      },
      mutations:{
        depth1_mutations(state, payload){
          console.log('1뎁스 모듈', payload)
          state.depth1ModuleData = payload.gap;
        }
      },
      actions:{
        depth1_action(context, payload){
          context.commit('depth1_mutations', payload)
        }
      }
    },

    hasNamespaceModuleDepth1:{
      namespaced: true,

      state:{
        depth1ModuleData:''
      },

      mutations:{
        depth1_mutations(state, payload){
          console.log('namespace-module-depth1', payload)
          state.depth1ModuleData = payload.gap;
        },

        someMutation(){
          console.log('someMutation: 모듈내 mutation')
        }
      },

      getters: {
        // `getters`는 해당 모듈의 지역화된 getters
        // getters의 4번째 인자를 통해서 rootGetters 사용 가능
        someGetter (state, getters, rootState, rootGetters) {
          getters.someOtherGetter
          rootGetters.someOtherGetter
        },
        someOtherGetter: state => {
          console.log('someOtherGetter: 모듈내 getters')
        }
      },

      actions:{
        depth1_action(context, payload){
          context.commit('depth1_mutations', payload)
        },

        // 네임스페이스 모듈에서 전역 액션 등록 (root ==> namespace module)
        localSomeAction: {
          root: true,
          handler (namespacedContext, payload) {
            console.log('local someAction!!!!----')
          }
        },


        // 디스패치와 커밋도 해당 모듈의 지역화된 것
        // 전역 디스패치/커밋을 위한 `root` 옵션 설정 가능
        someAction ({ dispatch, commit, getters, rootGetters }) {
          getters.someGetter // -> 'hasNamespaceModuleDepth1/someGetter'
          rootGetters.someGetter // -> 'someGetter'

          dispatch('someOtherAction') // -> 'hasNamespaceModuleDepth1/someOtherAction'
          dispatch('someOtherAction', null, { root: true }) // -> 'root에 있는 rootSomeOtherAction'

          commit('someMutation') // -> 'hasNamespaceModuleDepth1/someMutation'
          commit('someMutation', null, { root: true }) // -> 'someMutation'
        },

        someOtherAction (ctx, payload) {
          console.log('someOtherAction: 모듈내 action')
        }
      },


    }
  }
};
