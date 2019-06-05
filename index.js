var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usernames = [];
app.get('/', function(req, res) { 
	res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req, res) { 
	res.sendFile(__dirname + '/admin.html');
});

io.on('connection', function(socket) { 
	console.log('user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
	// socket.join('admin');
	
	
	socket.on('chat message', function(msg, username) { 
	
		// var usernamespace  = io.of('/'+username)
		
		socket.join(username);
		if (usernames.indexOf(username) === -1) {
		usernames.push(username);
		io.emit('admin messages', usernames);
		}
		console.log(usernames.length);
	
		console.log('message : ' + msg);
		socket.emit('chat message', username + ': ' + msg);
		io.emit('to admin', username + ': ' + msg);
		
	});
	
	socket.on('from admin', function(msg, userSocket) { 
		userSocket.emit('chat message', 'admin: ' + msg);
	});
});



http.listen(3000, function() { 
	console.log('server listening on port 3000');
});