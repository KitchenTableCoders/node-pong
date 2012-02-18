var net = require('net');

var server = net.createServer(function(c) {
  console.log("Client "+c.remoteAddress+" connected");
  
  c.setEncoding('ascii');
  c.on("data", function(data) {
    console.log("data:", data);
  });
  c.on("end", function() {
    console.log("Server disconnected");
  });
});

server.listen(5001, function() {
  console.log("Server bound at localhost:5001");
});