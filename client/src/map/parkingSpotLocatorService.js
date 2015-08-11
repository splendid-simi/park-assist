var map = angular.module('parkAssist.map');

map.factory('Comm', ['$http', function ($http) {

  var getspots = function (tuple, range) {
    console.log('services.js says: getspots called, tuple:', tuple);

    return $http({
      method: 'POST',
      url: '/api/getspots',
      data: {
        location: tuple,
        range: range
      }
    })
    .then(function(resp) {
      console.log('services.js says: POST successful. response:',resp);
      return [resp.data[0].latitude, resp.data[0].longitude];
    });
  };

  var testLog = function () {
    console.log('Comm called.');
  };

  return {
    getspots: getspots,
    testLog : testLog
  };

}]);
