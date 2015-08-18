// app.js requires all the modules in their respective folders.
// The requires in this file accesses the index.js file in each service's directory
// and points to the module via .name property.

var ParkAssist = angular.module('ParkAssist', [
  'ui.router',
  require('./directions').name,
  require('./geocoder').name,
  require('./locator').name,
  require('./map').name,
  require('./markers').name,
  require('./modal').name,
  require('./traffic').name,
  require('./user').name,
  require('./team').name
]);

ParkAssist.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');
}]);