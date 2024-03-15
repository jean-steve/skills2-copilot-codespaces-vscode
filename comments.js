// create web server    
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var comments = require('./comments');
var mime = require('mime');
var cache = {};

// send 404 error
function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

// send file data
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

// serve static files
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

// create http server
var server = http.createServer(function(request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});

// create socket.io server
var io = require('socket.io').listen(server);
io.set('log level', 1);

// define how the server should respond to each connection
io.sockets.on('connection', function(socket) {
    // when the client emits 'message', this listens and executes
    socket.on('message', function(message) {
        socket.broadcast.emit('message', message);
    });
    // when the client emits 'user', this listens and executes
    socket.on('user', function(user) {
        socket.broadcast.emit('user', user);
    });
    // when the client emits 'comment', this listens and executes
    socket.on('comment', function(comment) {
        comments.addComment(comment);