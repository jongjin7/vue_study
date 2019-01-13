var app = require('express')(); 
var http = require('http').Server(app); 
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){ 
  console.log('a user connected');
  socket.on('disconnect', function(){ 
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){ 
    console.log('msg: ' + msg);
    io.emit('chat message', msg); //모든 접속 사용자에게 전송함.
  });
});

http.listen(8188, function(){ 
  console.log('Http server started with :8188');
});
