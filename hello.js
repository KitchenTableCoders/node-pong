var net = require('net');

var server = net.createServer(function(connection) {
  console.log("Client connection created");
  connection.setEncoding('ascii');
  connection.on("data", function(data) {
    console.log(data);
    if(data.match("GET")) {
        connection.write("<div>Hello world!</div>");
    }
  });
  connection.on("end", function() {
    console.log("Client connection disconnected");
  });
});

server.listen(5001, function() {
  console.log("Server listening on localhost port 5001");
});