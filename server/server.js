var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Firebase = require('firebase');

var app = express();
middleware(app, express);

app.set('port', process.env.PORT || 8000);

//Helper Functions
//Function to calculate the euclidean distance between the user location and a parking spot
var distance = function(latU, longU, latP, longP) {
  return Math.sqrt(Math.pow((latP - latU) * 69.1128, 2) + Math.pow((longP - longU) * 57.2807, 2));
}

//---------------------------This section is to initalize our own Firebase MeterParkingSpots Database from the Santa Monica API--------------------------
//GET /api/init 
app.post('/api/init', function(req, res) {
  console.log('server.js says: POST request for init received.');

  //Store all the metered parking spot information on our own database
  //Make a GET request
  var url = 'https://parking.api.smgov.net/meters'; //Santa Monica api that has location data on all metered parking spots
  request(url, function(error, response, body) {
    if (error) {
      console.log('Error getting data. Error:', error);
    }
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);

      //One time update of the database with the metered spots info
      for (var key in body) {
        //console.log("Value at",key, " is",body[key]);
        var obj = body[key];
        firedb.child("Metered Parking Spots").push({
          meter_id: obj.meter_id,
          latitude: obj.latitude,
          longitude: obj.longitude
        });
      }
      res.send(200);
    }
  });
}); // /api/init ends here
//------------------------------------------End of Initializing MeterParkingSpots database-----------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//Listen for a new user session and adds a user entry on firebase in the Users database
var firecloud = new Firebase('https://burning-fire-1110.firebaseio.com/');
var usersRef = firecloud.child('Users'); //creates a new sub database, 'Users' for user specific location and parking recommendations

usersRef.on('child_added', function(childSnapshot, prevChildKey) {
  // console.log('******************* NEW USER ********************')
  var user = childSnapshot.val();
  var userKey = childSnapshot.key();
  // console.log('User\'s details:',user, typeof user, 'currChildKey:', childSnapshot.key());
  // console.log('*************************************************');

  //Use the user's coordinates to get a list of feasible spots
  var radius = user.range;
  var tuple = [user.latitude, user.longitude];

  //getspots
  firecloud.child('MeteredParkingSpots').once('value', function(snapshot) {

    var pSpots = snapshot.val(); //initializes variables for storing user specific information
    var closeSpots = [];
    var freeSpots = {};

    for (var key in pSpots) {
      var displacement = distance(tuple[0], tuple[1], pSpots[key].latitude, pSpots[key].longitude);
      if (displacement < radius) {

        pSpots[key].distance = displacement;
        if (pSpots[key].mostRecentEvent === 'SE') {
          freeSpots[key] = pSpots[key];
        }
      } // end if condition to check if the parking spot is within range
    } // end of for loop for pSpots
    firecloud.child('Users').child(userKey).child('Recommendations').set(freeSpots); //adds the list of recomendations to the User in the database
  });
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = app;