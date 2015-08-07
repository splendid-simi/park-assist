var map = angular.module('parkAssist.map');

map.directive('map', ['User', 'DirectionsDisplay', 'Directions', function(User, DirectionsDisplay, Directions) {

  var initialize = function(element) {

    var directionsDisplay = DirectionsDisplay;
    var directionsService = Directions;

    var mapOptions = {
      zoom: 17,
      minZoom: 3,
      maxZoom: 25,
      center: {lat: 34.0219, lng: -118.4814}
    };

    var map = new google.maps.Map(element[0], mapOptions);
    directionsDisplay.setMap(map);

    User.watchPosition(map).then(function(userLocation) {
      console.log(userLocation);
      User.calcRoute(34.0519, -118.5894);
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
