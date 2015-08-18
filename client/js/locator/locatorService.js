var locator = angular.module('parkAssist.locator');
var Q = require('q');
var fb_keys = require('../../../firebaselink.js');

locator.factory('Locator', ['$http', function ($http) {

  var createUser = function (tuple, range) {
    var deferred = Q.defer();
    
    //Create a new user on firebase
    var fb = new Firebase(fb_keys.url);
    var dbUser = fb.child('Users').push({ latitude: tuple[0], longitude: tuple[1], range: range });
    
    deferred.resolve(dbUser);

    return deferred.promise;
  };

  return {
    createUser : createUser
  };
}]);
