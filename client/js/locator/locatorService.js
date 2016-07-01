var locator = angular.module('parkAssist.locator');
var Q = require('q');
var fb_keys = "https://parkassistapp.firebaseio.com/";

locator.factory('Locator', ['$http', function ($http) {
  console.log('creating a new user');
  var createUser = function (tuple, range) {
    var deferred = Q.defer();

    //Create a new user on firebase
    var fb = new Firebase(fb_keys);
    var dbUser = fb.child('Users').push({ latitude: tuple[0], longitude: tuple[1], range: range });
    console.log('creating a new user', tuple);
    deferred.resolve(dbUser);

    return deferred.promise;
  };

  return {
    createUser : createUser
  };
}]);
