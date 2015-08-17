var map = angular.module('parkAssist.map');

map.directive('map', ['Map', 'Modal', '$rootScope', function(Map, Modal, $rootScope) {
  
  var loadMap = function(scope, element, attrs) {
    var $el = $(element);
    var mapCanvas = $el.find('#map-canvas')[0];
    var $changeDest = $el.find('.change-destination');
    var $anotherSpot = $el.find('.another-spot');

    $changeDest.on('click',function(e) {
      Modal.open();
    });

    $anotherSpot.on('click',function(e) {
      Map.findSpot();
    });

    Map.init(mapCanvas)
    .then(function(map) {
      $rootScope.$broadcast('parkAssist:changeLoadingText', 'Finding your location...');
      $rootScope.$broadcast('parkAssist:showLoadingText');
      Modal.initAutoComplete();
    });
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/map/mapTemplate.html',
    link: loadMap
  };
}]);
