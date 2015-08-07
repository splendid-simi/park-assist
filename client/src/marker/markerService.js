var marker = angular.module('parkAssist.marker');
var InfoBubble = require('InfoBubble');

marker.factory('Markers', function() {

  var markers = [];

  var addMarker = function(map, active, LatLng, id) {

    var marker = new google.maps.Marker({
      active: active,
      position: LatLng,
      icon: '../../img/instagram.png',
      title: id,
      animation: google.maps.Animation.DROP,
      map: map
    });

    var contentString = '<div id="content">'+
      '<div id="siteNotice"></div>'+
      '<div id="bodyContent">'+
      '<b>' + marker.title + '</b>' +
      '</div>'+
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

    google.maps.event.addListener(marker, 'click', function() {
      infoBubble.open(map, marker);
    });

    google.maps.event.addListener(map, "click", function () {
      infoBubble.close();
    });

    markers.push(marker);
  };

  return {
    addMarker: addMarker
  };

});