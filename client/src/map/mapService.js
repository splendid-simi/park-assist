var map = angular.module('parkAssist.map');
var Q = require('q');

map.factory('Map', ['DirectionsDisplay', 'MapOptions', 'Locator', 'MeterMarkers', 'User', 'Loading', function(DirectionsDisplay, MapOptions, Locator, MeterMarkers, User, Loading) {
  var map, center;

  var userInitialized = false;
  var range = 0.2;

  var findSpot = function(tuple) {
    loadingText.text('Finding you the best parking spot...');
    
    //remove
    console.log(tuple);

    //Create a user and get the key
    var ref = Comm.createUser(tuple, range);
    console.log('User created. Key:', ref.key());


    //variables to help navigate to the best one
    var first = false;
    var queue = [];

    //Setup a listener for recommendations, ordered by distance
    ref.child('Recommendations').orderByChild('distance').on('child_added', function(snapshot){
      var pSpot = snapshot.val();
      console.log(typeof pSpot); 

      if(!first) {
        first = true;
        var spot = [pSpot.latitude, pSpot.longitude];
        console.log('mapDirective.js says: spot:', spot);
        
        // meter location
        var meterLoc = new google.maps.LatLng(spot[0],spot[1]);

        MeterMarkers.addMarker(map,true,meterLoc);
        User.setDestination(meterLoc);

        User.watchPosition(map)
        .then(function(userLocation) {
          map.panTo(userLocation);
          loadingText.text('Spot Found! Calculating Route...');
          return User.calcRoute();
        })
        .then(function(directions) {
          loading.removeClass('show');
        });
      }
      else {
        queue.push(pSpot);
      }

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