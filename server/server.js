var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Firebase = require('firebase');

var app = express();
middleware(app,express);


app.set('port',process.env.PORT || 8000);

app.use(express.static(__dirname + './../client'));

//Set up a Firebase
var firedb = new Firebase("https://px7n504ycdj.firebaseio-demo.com");

//Handle a POST request with coordinates tuple [latitude, longitude]
//POST /api/getspots
app.post('/api/getspots', function(req,res) {
	console.log('server.js says: POST request received! body:', req.body);
	var userLocation = req.body;

	//Make a GET request to the storage in database
	firedb.child("Metered Parking Spots").on("value", function (snapshot) {
		//console.log("Fetched all spots:",snapshot.val());
		
		//Make a result of feasible parking spots
		var radius = 1;						//proximity radius in miles (DEFAULTED for now to 1 mile)
		var pSpots = snapshot.val();		//All the parking spots
		var closeSpots = [];				//Ones that are within the euclidean distance
		var freeSpots = [];					//Ones that are currently available to park

		//Get list of all spots within euclidean distance
		for( var key in pSpots) {
			//console.log("Metered Parking Spot:", pSpots[key]);
			if(isWithinRange(userLocation[0],userLocation[1],pSpots[key].latitude, pSpots[key].longitude, 1)) {
				closeSpots.push(pSpots[key]);
			}
		}

		//retain spots that are currently free from closeSpots
		var active_url = 'https://parking.api.smgov.net/meters/';   //append :meter_id
		
		var busy_url_1 = 'https://parking.api.smgov.net/meters/';	//attach :meter_id between the two parts
		var busy_url_2 = '/events/latest';
		var numChecks = 0;
		var totalCloseSpots = closeSpots.length;

		for(var i=0; i<closeSpots.length; i++) {
			//check for whether the spot is active, followed by whether it is free
			console.log('*************************')
			console.log('Testing for parking spot:', closeSpots[i].meter_id);
			var meterID = closeSpots[i].meter_id;

			var checkParkingSpot = function(obj,res) {
				//request to check for meter:'active'
				request(active_url+obj.meter_id, function (error, response, body) {
					if(error) { console.log('Error while checking whether meter:active'); }
					if (!error && response.statusCode === 200) {
			  			body = JSON.parse(body);
			  			console.log('Data from SMGov API (meter:active):', body);

			  			if(body.active) {
				  			//if active, check for meter:'available'
				  			request(busy_url_1 + body.meter_id + busy_url_2, function (error, response, body) {
				  				if(error) { console.log('Error while checking for meter:available'); }
				  				if(!error && response.statusCode === 200) {
				  					body = JSON.parse(body);
				  					console.log('Data from SMGov API (meter:available):', body);
									//body.event_type = SS(move in) / SE(move out)
									if(body.event_type === 'SE') {
										//add the spot to freespots
										freeSpots.push(obj);
									}
				  				}
				  			});	//meter:available request ends here
				  		}
					}
				  	numChecks++;
					if(numChecks === totalCloseSpots) {
						res.send(200, freeSpots);
					}

				}); //meter:active request ends here
			}//checkParkingSpot function ends here

			checkParkingSpot(closeSpots[i],res);

		} //end of for loop

	}); //firebase query ends here
	
});	//api/getspots ends here


//Helper Functions
//Function to check whether the euclidean distance between a pair of coordinate pairs falls within a desired range
var isWithinRange = function(latU, longU, latP, longP, radius) {
	var threshold = radius/4;
	var euDistance = Math.sqrt(Math.pow((latP - latU)*69.1128,2) + Math.pow((longP - longU)*57.2807,2));
	//console.log('User Location: [',latU, ',', longU, '] ', 'Parking Location: [', latP, ',', longP, '] ', 'Absolute Distance in miles:', euDistance );
	return euDistance < threshold;
}


//----------------------------------
//Initialize Firebase with information on all the metered spots in santa monica
//GET /api/init 
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
}); // /api/init ends here


module.exports = app;

