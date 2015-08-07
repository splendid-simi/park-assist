angular.module('park.services', []) 

.factory('Comm', function ($http){
	var getspots = function (tuple) {
		console.log('services.js says: getspots called, tuple:', tuple);

		return $http({
			method: 'POST',
			url: '/api/getspots',
			data: tuple
		})
		.then(function(resp) {
			console.log('services.js says: POST successful. response:',resp);
			return 0;
		});
	}

	return {
		getspots: getspots
	}
});