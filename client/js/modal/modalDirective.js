var modal = angular.module('parkAssist.modal');

modal.directive('modal', ['Modal', function(Modal) {
  var link = function(scope, el, attrs) {
    Modal.initModal(el);
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/modal/modalTemplate.html',
    link: link
  };
}]);