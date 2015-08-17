var team = angular.module('parkAssist.team');

team.controller('TeamController', [function() {

  this.members = [
    {
      'name': 'Quinton Aiken',
      'github': 'https://github.com/qaiken',
      'linkedin': 'https://www.linkedin.com/in/quintonlouisaiken'
    },
    {
      'name': 'Raghav Abboy',
      'github': 'https://github.com/RaghavAbboy',
      'linkedin': 'https://www.linkedin.com/pub/raghav-abboy/63/894/ab0'
    },
    {
      'name': 'Kalisa Falzone',
      'github': 'https://github.com/KalisaFalzone',
      'linkedin': 'https://www.linkedin.com/in/kalisafalzone'
    },
    {
      'name': 'Rodolfo Yabut',
      'github': 'https://github.com/rodocite',
      'linkedin': 'https://www.linkedin.com/in/rodolfoyabut'
    }
  ];
  
}]);
