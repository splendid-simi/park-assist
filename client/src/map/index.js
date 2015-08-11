var map = angular.module('parkAssist.map',[]);

require('./directionsDisplayService');
require('./directionsService');
require('./geocoderService');
require('./loadingService');
require('./mapDirective');
require('./mapService');
require('./mapOptions');

module.exports = map;