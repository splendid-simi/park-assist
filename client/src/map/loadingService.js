var map = angular.module('parkAssist.map');

map.factory('Loading', [function() {
  var $loading, $loadingText;

  var init = function(loadingEl, loadingTextEl) {
    $loading = loadingEl;
    $loadingText = loadingTextEl;
  };

  var changeText = function(text) {
    $loadingText.text(text);
  };

  var show = function() {
    $loading.addClass('show');
  };

  var hide = function() {
    $loading.removeClass('show');
  };

  return {
    init: init,
    changeText: changeText,
    show: show,
    hide: hide
  };
}]);