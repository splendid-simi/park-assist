angular.module('park', ['park.services', 'firebase'])
.controller("mainController", ['Comm', function (Comm) {
	var main = this;
	
	main.latitude = 0;
	main.longitude = 0;

	//Firebase Interactivity
	// main.firedb = new Firebase('https://px7n504ycdj.firebaseio-demo.com/');

	main.submit = function() {
		console.log("main.submit says: Co ordinates entered: (", main.latitude, ',', main.longitude, ')');
		
		//Comm.getspots([main.latitude, main.longitude]);
		Comm.init();

	}


}]);