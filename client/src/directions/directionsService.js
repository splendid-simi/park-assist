var directions = angular.module('parkAssist.directions');

directions.factory('Directions', function() {
  return new google.maps.DirectionsService();
});