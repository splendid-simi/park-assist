var Firebase = require('firebase');
var fb_keys = process.env.URL || require('./../config/keys.js').url;
var firedb = new Firebase(fb_keys);

module.exports = {
  getCrimes: function() {
    fb.child('Crimes').once('value', function(crime) {
       crime.val();
     }, function(err) {
        deferred.reject(err.code);
     });
  },
  getParkingMeters: function() {
    firedb.child('Metered Parking Spots').once('value', function(meters) {
      meters.val();
    }, function(err) {
      err.code;
      console.log("The read failed:", err.code);
    });
  }
}
