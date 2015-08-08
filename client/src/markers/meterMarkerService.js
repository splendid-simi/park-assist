var marker = angular.module('parkAssist.marker');
var InfoBubble = require('InfoBubble');

marker.factory('MeterMarkers', ['Geocoder', function(Geocoder) {

  var marker, infoBubble;

  var addInfoBubble = function(map, imgSrc, address) {
    var bubbleContent = '<div class="info-bubble">'+
      '<img src="'+imgSrc+'" />' +
      '<p>'+address+'</p>'+
      '</div>';

    return new InfoBubble({
      content: bubbleContent,
      maxWidth: 150,
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
      arrowStyle: 2,
      map: map
    });
  };

  var addMarker = function(map, active, LatLng) {

    var lat = LatLng.G;
    var long = LatLng.K;

    if(marker) {
      infoBubble.close();
      marker.setMap(null);
    }

    marker = new google.maps.Marker({
      active: active,
      position: LatLng,
      icon: '../../img/instagram.png',
      animation: google.maps.Animation.DROP,
      map: map
    });

    var imgSrc = 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location='+lat+','+long+'&fov=90&heading=235&pitch=10';

    Geocoder.parseLatLng(lat,long).then(function(address) {

      infoBubble = addInfoBubble(map,imgSrc,address);

      infoBubble.open(map, marker);
        
      google.maps.event.addListener(marker, 'click', function() {
        infoBubble.open(map, marker);
      });

      google.maps.event.addListener(map, 'click', function () {
        infoBubble.close();
      });

    });

  };

  return {
    addMarker: addMarker
  };

}]);