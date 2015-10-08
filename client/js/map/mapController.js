var map = angular.module('parkAssist.map');

map.controller('MapController', ['Map', '$rootScope', '$scope', function(Map, $rootScope, $scope) {
  var mapCanvas = $('#map-canvas')[0];
  var ctrl = this;

  ctrl.loadingText = '';
  ctrl.isLoading = true;

  ctrl.openModal = function() {
    $rootScope.$broadcast('parkAssist:openModal');
  };

  ctrl.findSpot = Map.findSpot;

  $scope.$on('parkAssist:changeLoadingText', function(e, text) {
    $scope.safeApply(function() {
      ctrl.loadingText = text;
    });
  });

  $scope.$on('parkAssist:showLoadingText', function(e) {
    $scope.safeApply(function() {
      ctrl.isLoading = true;
    });
  });

  $scope.$on('parkAssist:hideLoadingText', function(e) {
    $scope.safeApply(function() {
      ctrl.isLoading = false;
    });
  });

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if( phase == '$apply' || phase == '$digest' ) {
      this.$eval(fn);
    } else {
      this.$apply(fn);
    }
  };

  Map.init(mapCanvas);

}]);
