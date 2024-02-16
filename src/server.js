const express = require('express');
const http = require('http'); 
const path = require('path');
const socketio = require('socket.io');   
const serverStartTime = new Date();
const app = express();
const server = http.createServer(app); 
const io = socketio(server);
//test commit
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    let username;

    socket.on('sendMessage', (data) => {
        console.log('activity: ',data);
        io.emit('messageReceived', data);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('userTyping', username);
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('userStoppedTyping');
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
    const message = `The server is running on port localhost:${PORT}`;
    const level = 'info';
    const timestamp = formatTimestamp(serverStartTime);
  
    const logData = {
        message,
        level,
        timestamp
    };

    console.log(JSON.stringify(logData, null, 2));
});

// Function to format the timestamp to YYYY-MM-DD HH:MM:SS format
function formatTimestamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
