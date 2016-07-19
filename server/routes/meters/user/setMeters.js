import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'
import parkingUtils from './../utilities/parkingUtils.js'

let fb = new Firebase(fb_keys.url);

let user;
let userKey;

const getSpots = (childSnapshot, prevChildKey) => {
  user = childSnapshot.val();
  userKey = childSnapshot.key();

  fb.child('MeteredParkingSpots').once('value', (parkingSpots) => {
    let pSpots = parkingSpots.val(); // get all parking meters
    getSpotsNearby(pSpots, user.range, [user.latitude, user.longitude]);
  });
}

const getSpotsNearby = (pSpots, radius, tuple) => {
  let freeSpots = {};
  let counter = 0;

  for (var key in pSpots) {
    let displacement = parkingUtils.getDistance(tuple[0], tuple[1], pSpots[key].latitude, pSpots[key].longitude);

    // if parking spot is in range
    if (displacement < radius) {
      pSpots[key].distance = displacement;
      if (pSpots[key].mostRecentEvent === 'SE' && counter <= 15) {
        freeSpots[key] = pSpots[key];
        counter++;
      }
    }
  }
  //add list of recomendations to User in database
  console.log('free spots:', freeSpots);
  setSpots(freeSpots);
}

const setSpots = (freeSpots) => {
  fb.child('Users').child(userKey).child('Recommendations').set(freeSpots);
}

export default getSpots;
