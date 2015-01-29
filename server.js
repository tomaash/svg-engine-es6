// require('harp').server(__dirname + '/dist', { port: process.env.PORT || 5000 })

var express = require('express');
var app = express();
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/dist'));
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log('Express (' + app.get('env') + ') server listening on port ' + port);
});