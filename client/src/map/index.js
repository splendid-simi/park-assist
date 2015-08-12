var map = angular.module('parkAssist.map',[]);

require('./geocoderService');
require('./loadingService');
require('./mapDirective');
require('./mapService');
require('./mapOptions');

module.exports = map;