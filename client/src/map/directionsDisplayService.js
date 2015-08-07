var map = angular.module('parkAssist.map');

map.factory('DirectionsDisplay', function() {
  return new google.maps.DirectionsRenderer();
});