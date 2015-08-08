var map = angular.module('parkAssist.map');

map.directive('map', ['User', 'UserMarker', 'MeterMarkers', 'DirectionsDisplay', function(User, UserMarker, MeterMarkers, DirectionsDisplay) {

  var center;

  var initialize = function(element) {

    var mapOptions = {
      zoom: 17,
      minZoom: 3,
      maxZoom: 25,
      center: {lat: 34.0219, lng: -118.4814}
    };

    var map = new google.maps.Map(element[0], mapOptions);
    DirectionsDisplay.setMap(map);

    // meter location
    var meterLoc = new google.maps.LatLng(34.039409,-118.442925);

    User.setDestination(meterLoc);
    MeterMarkers.addMarker(map,true,meterLoc);

    User.watchPosition(map).then(function(userLocation) {
      map.panTo(userLocation);
    });

    google.maps.event.addDomListener(map, 'idle', function() {
      center = map.getCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
    });

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
