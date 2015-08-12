var map = angular.module('parkAssist.map');
var Q = require('q');

map.factory('Comm', ['$http', function ($http) {

//this function should be removed when rebasing if it no long longer used on the front end.
  // var getspots = function (tuple, range) {
  //   console.log('services.js says: getspots called, tuple:', tuple);

  //   //Former Method: make a POST request to the server
  //   return $http({
  //     method: 'POST',
  //     url: '/api/getspots',
  //     data: {
  //       location: tuple,
  //       range: range
  //     }
  //   })
  //   .then(function(resp) {
  //     console.log('services.js says: POST successful. response:',resp);
  //     return [resp.data[0].latitude, resp.data[0].longitude];
  //   });
  // }

//Create a new user on firebase
  var createUser = function (tuple, range) {
    // console.log('services.js says: createUser called, creating a new user');
    var fb = new Firebase('https://burning-fire-1110.firebaseio.com/');
    var reference = fb.child('Users').push({ latitude: tuple[0], longitude: tuple[1], range: range });
    return reference;
  }

  return {
    // getspots: getspots, //to be removed
    createUser : createUser
  };

}]);
