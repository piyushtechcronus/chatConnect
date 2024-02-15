// server.js

// Require necessary modules
const express = require('express');
const http = require('http'); 
const path = require('path');
const socketio = require('socket.io');  
// Create Express app
const app = express();
const server = http.createServer(app); 

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Socket.IO and attach it to the server
const io = socketio(server);

// Add event listener for 'connection' event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Event listener for 'sendMessage' event
  socket.on('sendMessage', (data) => {
    // Broadcast the message to all clients
    io.emit('messageReceived', data);
  });

  // Event listener for 'disconnect' event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Define route to handle GET requests to "/chat"
app.get('/chat', (req, res) => {
  // Render the chat page using an EJS template
  res.render('chat'); // Assuming you have a "chat.ejs" template in your views directory
});
 
 
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
