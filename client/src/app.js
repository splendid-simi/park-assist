var ParkAssist = angular.module('ParkAssist', [
  'ui.router',
  require('./directions').name,
  require('./geocoder').name,
  require('./loading').name,
  require('./locator').name,
  require('./map').name,
  require('./markers').name,
  require('./modal').name,
  require('./user').name
]);

ParkAssist.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');
}]);