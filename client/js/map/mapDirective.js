var map = angular.module('parkAssist.map');

map.directive('map', [function() {
  
  return {
    restrict: 'E',
    replace: true,
    controller: 'MapController as map',
    templateUrl: 'js/map/mapTemplate.html',
  };

}]);
