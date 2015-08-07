var map = angular.module('parkAssist.map',[]);

require('./directionsDisplayService');
require('./directionsService');
require('./geocoderService');
require('./mapDirective');

module.exports = map;