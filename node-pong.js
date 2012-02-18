var net = require('net');

var server = net.createServer(function(c) {
  console.log("Server connected");
  c.setEncoding('ascii');
  c.on("data", function(data) {
  	//data.setEncoding('utf8');
    console.log("data:", data);
  });
  c.on("end", function() {
    console.log("Server disconnected");
  });
});

server.listen(5001, function() {
  console.log("Server bound");
});