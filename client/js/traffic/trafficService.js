// Traffic layer data from Google.
// Pending for feature testing.
// Function used on Line 86 of mapService.js as Traffic.showTraffic(map);
// Remember to delete dependencies if removing feature.

var traffic = angular.module('parkAssist.traffic');

traffic.factory('Traffic', [function() {
  var traffic = new google.maps.TrafficLayer();

  var showTraffic = function(map) {
    return traffic.setMap(map);
  };

  return {
    showTraffic: showTraffic
  };

}]);