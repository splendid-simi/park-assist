var map = angular.module('parkAssist.map');
var Q = require('q');

map.factory('Map', ['Traffic', 'DirectionsDisplay', 'MapOptions', 'Locator', 'MeterMarkers', 'User', 'Loading', function(Traffic, DirectionsDisplay, MapOptions, Locator, MeterMarkers, User, Loading) {
  var map, center, dbUser, meterLoc;
  var userInitialized = false;
  var range = 0.2;
  var queue = [];
  
  var setMeter = function(pSpot) {
    var spot = [pSpot.latitude, pSpot.longitude];
    meterLoc = new google.maps.LatLng(spot[0], spot[1]);

    MeterMarkers.addMarker(map, true, meterLoc);
  };

  var findSpot = function(tuple, newDestination) {
    var pSpot;

    Loading.changeText('Finding you the best parking spot...');
    Loading.show();

    if(newDestination) {
      queue = [];
    }

    if( pSpot = queue.shift() ) {
      setMeter(pSpot);
      User.setDestination(meterLoc).then(function(directions) {
        Loading.hide();
      });
      return;
    }

    if(dbUser) {
      dbUser.set(null);
    }

    //Create a user and get the key
    dbUser = Locator.createUser(tuple, range);

    // If user leaves browser, remove user from db
    window.onbeforeunload = function(e) {
      dbUser.set(null);
    };
    // console.log('User created. Key:', dbUser.key());

    //variables to help navigate to the best parking space
    var firstSpotInitialized = false;

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