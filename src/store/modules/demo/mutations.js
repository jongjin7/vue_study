export default{
  root_module_mutations(state, payload){
    console.log('root 모듈', payload)
    state.rootModuleData = payload.gap;
  }
}
