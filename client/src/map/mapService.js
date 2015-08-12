var map = angular.module('parkAssist.map');
var Q = require('q');

map.factory('Map', ['DirectionsDisplay', 'MapOptions', 'Locator', 'MeterMarkers', 'User', 'Loading', function(DirectionsDisplay, MapOptions, Locator, MeterMarkers, User, Loading) {
  var map, center;

  var userInitialized = false;
  var range = 0.2;

  var findSpot = function(tuple) {
    Loading.changeText('Finding you the best parking spot...');
    Loading.show();

    //Create a user and get the key
    var ref = Locator.createUser(tuple, range);
    // console.log('User created. Key:', ref.key());

    //variables to help navigate to the best parking space
    var first = false;
    var queue = [];

    //Setup a listener for recommendations, ordered by distance
    ref.child('Recommendations').orderByChild('distance').on('child_added', function(snapshot){
      var pSpot = snapshot.val();
      //console.log(pSpot); 

      if(!first) { //if the first spot hasn't already been recommended to the user, then we recommend it here
        first = true;
        var spot = [pSpot.latitude, pSpot.longitude];
        // console.log('mapDirective.js says: spot:', spot);
        
        // meter location
        var meterLoc = new google.maps.LatLng(spot[0],spot[1]);

        MeterMarkers.addMarker(map,true,meterLoc);
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
      }
      else {
        queue.push(pSpot);
      }
    });  //firebase listener ends here
  };  //end of findSpot()

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