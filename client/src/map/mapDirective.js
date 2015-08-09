var map = angular.module('parkAssist.map');
var mapOptions = require('./mapOptions');

map.directive('map', ['Comm', 'User', 'UserMarker', 'MeterMarkers', 'DirectionsDisplay', function(Comm, User, UserMarker, MeterMarkers, DirectionsDisplay) {

  var center;

  var initialize = function(element) {

    var map = new google.maps.Map(element[0], mapOptions);
    DirectionsDisplay.setMap(map);

    //get user's current location
    window.navigator.geolocation.getCurrentPosition(function(pos) {
      
      var tuple = [pos.coords.latitude, pos.coords.longitude];
      //remove
      console.log(tuple);
      var range = 0.2;
      Comm.getspots(tuple,range)
      .then(function(spot) {
        console.log('mapDirective.js says: spot:',spot);
        // meter location
        var meterLoc = new google.maps.LatLng(spot[0],spot[1]);


        MeterMarkers.addMarker(map,true,meterLoc);
        User.setDestination(meterLoc);

        User.watchPosition(map).then(function(userLocation) {
          map.panTo(userLocation);
        });

        google.maps.event.addDomListener(map, 'idle', function() {
          center = map.getCenter();
        });

        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(center);
        });
      });
      //-----------------

    }, null);

    // // meter location
    // var meterLoc = new google.maps.LatLng(34.039409,-118.442925);


    // MeterMarkers.addMarker(map,true,meterLoc);
    // User.setDestination(meterLoc);

    // // setTimeout(function(){
    // //   var meterLoc = new google.maps.LatLng(34.069409,-118.442925);
    // //   MeterMarkers.addMarker(map,true,meterLoc);
    // //   User.setDestination(meterLoc);
    // // },5000);

    // User.watchPosition(map).then(function(userLocation) {
    //   map.panTo(userLocation);
    // });

    // google.maps.event.addDomListener(map, 'idle', function() {
    //   center = map.getCenter();
    // });

    // google.maps.event.addDomListener(window, 'resize', function() {
    //   map.setCenter(center);
    // });

  };

  var loadMap = function(scope, element, attrs) {
    google.maps.event.addDomListener(window, 'load', function() {
      initialize(element);
    });
  };

  return {
    restrict: 'E',
    replace: true,
    template: '<div id="map-canvas"></div>',
    link: loadMap
  };

}]);
