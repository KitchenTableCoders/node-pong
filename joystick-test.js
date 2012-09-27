var net = require('net');

var joystickServer = net.createServer(function(socket) {
  console.log("Joystick connected");
  socket.setEncoding("ascii");
  
  socket.on("data", function(data) {
    console.log(data);
  });
  socket.on("end", function() {
    console.log("Joystick disconnected");
  });
});

joystickServer.listen(5001, function() {
  console.log("Joystick server bound on port 5001");
});