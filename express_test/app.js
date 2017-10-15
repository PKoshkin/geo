var express = require('express');
var http = require('http');
var path = require('path');


var app = express();
app.set('port', 3000);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listens port ' + app.get('port'));
});

app.use(function(req, res, next) {
    res.end('Hello, world');
});
