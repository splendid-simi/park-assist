var directions = angular.module('parkAssist.directions');

directions.factory('DirectionsDisplay', function() {
  return new google.maps.DirectionsRenderer({
    suppressMarkers: true
  });
});