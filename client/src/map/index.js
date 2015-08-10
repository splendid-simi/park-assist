var map = angular.module('parkAssist.map',[]);

require('./directionsDisplayService');
require('./directionsService');
require('./geocoderService');
require('./mapDirective');

//to test the server
require('./parkingSpotLocatorService.js');

module.exports = map;