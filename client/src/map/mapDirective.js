var map = angular.module('parkAssist.map');

map.directive('map', ['Map', 'Loading', 'Modal', function(Map, Loading, Modal) {
  
  var loadMap = function(scope, element, attrs) {
    var $el = $(element);
    var mapCanvas = $el.find('#map-canvas')[0];
    var $loading = $el.find('.loading');
    var $loadingText = $el.find('.loading-text');
    var $changeDest = $el.find('.change-destination');
    var $anotherSpot = $el.find('.another-spot');

    $changeDest.on('click',function(e) {
      Modal.open();
    });

    $anotherSpot.on('click',function(e) {
      Map.findSpot();
    });

    Loading.init($loading,$loadingText);

    Map.init(mapCanvas)
    .then(function(map) {
      Loading.changeText('Finding your location...');
      Loading.show();
      Modal.initAutoComplete();
    });
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'src/map/mapTemplate.html',
    link: loadMap
  };
}]);
