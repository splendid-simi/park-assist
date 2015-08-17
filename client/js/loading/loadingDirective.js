var loading = angular.module('parkAssist.loading');

loading.directive('loading', [function() {

  var link = function(scope, element, attrs) {
    var $loading = $(element);
    var $loadingText = $loading.find('.loading-text');

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

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/loading/loadingTemplate.html',
    link: link
  };
}]);