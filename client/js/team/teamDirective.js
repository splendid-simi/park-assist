var team = angular.module('parkAssist.team');

team.directive('team', [function() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'TeamController as team',
    templateUrl: 'js/team/teamTemplate.html'
  };
}]);