angular.module('park', ['park.services', 'firebase'])
.controller("mainController", ['Comm', function (Comm) {
	var main = this;
	
	//change to 0
	main.latitude = 34.018574;
	main.longitude = -118.486929;
	main.range = 0.25;

	//Firebase Interactivity
	// main.firedb = new Firebase('https://px7n504ycdj.firebaseio-demo.com/');

	main.submit = function() {
		console.log("main.submit says: Co ordinates entered: (", main.latitude, ',', main.longitude, ')');
		
		Comm.getspots([main.latitude, main.longitude],main.range);
		//Comm.init();

	}


}]);