var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Firebase = require('firebase');

var app = express();
middleware(app,express);


app.set('port',process.env.PORT || 8000);

app.use(express.static(__dirname + './../client'));

//Handle a POST request with coordinates tuple [latitude, longitude]
//POST /api/getspots
app.post('/api/getspots', function(req,res) {
	console.log('server.js says: POST request received! body:', req.body);

	//Make a GET request to santa monica gov API (storage in database)
	var url = 'https://parking.api.smgov.net/meters';
	request(url, function (error, response, body) {
  		if(error) { console.log('Error getting data. Error:', error); }
  		if (!error && response.statusCode == 200) {
    		res.send(body);
  		}
  	});
  	//End of GET request
});

//Testing Firebase
var firedb = new Firebase("https://px7n504ycdj.firebaseio-demo.com");

app.post('/api/init', function(req,res) {
	console.log('server.js says: POST request for init received.');
	// firedb.child("Parking Spots").push( {meter_id: 100, lat:10, long:10});

	//Store all the metered parking spot information on the database
	//Make a GET request
	var url = 'https://parking.api.smgov.net/meters';
	request(url, function (error, response, body) {
  		if(error) { console.log('Error getting data. Error:', error); }
  		if (!error && response.statusCode == 200) {
  			body = JSON.parse(body);
  			console.log('Data from SMGov API:', typeof body);

  			//One time update of the database with the metered spots info
  			for(var key in body) {
  				//console.log("Value at",key, " is",body[key]);
  				var obj = body[key];
  				firedb.child("Metered Parking Spots").push({meter_id: obj.meter_id, latitude: obj.latitude, longitude: obj.longitude});
  			}
  			res.send(200);
  		}
  	});

	
})


module.exports = app;

