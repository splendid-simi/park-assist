var modal = angular.module('parkAssist.modal');

modal.controller('ModalController', ['Map', 'Geocoder', '$rootScope', '$scope', function(Map, Geocoder, $rootScope, $scope) {
  var ctrl = this;

  ctrl.isOpen = false;
  ctrl.searchTerm = '';

  var $input = $('.location-input');
  var input = $input[0];
  var $htmlBody = $('html, body');

  ctrl.closeModal = function(e) {

    var closeModal = function() {
      ctrl.isOpen = false;
    };

    if( e && e.target === input ) {
      return;
    }

    if(!e) {
      $scope.$apply(closeModal);
    } else {
      closeModal();
    }
    
    $htmlBody.removeClass('fixed');
    ctrl.searchTerm = '';
  };

  ctrl.openModal = function() {

    $scope.$apply(function() {
      ctrl.isOpen = true;
    });

    input.focus();
    $htmlBody.addClass('fixed');
  };

  ctrl.modalMessage = function(e, message) {
    ctrl.searchTerm = '';
    alertify.alert(message);
    input.focus();
  };

  ctrl.isValidDestination = function(place) {
    if( place.formatted_address.match(/Santa Monica/) ) {
      return true;
    }

    $rootScope.$broadcast('parkAssist:modalMessage', 'Please select a Santa Monica Location.');
    return false;
  };

  ctrl.initAutoComplete = function() {
    autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {country: 'us'}
    });
    autocomplete.bindTo('bounds', Map.getMap());

    google.maps.event.addListener(autocomplete, 'place_changed', function() {

      var place = autocomplete.getPlace();
      var $pacItemQuery = $('.pac-container .pac-item:first .pac-item-query');
      var address = $pacItemQuery.text() + ' ' + $pacItemQuery.next().text();

      if (place.geometry) {
        if( !ctrl.isValidDestination(place) ) {
          return;
        }

        ctrl.closeModal();
        Map.findSpot([place.geometry.location.H, place.geometry.location.L], true);
        return;
      }

      Geocoder.parseAddress(address)
      .then(function(place) {

        if( !ctrl.isValidDestination(place) ) {
          return;
        }

        ctrl.closeModal();
        Map.findSpot([place.geometry.location.lat(), place.geometry.location.lng()], true);
      })
      .catch(function (error) {
        modalMessage(null, error);
      });
    });
  };

  $scope.$on('parkAssist:initAutoComplete', ctrl.initAutoComplete);
  $scope.$on('parkAssist:closeModal', ctrl.closeModal);
  $scope.$on('parkAssist:openModal', ctrl.openModal);
  $scope.$on('parkAssist:modalMessage', ctrl.modalMessage);
  
}]);
