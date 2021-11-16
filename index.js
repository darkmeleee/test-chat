const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const  cookieParser = require('cookie-parser');
var connectionsCount = 0;

app.use(cookieParser('secret key'));

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/', (req,res) => {
  res.send("<h1>Sorry</h1> <p>There are nothing to see... \n Maybe you need to get here: localhost:3000/chat");
})

io.on('connection', (socket) => {
  connectionsCount = connectionsCount + 1;
  socket.on('chat message', (msg) => {
      var address = socket.handshake.address;
      io.emit('chat message1', msg, address);
  });
  socket.on('disconnect', () => {
      msg = "User has left the channel."
      io.emit('left message', msg);
      connectionsCount = connectionsCount - 1;
  })
  socket.on('cmd show users', () => {
    msg = "Users now: " + connectionsCount;
    io.emit('left message', msg);
  })
});

app.get('/get-cookie', (req, res) => {
  console.log('Cookie: ', req.cookies)
  res.send('Get Cookie')
})





server.listen(3000, () => {
  console.log('listening on *:3000');
});
