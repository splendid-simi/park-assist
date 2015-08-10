var marker = angular.module('parkAssist.marker');

marker.factory('UserMarker', [function() {

  var marker;

  var addMarker = function(map, active, LatLng) {

    var lat = LatLng.G;
    var long = LatLng.K;

    marker = new google.maps.Marker({
      active: active,
      position: LatLng,
      icon: '../../img/car.png',
      animation: google.maps.Animation.DROP,
      map: map
    });

  };

  var getMarker = function() {
    return marker;
  };

  return {
    addMarker: addMarker,
    getMarker: getMarker
  };

}]);