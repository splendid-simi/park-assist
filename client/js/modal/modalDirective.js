var modal = angular.module('parkAssist.modal');
var alertify = require('alertify');

modal.directive('modal', ['Map', 'Geocoder', '$rootScope', function(Map, Geocoder, $rootScope) {

  var $modal, $input, input;
  var $htmlBody = $('html,body');

  var closeModal = function() {
    $htmlBody.removeClass('fixed');
    $modal.removeClass('modal-open');
    input.value = '';
  };

  var openModal = function() {
    $modal.addClass('modal-open');
    $htmlBody.animate({
      scrollTop: 0
    }, 500, 'swing', function() {
      $htmlBody.addClass('fixed');
    });
    input.focus();
  };

  var modalMessage = function(e, message) {
    input.value = '';
    alertify.alert(message);
    input.focus();
  };

  var isValidDestination = function(place) {
    if( place.formatted_address.match(/Santa Monica/) ) {
      return true;
    }

    $rootScope.$broadcast('parkAssist:modalMessage', 'Please select a Santa Monica Location.');
    return false;
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

        closeModal();
        Map.findSpot([place.geometry.location.G, place.geometry.location.K], true);
        return;
      }

      Geocoder.parseAddress(address)
      .then(function(place) {

        if( !isValidDestination(place) ) {
          return;
        }

        closeModal();
        Map.findSpot([place.geometry.location.lat(), place.geometry.location.lng()], true);
      })
      .catch(function (error) {
        modalMessage(null, error);
      });
    });
  };

  var link = function(scope, el, attrs) {
    $modal = $(el);
    $input = $modal.find('.location-input');
    input = $input[0];

    $modal.on('click',function(e) {
      if( e.target === input ) {
        return;
      }
      closeModal();
    });

    initAutoComplete();

    scope.$on('parkAssist:closeModal', closeModal);
    scope.$on('parkAssist:openModal', openModal);
    scope.$on('parkAssist:modalMessage', modalMessage);
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/modal/modalTemplate.html',
    link: link
  };

}]);