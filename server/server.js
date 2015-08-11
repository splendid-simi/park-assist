var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Firebase = require('firebase');

var app = express();
middleware(app, express);


app.set('port', process.env.PORT || 8000);

app.use(express.static(__dirname + './../client'));

//Helper Functions
var distance = function (latU, longU, latP, longP) {
	return Math.sqrt(Math.pow((latP - latU)*69.1128,2) + Math.pow((longP - longU)*57.2807,2));
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//Listen for a user session - Entry on firebase
var firecloud = new Firebase('https://burning-fire-1110.firebaseio.com/');
var usersRef = firecloud.child('Users');

usersRef.on('child_added', function (childSnapshot, prevChildKey) {
	console.log('******************* NEW USER ********************')
	var user = childSnapshot.val();
	var userKey = childSnapshot.key();
	console.log('User\'s details:',user, typeof user, 'currChildKey:', childSnapshot.key());
	console.log('*************************************************');

	//Use the user's coordinates to get a list of feasible spots
	var radius = user.range;
	var tuple = [user.latitude, user.longitude];

	//getspots
	firecloud.child('MeteredParkingSpots').once('value', function (snapshot) {
		var pSpots = snapshot.val();
		var freeSpots = {};

		for(var key in pSpots) {
			var displacement = distance(tuple[0], tuple[1], pSpots[key].latitude, pSpots[key].longitude);
			if(displacement < radius) {

				pSpots[key].distance = displacement;
				if(pSpots[key].mostRecentEvent === 'SE') {
					freeSpots[key] = pSpots[key];
				}

			} // end if condition to check within range
		} // end of for loop for pSpots
		firecloud.child('Users').child(userKey).child('Recommendations').set(freeSpots);
	});
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = app;
