var marker = angular.module('parkAssist.marker');

marker.factory('UserMarker', [function() {

  var marker;

  var addMarker = function(map, active, LatLng) {
    var lat = LatLng.G;
    var long = LatLng.K;
    var image = {
      url: '../../img/car.png',
      size: new google.maps.Size(50, 45),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 23)
    };

    marker = new google.maps.Marker({
      active: active,
      position: LatLng,
      icon: image,
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