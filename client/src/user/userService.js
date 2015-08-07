var user = angular.module('parkAssist.user');

user.factory('User', ['Directions', 'DirectionsDisplay', 'UserMarker', function(Directions, DirectionsDisplay, UserMarker) {

  var userLocation, userDestination;

  var userLocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  var setDestination = function(latLng) {
    userDestination = latLng;
  };

  var calcRoute = function() {
    var request = {
      origin: userLocation,
      destination: userDestination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    Directions.route(request, function(response, status) {
      if ( status == google.maps.DirectionsStatus.OK ) {
        DirectionsDisplay.setDirections(response);
      }
    });
  };

  var watchPosition = function(map) {
    window.navigator.geolocation.watchPosition(function(pos) {

      userLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      map.panTo(userLocation);

      calcRoute();

      if( !UserMarker.getMarker() ) {
        UserMarker.addMarker(map, true, userLocation);
      } else {
        UserMarker.getMarker().setPosition(userLocation);
      }
      
    }, null, userLocationOptions);
  };

  return {
    watchPosition: watchPosition,
    calcRoute: calcRoute,
    setDestination: setDestination
  };

}]);