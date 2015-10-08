var modal = angular.module('parkAssist.modal');

modal.controller('ModalController', ['Map', 'Geocoder', '$rootScope', '$scope', function(Map, Geocoder, $rootScope, $scope) {
  var ctrl = this;

  ctrl.isOpen = false;
  ctrl.searchTerm = '';

  var $input = $('.location-input');
  var input = $input[0];
  var $htmlBody = $('html, body');

  ctrl.closeModal = function(e) {
    if( e && e.target === input ) {
      return;
    }

    $htmlBody.removeClass('fixed');

    $scope.safeApply(function() {
      ctrl.isOpen = false;
      ctrl.searchTerm = '';
    });
  };

  ctrl.openModal = function() {
    $htmlBody.addClass('fixed');

    $scope.safeApply(function() {
      ctrl.isOpen = true;
    });

    setTimeout(function() {
      input.focus();
    }, 0);
  };

  ctrl.modalMessage = function(e, message) {
    $scope.safeApply(function() {
      ctrl.searchTerm = '';
    });

    alertify.alert(message);
    
    setTimeout(function() {
      input.focus();
    }, 0);
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

        Map.findSpot([place.geometry.location.lat(), place.geometry.location.lng()], true);
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
        ctrl.modalMessage(null, error);
      });
    });
  };

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if( phase == '$apply' || phase == '$digest' ) {
      this.$eval(fn);
    } else {
      this.$apply(fn);
    }
  };

  $scope.$on('parkAssist:initAutoComplete', ctrl.initAutoComplete);
  $scope.$on('parkAssist:closeModal', ctrl.closeModal);
  $scope.$on('parkAssist:openModal', ctrl.openModal);
  $scope.$on('parkAssist:modalMessage', ctrl.modalMessage);
  
}]);
