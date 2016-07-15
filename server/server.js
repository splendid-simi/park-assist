import express from 'express'
import http from 'http'
import Firebase from 'firebase'
import middleware from './config/middleware.js'

import initMeters from './routes/meters/init/initmeters.js'
import crimes from './routes/crimes/init/initcrimes.js'
import setMeters from './routes/meters/user/setMeters.js'

const fb_keys = process.env.URL || require('./config/keys.js').url;
let fb = new Firebase(fb_keys);

const app = express();
middleware(app, express);

const port = process.env.PORT || 8080;

// initalize MeterParkingSpots Collection and hydrate with Santa Monica API parking meters
app.get('/api/crimes/init', crimes.initCrimes);
app.get('/api/parking/init', initMeters);

//Listen for a new user session and adds a user entry on firebase in the Users database
fb.child('Users').on('child_added', setMeters);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log("Running on port: ", port);
});

export default app;
