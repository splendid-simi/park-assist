import express from 'express'
import http from 'http'
import Firebase from 'firebase'

import middleware from './config/middleware.js'
import initMeters from './meters/initmeters.js'
import initCrimes from './crimes/initcrimes.js'
import setLocationParking from './meters/setParking.js'

const fb_keys = process.env.URL || require('./config/keys.js').url;
let fb = new Firebase(fb_keys);
let usersRef = fb.child('Users');

const app = express();
middleware(app, express);

const port = process.env.PORT || 8080;

// initalize MeterParkingSpots Collection and hydrate with Santa Monica API parking meters
app.get('/api/init/crimes', initCrimes);
app.get('/api/init/parking', initMeters);

//Listen for a new user session and adds a user entry on firebase in the Users database
usersRef.on('child_added', setLocationParking);

// SetCrimeScore(crimeData);
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log("Running on port: ", port);
});

export default app;
