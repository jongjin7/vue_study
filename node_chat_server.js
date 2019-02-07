var app = require('express')(); 
var server = require('http').createServer(app);
var io = require('socket.io')(server,{
  pingTimeout: 1000,
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// localhost:3000서버에 접속하면 클라이언트로 메세지을 전송한다
app.get('/', function(req, res){
  res.sendFile('Hellow Chating App Server');
});

io.on('connection', function(socket){ 
  console.log('a user connected');
  var tmp;
  // 클라이언트로부터의 메시지가 수신되면
  socket.on('chat', function(data){
    console.log('Message from:::', data.name, data.msg, data.photo);
    tmp = data.name;
    var msg = {
      from: {
        name: data.name,
        time: data.time,
        photo: data.photo
      },
      msg: data.msg
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    socket.broadcast.emit('chat', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected: ', tmp);
  });
});

server.listen(8088, function(){ 
  console.log('Http server started with :8088');
});
