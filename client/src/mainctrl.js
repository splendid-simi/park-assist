angular.module('park', ['park.services'])
.controller("mainController", ['Comm', function (Comm) {
	var main = this;
	
	main.latitude = 0;
	main.longitude = 0;

	main.submit = function() {
		console.log("main.submit says: Co ordinates entered: (", main.latitude, ',', main.longitude, ')');
		Comm.getspots([main.latitude, main.longitude]);
	}
}]);