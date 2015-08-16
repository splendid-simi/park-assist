var map = angular.module('parkAssist.map');
var Q = require('q');
var alertify = require('alertify');

map.factory('Map', ['Traffic', 'DirectionsDisplay', 'Geocoder', 'MapOptions', 'Locator', 'MeterMarkers', 'User', 'Loading', function(Traffic, DirectionsDisplay, Geocoder, MapOptions, Locator, MeterMarkers, User, Loading) {
  var map, center, dbUser, meterLoc;
  var firstSpotInitialized = false;
  var userInitialized = false;
  var range = 0.2;
  var queue = [];

  // If user leaves browser, remove user from db
  window.onbeforeunload = function(e) {
    if(dbUser) {
      dbUser.set(null);
    }
  };
  
  var setMeter = function(pSpot) {
    var spot = [pSpot.latitude, pSpot.longitude];
    meterLoc = new google.maps.LatLng(spot[0], spot[1]);

    MeterMarkers.addMarker(map, true, meterLoc);
  };

  var findSpot = function(tuple, newDestination) {
    var pSpot;

    if(newDestination) {
      queue = [];
    }

    if(firstSpotInitialized && !newDestination) {
      pSpot = queue.shift();

      if(pSpot) {
        setMeter(pSpot);
        User.setDestination(meterLoc);
        return;
      }

      alertify.alert('There are no parking spots in this area at this time.');
      return;
    }

    Loading.changeText('Finding you the best parking spot...');
    Loading.show();

    if(dbUser) {
      dbUser.set(null);
    }

    //variables to help navigate to the best parking space
    firstSpotInitialized = false;

    //Create a user and get the key
    Locator.createUser(tuple,range)
    .then(function(dbUser) {
      //Setup a listener for recommendations, ordered by distance
      dbUser.child('Recommendations').orderByChild('distance').on('child_added', function(snapshot){
        var pSpot = snapshot.val();

        if(firstSpotInitialized) {
          queue.push(pSpot);
          return;
        }

        firstSpotInitialized = true;

        setMeter(pSpot);

        if(userInitialized) {
          User.setDestination(meterLoc).then(function(directions) {
            Loading.hide();
          });
        }

        User.setDestination(meterLoc);

        User.watchPosition(map)
        .then(function(userLocation) {
          map.panTo(userLocation);
          userInitialized = true;
          Loading.hide();
        });
      });
    });
  };

  var getMap = function() {
    return map;
  };

  var init = function(mapCanvas) {
    var deferred = Q.defer();

    map = new google.maps.Map(mapCanvas, MapOptions);
    DirectionsDisplay.setMap(map);
    Traffic.showTraffic(map);

    google.maps.event.addDomListener(map, 'idle', function() {
      center = map.getCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
    });

    deferred.resolve(map);

    window.navigator.geolocation.getCurrentPosition(function(pos) {

      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;

      Geocoder.parseLatLng(lat,lng).then(function(addressInfo) {
        if( addressInfo.formatted_address.match(/Santa Monica/) ) {
          findSpot([lat,lng]);
          return;
        }

        Loading.hide();
        alertify.alert('You are outside of Santa Monica. Please select a Santa Monica destination.');
      });


    }, null);

    return deferred.promise;
  };

  return {
    init: init,
    findSpot: findSpot,
    getMap: getMap
  };
}]);