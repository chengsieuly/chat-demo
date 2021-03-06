var path = require('path');
var ip = require('ip');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = PORT || 3000;

server.listen(port, ip.address(), () => {
    console.log('Server listening at http://%s:%d', ip.address(), port);
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    var addedUser = false;

    socket.on('new message', (data) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('add user', (username) => {
        if (addedUser) return;

        socket.username = username;
        addedUser = true;
        socket.emit('login');

        socket.broadcast.emit('user joined', {
            username: socket.username,
        });
    });

    socket.on('disconnect', () => {
        if (addedUser) {
            socket.broadcast.emit('user left', {
                username: socket.username,
            });
        }
    });
});
