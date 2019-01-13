<template>
  <div>

    <div>{{ count  }} {{ myMessage }}{{ windowVal }}</div>
    <input type="text" id="sendMsg" value="1111212122">
    <button @click="clickButton">socket button</button>
    <p>내용 출력: {{ socketMessage }}</p>
  </div>
</template>
<script>
  import { mapState } from 'vuex';


  export default{
    name:'vuex',
    data(){
      return{
        windowVal:window.globalVal,
        socketMessage:'',
      }
    },
    computed: mapState({
      // 화살표 함수는 코드를 매우 간결하게 만들어 줍니다!
      count: state => state.count,

      // 문자열 값 'count'를 전달하는 것은 `state => state.count`와 같습니다.
      countAlias: ['count','myMessage'],

      // `this`를 사용하여 로컬 상태에 액세스하려면 일반적인 함수를 사용해야합니다
      countPlusLocalState (state) {
        return state.count + this.localCount
      },

      myMessage: state => state.myMessage,
    }),
    created(){
      var vm = this;
      this.$store.commit({
        type:'increment',
        amount:100
      })

      this.$store.commit('SOME_MUTATION', '1111');



    },
    mounted(){
      this.sockets.subscribe('chat message', (data) => {
        this.socketMessage = data;
      });
    },
    methods:{
      clickButton: function () {

        this.$socket.emit('chat message', $('#sendMsg').val());
      },
      fetchData(){
        console.log('fetchData')

      }
    },

  }
</script>
