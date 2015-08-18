var team = angular.module('parkAssist.team');

team.controller('TeamController', ['$http', function($http) {

  var team = this;

  $http.get('js/team/team.json').success(function(data) {
    team.members = data;
  });
  
}]);
