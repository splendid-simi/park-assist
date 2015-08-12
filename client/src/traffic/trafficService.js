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