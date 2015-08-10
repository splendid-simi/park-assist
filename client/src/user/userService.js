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
    if(userLocation) {
      calcRoute();
    }
  };

  var calcRoute = function() {
    DirectionsDisplay.setOptions({
      preserveViewport: routeInitialized
    });

    var request = {
      origin: userLocation,
      destination: userDestination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    Directions.route(request, function(response, status) {
      if ( status === google.maps.DirectionsStatus.OK ) {
        DirectionsDisplay.setDirections(response);
        routeInitialized = true;
      }
    });
  };

  var watchPosition = function(map) {

    var defer = Q.defer();

    window.navigator.geolocation.watchPosition(function(pos) {

      userLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      defer.resolve(userLocation);

      calcRoute();

      if( !UserMarker.getMarker() ) {
        UserMarker.addMarker(map, true, userLocation);
      } else {
        UserMarker.getMarker().setPosition(userLocation);
      }
      
    }, null, userLocationOptions);

    return defer.promise;
  };

  return {
    watchPosition: watchPosition,
    calcRoute: calcRoute,
    setDestination: setDestination
  };

}]);