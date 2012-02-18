var static = require('node-static');
var io = require('socket.io').listen(8181);
var fileServer = new(static.Server)('.');
var path = require('path');
var url = require('url');
var fs = require('fs');
var net = require('net');

// Server for the controller

var thumbstick;

var server = net.createServer(function(socket) {
  console.log("Client connected");
  thumbstick = socket;
  socket.setEncoding("ascii");
  var buffer = "";
  socket.on("data", function(data) {
    buffer += data;
    var parts = buffer.split("\n");
    if(parts.length > 1) {
      buffer = parts[1]; // subtle bug
      values = parts[0].split("\t");
      if(values[0] < 450) {
        io.sockets.emit("playera", {velocity:-10});
      } if(values [0] > 550) {
        io.sockets.emit("playera", {velocity:10});
      }
    }
  });
  socket.on("end", function() {
    console.log("client disconnected");
  });
});

server.listen(5001, function() {
  console.log("Controller server bound");
});

// Server for WebSockets
io.sockets.on('connection', function (websocket) {
  websocket.emit('init', function() {});
  websocket.on('move', function(loc) {
  });
  websocket.on('playera-win', function() {
    console.log("PLAYER A WIN!");
    if(thumbstick) {
      console.log("writing out win");
      thumbstick.write("win\n");
    }
  });
  websocket.on('playera-loss', function() {
    console.log("PLAYER A LOSS!");
    if(thumbstick) {
      console.log("writing out loss")
      thumbstick.write("lose\n");
    }
  });
  websocket.on('disconnect', function() {
    console.log("disconnected");
  });
});

function handleRequest(req, res){
 var pathname = url.parse(req.url).pathname,
     components = pathname.split('/');
     
 if(components[1] == 'public') {
   fileServer.serve(req, res);
 } else if(pathname == '/') {
   fileServer.serveFile('/index.html', 200, {'Content-Type':'text/html'}, req, res);
 } else {
   res.writeHead(404, {'Content-Type': 'text/plain'});
   res.end('Page Not Found');
 }
}

var http = require('http');
http.createServer(handleRequest).listen(8080, "localhost");
console.log('Server running at 8080');