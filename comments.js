// create web server    
// 1. create server
// 2. listen to port
// 3. response to requests
// 4. send a response
// 5. close server

// 1. create server
var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
    // 3. response to requests
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function (err, data) {
        // 4. send a response
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}).listen(8080); // 2. listen to port

console.log('Server running at http://localhost:8080/'); // 5. close server