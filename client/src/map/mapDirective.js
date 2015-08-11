var map = angular.module('parkAssist.map');
var mapOptions = require('./mapOptions');

map.directive('map', ['Comm', 'User', 'UserMarker', 'MeterMarkers', 'DirectionsDisplay', function(Comm, User, UserMarker, MeterMarkers, DirectionsDisplay) {
  var map, center, mapCanvas, $loading, $modal, $loadingText, input, autocomplete;

  var userInitialized = false;
  var range = 0.2;

  var initModal = function($el) {
    var $changeDest = $el.find('.change-destination');
    $modal = $el.find('.location-change-modal');

    $changeDest.on('click',function(e) {
      $modal.addClass('modal-open');
    });

    $modal.on('click',function(e) {
      if( e.target === input ) {
        return;
      }
      closeModal();
    });
  };

  var closeModal = function() {
    $modal.removeClass('modal-open');
    input.value = '';
  };

  var initAutoComplete = function() {
    autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {country: 'us'}
    });
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();

      if (place.geometry) {
        closeModal();
        findSpot([place.geometry.location.G, place.geometry.location.K]);
        return;
      }

      var firstResult = $(".pac-container .pac-item:first").text();
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({"address":firstResult}, function(results, status) {
        if ( status !== google.maps.GeocoderStatus.OK ) {
          return;
        }
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        closeModal();
        findSpot([lat,lng]);
      });
    });
  };

  var findSpot = function(tuple) {
    $loadingText.text('Finding you the best parking spot...');
    $loading.addClass('show');
    
    Comm.getspots(tuple,range)
    .then(function(spot) {
      console.log('mapDirective.js says: spot:', spot);
      
      // meter location
      var meterLoc = new google.maps.LatLng(spot[0],spot[1]);

      MeterMarkers.addMarker(map,true,meterLoc);

      if(userInitialized) {
        User.setDestination(meterLoc).then(function(directions) {
          $loading.removeClass('show');
        });
        return;
      }

      User.setDestination(meterLoc);
      
      User.watchPosition(map)
      .then(function(userLocation) {
        map.panTo(userLocation);
        $loadingText.text('Spot Found! Calculating Route...');
        return User.calcRoute();
      })
      .then(function(directions) {
        userInitialized = true;
        $loading.removeClass('show');
      });

    });
  };

  var initialize = function() {
    map = new google.maps.Map(mapCanvas, mapOptions);
    DirectionsDisplay.setMap(map);

    initAutoComplete();

    google.maps.event.addDomListener(map, 'idle', function() {
      center = map.getCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
    });

    $loadingText.text('Finding your location...');
    $loading.addClass('show');

    window.navigator.geolocation.getCurrentPosition(function(pos) {
      findSpot([pos.coords.latitude, pos.coords.longitude]);
    }, null);
  };

  var loadMap = function(scope, element, attrs) {
    var $el = $(element);

    mapCanvas = $el.find('#map-canvas')[0];
    input = $el.find('input')[0];
    $loading = $el.find('.loading');
    $loadingText = $el.find('.loading-text');
    
    initModal($el);

    google.maps.event.addDomListener(window, 'load', initialize);
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'src/map/mapTemplate.html',
    link: loadMap
  };
}]);

// Redirect:
// setTimeout(function(){
//   var meterLoc = new google.maps.LatLng(34.069409,-118.442925);
//   MeterMarkers.addMarker(map,true,meterLoc);
//   loadingText.text('Bummer! Spot taken. Redirecting you...');
//   loading.addClass('show');
//   User.setDestination(meterLoc).then(function(directions) {
//     loading.removeClass('show');
//   });
// },15000);
