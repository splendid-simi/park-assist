var marker = angular.module('parkAssist.marker');
var InfoBubble = require('InfoBubble');

marker.factory('MeterMarkers', ['Geocoder', function(Geocoder) {

  var marker, infoBubble;
  var bubbleWidth = 250;
  var bubbleOpen = false;

  var offsetCenter = function(map, latlng, offsetx, offsety) {
    // latlng is the apparent centre-point
    // offsetx is the distance you want that point to move to the right, in pixels
    // offsety is the distance you want that point to move upwards, in pixels
    // offset can be negative
    // offsetx and offsety are both optional

    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );

    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
    var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0);

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

    map.setCenter(newCenter);
  };

  var toggleInfoBubble = function(map) {
    if(bubbleOpen) {
      infoBubble.close();
      bubbleOpen = false;
    } else {
      infoBubble.open(map, marker);
      bubbleOpen = true;
      offsetCenter(map,marker.getPosition(),0, -150);
    }
  };

  var addInfoBubble = function(map, imgSrc, address) {
    var bubbleContent = '<div class="info-bubble">'+
      '<img src="'+imgSrc+'" />'+
      '<p class="address">'+address+'</p>'+
      '</div>';

    var infoBubbleOptions = {
      content: bubbleContent,
      maxWidth: bubbleWidth,
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
    };

    return new InfoBubble(infoBubbleOptions);
  };

  var addMarker = function(map, active, LatLng) {
    var lat = LatLng.G;
    var lng = LatLng.K;
    var image = {
      url: '../img/parking.png',
      size: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    if(marker) {
      infoBubble.close();
      marker.setMap(null);
    }
    
    marker = new google.maps.Marker({
      active: active,
      position: LatLng,
      icon: image,
      animation: google.maps.Animation.DROP,
      map: map
    });

    var imgSrc = 'https://maps.googleapis.com/maps/api/streetview?size='+bubbleWidth+'x'+bubbleWidth+'&location='+lat+','+lng+'&fov=120&heading=235&pitch=10';

    Geocoder.parseLatLng(lat,lng)
    .then(function(addressInfo) {
      var addressComponents = addressInfo.address_components;
      var address = addressComponents[0].long_name + ' ' + addressComponents[1].long_name;

      infoBubble = addInfoBubble(map,imgSrc,address);

      angular.element(infoBubble.content_).on('click',function() {
        toggleInfoBubble(map);
      });

      google.maps.event.addListener(marker, 'click',function() {
        toggleInfoBubble(map);
      });

      google.maps.event.addListener(map, 'click', function () {
        infoBubble.close();
        bubbleOpen = false;
      });

    });

  };

  return {
    addMarker: addMarker
  };

}]);
