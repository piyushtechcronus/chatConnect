const express = require('express');
const http = require('http'); 
const path = require('path');
const socketio = require('socket.io');  

const app = express();
const server = http.createServer(app); 
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  let username;

  socket.on('sendMessage', (data) => {
    io.emit('messageReceived', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res) => {
  res.render('chat');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
