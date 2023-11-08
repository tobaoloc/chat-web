
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/client.js', (req, res) => {
    res.sendFile(__dirname + '/client/client.js');
});


server.listen(3000, () => {
    console.log('Server is listening on port http://localhost:3000');
});

let users = {};
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (data) => {
        // Join a specific room
        socket.join(data.room);
        // Store the user's nickname in the users object
        users[socket.id] = { nickname: data.nickname, room: data.room };
        io.to(data.room).emit('chat_message', { nickname: 'Admin', message: users[socket.id].nickname+' joined the room!' });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        if(users[socket.id])
            io.to(users[socket.id].room).emit('chat_message', { nickname: 'Admin', message: users[socket.id].nickname+' has left the room!' });
        delete users[socket.id];
    });

    socket.on('chat_message', (data) => {
        // Broadcast the message to everyone in the same room
        io.to(data.room).emit('chat_message', { nickname: data.nickname, message: data.message });
    });
});
