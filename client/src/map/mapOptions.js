var map = angular.module('parkAssist.map');

map.factory('MapOptions', [function() {
  return {
    zoom: 17,
    minZoom: 3,
    maxZoom: 25,
    center: {
      lat: 34.0219,
      lng: -118.4814
    },
    styles: [{
      "featureType": "all",
      "elementType": "geometry",
      "stylers": [{
        "color": "#d6d9dd"
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{
        "gamma": 0.01
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{
        "saturation": -31
      }, {
        "lightness": -33
      }, {
        "weight": 2
      }, {
        "gamma": 0.8
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry",
      "stylers": [{
        "saturation": "8"
      }]
    }, {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [{
        "saturation": "-4"
      }]
    }, {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{
        "lightness": 30
      }, {
        "saturation": 30
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "saturation": 20
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{
        "lightness": 20
      }, {
        "saturation": -20
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{
        "lightness": 10
      }, {
        "saturation": -30
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{
        "lightness": "-8"
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{
        "saturation": 25
      }, {
        "lightness": 25
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{
        "lightness": "0"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry.stroke",
      "stylers": [{
        "weight": "0.01"
      }, {
        "saturation": "5"
      }, {
        "lightness": "20"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "weight": "0.57"
      }, {
        "saturation": "-13"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "simplified"
      }, {
        "weight": "0.52"
      }, {
        "saturation": "-46"
      }, {
        "lightness": "-6"
      }, {
        "gamma": "0.47"
      }, {
        "hue": "#ff0000"
      }]
    }, {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{
        "lightness": -20
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{
        "hue": "#008bff"
      }, {
        "saturation": "23"
      }]
    }]
  };
}]);