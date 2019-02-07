import Vue from 'vue';
import io from 'socket.io-client';

const socket = io('http://192.168.0.3:8088');

const SocketPlugin ={
  install(vue){
    vue.mixin({

    });

    vue.prototype.$sendMessage = ( $payload) =>{
      console.log('$sendMessage', $payload)
      socket.emit('chat',{
        msg: $payload.msg,
        name: $payload.name,
        photo: $payload.photo,
        date: $payload.date,
        time: $payload.time
      });
    }

    // 인스턴스 매소드 추가
    vue.prototype.$socket = socket;
  }
}

Vue.use(SocketPlugin);

