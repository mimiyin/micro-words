// Load http module
let http = require("http");
let PORT = process.env.PORT || 8002;

// Load express module
let express = require("express");
let app = express();

// Create server
// Hook it up to listen to the correct PORT
let server = http.createServer(app).listen(PORT, function(){
  console.log('Listening on port: ', PORT);
});

// Point my app at the public folder to serve up the index.html file
app.use(express.static("public"));

// Create an io object to manage sockets
let io = require("socket.io")(server);
let as = io.of('/a');
let bs = io.of('/b');

// Do this when there's a connection
as.on("connection", function(socket) {
  console.log("We have a new 'a' client: ", socket.id);
    
  // Listen for next
  socket.on('next', ()=>{
    console.log('next!');
    bs.emit('next');
  });

  // Listen for cue
  socket.on('cue', ()=>{
    console.log('cue!');
    bs.emit('cue');
  });
  
  // Listen for this client to disconnect
    socket.on("disconnect", function () {
      console.log("An 'a' socket disconnected: ", socket.id);
    });
});

// Do this when there's a connection
bs.on("connection", function(socket) {
  console.log("We have a new 'b' client: ", socket.id);
      
  
  // Listen for this client to disconnect
    socket.on("disconnect", function () {
      console.log("A 'b' socket disconnected: ", socket.id);
    });
});

