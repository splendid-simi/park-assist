var user = angular.module('parkAssist.user');
var Q = require('q');

user.factory('User', ['Directions', 'DirectionsDisplay', function(Directions, DirectionsDisplay) {

  var userLocation;

  var userLocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  var calcRoute = function(lat,long) {
    var request = {
      origin: userLocation,
      destination: new google.maps.LatLng(lat, long),
      travelMode: google.maps.TravelMode.DRIVING
    };

    Directions.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log('Distance: ', response.routes[0].legs[0].distance.text);
        DirectionsDisplay.setDirections(response);
      }
    });
  };

  var watchPosition = function(map) {
    var deferred = Q.defer();

    window.navigator.geolocation.watchPosition(function(pos) {
      userLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      console.log('You moved!', userLocation);
      map.panTo(userLocation);
      deferred.resolve(userLocation);
    }, null, userLocationOptions);

    return deferred.promise;
  };

  return {
    watchPosition: watchPosition,
    calcRoute: calcRoute
  };

}]);