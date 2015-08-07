var map = angular.module('parkAssist.map');

map.factory('Directions', function() {
  return new google.maps.DirectionsService();
});