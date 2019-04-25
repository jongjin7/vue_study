var http = require('http'),
  https = require('https'),
  fs = require('fs');
  express = require('express');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var port1 = 80;
var port2 = 443;

var port = port2;

var app = express();
app.use(express.urlencoded());
app.use('/static/js', express.static(__dirname +'/dist/static/js'));
app.use('/static/css', express.static(__dirname +'/dist/static/css'));

http.createServer(app).listen(port1, function(){
  console.log("Http server listening on port " + port1);
});

https.createServer(options, app).listen(port2, function(){
  console.log("Https server listening on port " + port2);
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type' : 'text/html'});

  fs.readFile(__dirname + '/dist/index.html', (err, data) => { // 파일 읽는 메소드
    if (err) {
      return console.error(err); // 에러 발생시 에러 기록하고 종료
    }
    res.end(data, 'utf-8'); // 브라우저로 전송
  });
});
