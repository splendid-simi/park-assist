var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');

var app = express();
middleware(app,express);


app.set('port',process.env.PORT || 8000);

app.use(express.static(__dirname + './../client'));

//Handle a POST request with coordinates and a range
//POST /api/getspots
app.post('/api/getspots', function(req,res) {
	console.log('server.js says: POST request received! body:', req.body);

	//Make a GET request to santa monica gov API (storage in database)
	var url = 'https://parking.api.smgov.net/meters';
	
	request(url, function (error, response, body) {
  		if(error) { console.log('Error getting data. Error:', error); }

  		if (!error && response.statusCode == 200) {
    		console.log(body); // Show the HTML for the Google homepage. 
    		res.send(body);
  		}
  	});
	
});


module.exports = app;

