var map = angular.module('parkAssist.map');
var Q = require('q');

map.factory('Map', ['DirectionsDisplay', 'MapOptions', 'Comm', 'MeterMarkers', 'User', 'Loading', function(DirectionsDisplay, MapOptions, Comm, MeterMarkers, User, Loading) {

  var map, center;

  var userInitialized = false;
  var range = 0.2;

  var findSpot = function(tuple) {
    Loading.changeText('Finding you the best parking spot...');
    Loading.show();
    
    Comm.getspots(tuple,range)
    .then(function(spot) {
      console.log('mapDirective.js says: spot:', spot);
      
      // meter location
      var meterLoc = new google.maps.LatLng(spot[0],spot[1]);

      MeterMarkers.addMarker(map,true,meterLoc);

      if(userInitialized) {
        User.setDestination(meterLoc).then(function(directions) {
          Loading.hide();
        });
        return;
      }

      User.setDestination(meterLoc);
      
      User.watchPosition(map)
      .then(function(userLocation) {
        map.panTo(userLocation);
        Loading.changeText('Spot Found! Calculating Route...');
        return User.calcRoute();
      })
      .then(function(directions) {
        userInitialized = true;
        Loading.hide();
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

    google.maps.event.addDomListener(map, 'idle', function() {
      center = map.getCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
    });

    deferred.resolve(map);

    window.navigator.geolocation.getCurrentPosition(function(pos) {
      findSpot([pos.coords.latitude, pos.coords.longitude]);
    }, null);

    return deferred.promise;
  };

  return {
    init: init,
    findSpot: findSpot,
    getMap: getMap
  };
}]);