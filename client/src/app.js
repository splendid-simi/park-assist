var ParkAssist = angular.module('ParkAssist', [
  'ui.router',
  require('./map').name,
  require('./user').name,
  require('./markers').name
]);

ParkAssist.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');
}]);