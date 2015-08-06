var express = require('express');
var app = express();

app.set('port',process.env.PORT || 8000);

app.use(express.static(__dirname + './../client'));

module.exports = app;