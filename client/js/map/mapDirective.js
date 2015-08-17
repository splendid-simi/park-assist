var map = angular.module('parkAssist.map');

map.directive('map', ['Map', '$rootScope', function(Map, $rootScope) {

  var loading = function(scope, $loading, $loadingText) {
    scope.$on('parkAssist:changeLoadingText', function(e,text) {
      $loadingText.text(text);
    });

    scope.$on('parkAssist:showLoadingText', function(e) {
      $loading.addClass('show');
    });

    scope.$on('parkAssist:hideLoadingText', function(e) {
      $loading.removeClass('show');
    });
  };
  
  var loadMap = function(scope, element, attrs) {
    var $el = $(element);
    var mapCanvas = $el.find('#map-canvas')[0];
    var $changeDest = $el.find('.change-destination');
    var $anotherSpot = $el.find('.another-spot');
    var $loading = $el.find('.loading');
    var $loadingText = $loading.find('.loading-text');

    loading(scope, $loading, $loadingText);

    $changeDest.on('click',function(e) {
      $rootScope.$broadcast('parkAssist:openModal');
    });

    $anotherSpot.on('click',function(e) {
      Map.findSpot();
    });

    Map.init(mapCanvas)
    .then(function() {
      scope.$broadcast('parkAssist:changeLoadingText', 'Finding your location...');
      scope.$broadcast('parkAssist:showLoadingText');
    });
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/map/mapTemplate.html',
    link: loadMap
  };
}]);
