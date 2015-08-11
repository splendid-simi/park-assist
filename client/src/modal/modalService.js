var modal = angular.module('parkAssist.modal');

modal.factory('Modal', ['Map', 'Geocoder', function(Map, Geocoder) {

  var $changeDest, $modal, input, autocomplete;

  var initModal = function(el) {
    $modal = $(el);

    input = $modal.find('.location-input')[0];

    $modal.on('click',function(e) {
      if( e.target === input ) {
        return;
      }
      close();
    });
  };

  var close = function() {
    $modal.removeClass('modal-open');
    input.value = '';
  };

  var open = function() {
    $modal.addClass('modal-open');
  };

  var initAutoComplete = function() {
    autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {country: 'us'}
    });
    autocomplete.bindTo('bounds', Map.getMap());

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      var firstResult = $('.pac-container .pac-item:first').text();

      if (place.geometry) {
        close();
        Map.findSpot([place.geometry.location.G, place.geometry.location.K]);
        return;
      }

      Geocoder.parseAddress(address).then(function(tuple) {
        close();
        Map.findSpot(tuple);
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