var map = angular.module('parkAssist.map');
var Q = require('q');

map.factory('Geocoder', [function() {
  var geocoder = new google.maps.Geocoder();

  var parseLatLng = function(lat,long) {
    var latlng = new google.maps.LatLng(lat, long);
    var deferred = Q.defer();

    var geocodeOptions = {
      location: latlng
    };

    geocoder.geocode(geocodeOptions, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var addressComponents = results[0].address_components;
          var address = addressComponents[0].long_name + ' ' + addressComponents[1].long_name;
          deferred.resolve(address);
        } else {
          deferred.reject('No results found');
        }
      } else {
        deferred.reject('Geocoder failed due to: ' + status);
      }
    });

    return deferred.promise;
  };

  var parseAddress = function(address) {
    var deferred = Q.defer();
    
    var geocodeOptions = {
      address: address
    };

    geocoder.geocode(geocodeOptions, function(results, status) {
      if ( status !== google.maps.GeocoderStatus.OK ) {
        deffered.reject('Geocoder failed due to: ' + status);
      }

      deferred.resolve(results[0]);
    });

    return deferred.promise;
  };

  return {
    parseLatLng: parseLatLng,
    parseAddress: parseAddress
  };

}]);