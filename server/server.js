import express from 'express'
import http from 'http'
import Firebase from 'firebase'

import middleware from './config/middleware.js'
import utilities from './utilities/utilities.js'
import initializeMeters from './init/initmeters.js'
import setLocationParking from './parking/setParking.js'

const fb_keys = process.env.URL || require('./config/keys.js').url;
let fb = new Firebase(fb_keys);
let usersRef = fb.child('Users');

const app = express();
middleware(app, express);

app.set('port', process.env.PORT || 8080);

// initalize MeterParkingSpots Collection and hydrate with Santa Monica API parking meters
app.get('/api/init', initializeMeters);

  //Listen for a new user session and adds a user entry on firebase in the Users database
usersRef.on('child_added', setLocationParking);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(app.get('port'), function() {
  console.log("Running on port ", app.get('port'));
});

export default app;
