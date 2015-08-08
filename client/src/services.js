angular.module('park.services', ['firebase']) 

.factory('Comm', function ($http){
	var getspots = function (tuple, range) {
		console.log('services.js says: getspots called, tuple:', tuple);

		return $http({
			method: 'POST',
			url: '/api/getspots',
			data: {
				location: tuple,
				range: range
			}
		})
		.then(function(resp) {
			console.log('services.js says: POST successful. response:',resp);
			return 0;
		});
	}

	var init = function () {
		console.log('services.js says: init called.');
		return $http({
			method: 'POST',
			url: '/api/init',
		})
		.then(function(resp) {
			console.log('services.js says: POST successful. response:',resp);
			return 0;
		});

	}

	return {
		getspots: getspots,
		init: init
	}
});