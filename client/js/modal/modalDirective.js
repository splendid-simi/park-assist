var modal = angular.module('parkAssist.modal');
var alertify = require('alertify');

modal.directive('modal', [function() {

  return {
    restrict: 'E',
    replace: true,
    controller: 'ModalController as modal',
    templateUrl: 'js/modal/modalTemplate.html'
  };

}]);
