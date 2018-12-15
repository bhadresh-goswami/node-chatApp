//#region   
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {

    console.log('server running!');
    res.sendFile(__dirname + '/index.html');



});
//#endregion


//socket.io code
io.sockets.on('connection', function (socket) {

    //connected code
    connections.push(socket);
    console.log('Connected: %s socket connected.', connections.length);


    //disconnected code
    socket.on('disconnect', function (data) {
        if(!socket.username) return;
        users.splice(users.indexOf(socket),1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s socket connected.', connections.length);

    });

    socket.on('send message',function(data){
        console.log(data);
        io.sockets.emit('new message',{msg:data,username:socket.username});
    });

    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users',users);
    }



});