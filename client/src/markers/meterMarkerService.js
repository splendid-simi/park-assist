var marker = angular.module('parkAssist.marker');
var InfoBubble = require('InfoBubble');

marker.factory('MeterMarkers', ['Geocoder', function(Geocoder) {

  var markers = [];

  var addMarker = function(map, active, LatLng) {

    var lat = LatLng.G;
    var long = LatLng.K;

    var marker = new google.maps.Marker({
      active: active,
      position: LatLng,
      icon: '../../img/instagram.png',
      animation: google.maps.Animation.DROP,
      map: map
    });

    var imgSrc = 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location='+lat+','+long+'&fov=90&heading=235&pitch=10';

    Geocoder.parseLatLng(lat,long).then(function(address) {

      var contentString = '<div class="info-bubble">'+
        '<img src="' + imgSrc + '" />' +
        '<p>'+ address +'</p>'+
        '</div>';

      var infoBubble = new InfoBubble({
        content: contentString,
        maxWidth: 400,
        minHeight: 0,
        shadowStyle: 1,
        padding: 0,
        backgroundColor: '#fefefc',
        borderRadius: 5,
        arrowSize: 10,
        borderWidth: 2,
        borderColor: '#fefefc',
        disableAutoPan: true,
        hideCloseButton: true,
        arrowPosition: 30,
        backgroundClassName: 'transparent',
        arrowStyle: 2,
        map: map
      });

      infoBubble.open(map, marker);

      google.maps.event.addListener(marker, 'click', function() {
        infoBubble.open(map, marker);
      });

      google.maps.event.addListener(map, 'click', function () {
        infoBubble.close();
      });

    });

    markers.push(marker);
  };

  return {
    addMarker: addMarker
  };

}]);