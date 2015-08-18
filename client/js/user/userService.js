var user = angular.module('parkAssist.user');
var Q = require('q');

user.factory('User', ['Directions', 'DirectionsDisplay', 'UserMarker', function(Directions, DirectionsDisplay, UserMarker) {
  var userLocation, userDestination;
  var routeInitialized = false;

  var userLocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  var setDestination = function(latLng) {
    userDestination = latLng;
    routeInitialized = false;
  };

  var calcRoute = function() {
    var defer = Q.defer();

    DirectionsDisplay.setOptions({
      preserveViewport: routeInitialized
    });

    var request = {
      origin: userLocation,
      destination: userDestination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    Directions.route(request, function(directions, status) {
      if ( status === google.maps.DirectionsStatus.OK ) {
        DirectionsDisplay.setDirections(directions);
        routeInitialized = true;
        defer.resolve(directions);
      }
    });

    return defer.promise;
  };

  var watchPosition = function(map) {
    var defer = Q.defer();

    // watchPosition returns an error if user picks cancel
    // we are getting repeated prompts for user position because
    // defer is being used to wait for a location
    // need to use native error handling before using Q
    window.navigator.geolocation.watchPosition(function(pos) {
      userLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      if( !UserMarker.getMarker() ) {
        UserMarker.addMarker(map, true, userLocation);
      } else {
        UserMarker.getMarker().setPosition(userLocation);
      }

      if(routeInitialized) {
        calcRoute();
      }

      defer.resolve(userLocation);
    }, null, userLocationOptions);

    return defer.promise;
  };

  return {
    watchPosition: watchPosition,
    calcRoute: calcRoute,
    setDestination: setDestination
  };
}]);