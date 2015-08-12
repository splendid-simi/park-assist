var locator = angular.module('parkAssist.locator');
var Q = require('q');

locator.factory('Locator', ['$http', function ($http) {

  var createUser = function (tuple, range) {
    console.log('services.js says: createUser called, creating a new user');
    
    //Create a new user on firebase
    var fb = new Firebase('https://burning-fire-1110.firebaseio.com/');
    var reference = fb.child('Users').push({ latitude: tuple[0], longitude: tuple[1], range: range });
    return reference;
  }

  return {
    createUser : createUser
  };
}]);
