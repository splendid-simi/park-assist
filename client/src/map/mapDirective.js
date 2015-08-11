var map = angular.module('parkAssist.map');

map.directive('map', ['Map', 'Loading', 'Modal', function(Map, Loading, Modal) {

  var loadMap = function(scope, element, attrs) {
    var $el = $(element);
    var mapCanvas = $el.find('#map-canvas')[0];
    var $loading = $el.find('.loading');
    var $loadingText = $el.find('.loading-text');
    var $changeDest = $el.find('.change-destination');

    $changeDest.on('click',function(e) {
      Modal.open();
    });

    Loading.init($loading,$loadingText);

    google.maps.event.addDomListener(window, 'load', function() {
      Map.init(mapCanvas)
      .then(function(map) {
        Loading.changeText('Finding your location...');
        Loading.show();
        Modal.initAutoComplete();
      });
    });
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
