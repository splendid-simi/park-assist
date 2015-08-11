var map = angular.module('parkAssist.map');
var mapOptions = require('./mapOptions');

map.directive('map', ['Comm', 'User', 'UserMarker', 'MeterMarkers', 'DirectionsDisplay', function(Comm, User, UserMarker, MeterMarkers, DirectionsDisplay) {

  var center, mapCanvas, loading, loadingText;

  var initialize = function(element) {

    mapCanvas = element.children()[0];
    loading = angular.element(element.children()[1]);
    loadingText = loading.find('p');

    var map = new google.maps.Map(mapCanvas, mapOptions);
    DirectionsDisplay.setMap(map);

    loadingText.text('Finding your location...');
    loading.addClass('show');

    //get user's current location
    window.navigator.geolocation.getCurrentPosition(function(pos) {

      loadingText.text('Finding you the best parking spot...');
      
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

        // setTimeout(function(){
        //   var meterLoc = new google.maps.LatLng(34.069409,-118.442925);
        //   MeterMarkers.addMarker(map,true,meterLoc);
        //   loadingText.text('Bummer! Spot taken. Redirecting you...');
        //   loading.addClass('show');
        //   User.setDestination(meterLoc).then(function(directions) {
        //     loading.removeClass('show');
        //   });
        // },15000);

        User.watchPosition(map)
        .then(function(userLocation) {
          map.panTo(userLocation);

          loadingText.text('Spot Found! Calculating Route...');

          return  User.calcRoute();
        })
        .then(function(directions) {
          loading.removeClass('show');
        });

        google.maps.event.addDomListener(map, 'idle', function() {
          center = map.getCenter();
        });

        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(center);
        });
      });
    }, null);
  };

  var loadMap = function(scope, element, attrs) {
    google.maps.event.addDomListener(window, 'load', function() {
      initialize(element);
    });
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'src/map/mapTemplate.html',
    link: loadMap
  };

}]);
