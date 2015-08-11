var modal = angular.module('parkAssist.modal');
var alertify = require('alertify');

modal.factory('Modal', ['Map', 'Geocoder', function(Map, Geocoder) {

  var $changeDest, $modal, $input, input, autocomplete;

  var initModal = function(el) {
    $modal = $(el);

    $input = $modal.find('.location-input');
    input = $input[0];

    $modal.on('click',function(e) {
      if( e.target === input ) {
        return;
      }
      close();
    });
  };

  var isValidDestination = function(place) {
    if( place.formatted_address.match(/Santa Monica/) ) {
      return true;
    }

    input.value = '';
    alertify.alert('Please select a Santa Monica Location.');
    input.focus();
    return false;
  };

  var close = function() {
    $modal.removeClass('modal-open');
    input.value = '';
  };

  var open = function() {
    $modal.addClass('modal-open');
    input.focus();
  };

  var initAutoComplete = function() {
    autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {country: 'us'}
    });
    autocomplete.bindTo('bounds', Map.getMap());

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      var $pacItemQuery = $('.pac-container .pac-item:first .pac-item-query');
      var address = $pacItemQuery.text() + ' ' + $pacItemQuery.next().text();

      if (place.geometry) {
        if( !isValidDestination(place) ) {
          return;
        }

        close();
        Map.findSpot([place.geometry.location.G, place.geometry.location.K]);
        return;
      }

      Geocoder.parseAddress(address)
      .then(function(place) {

        if( !isValidDestination(place) ) {
          return;
        }

        close();
        Map.findSpot([place.geometry.location.lat(), place.geometry.location.lng()]);
      })
      .catch(function (error) {
        input.value = '';
        alertify.message(error);
        input.focus();
      });

    });
  };

  return {
    initModal: initModal,
    close: close,
    open: open,
    initAutoComplete: initAutoComplete
  };

}]);