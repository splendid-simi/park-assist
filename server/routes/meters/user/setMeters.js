import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'
import parkingUtils from './../utilities/parkingUtils.js'

let fb = new Firebase(fb_keys.url);

const setLocationParking = (childSnapshot, prevChildKey) => {
  let user = childSnapshot.val();
  let userKey = childSnapshot.key();

  //Use the user's coordinates to get a list of feasible spots
  let radius = user.range;
  let tuple = [user.latitude, user.longitude];

  //get spots
  fb.child('MeteredParkingSpots').once('value', (parkingSpots) => {
    let pSpots = parkingSpots.val(); // get all parking meters
    let closeSpots = [];
    let freeSpots = {};

    for (var key in pSpots) {
      let displacement = parkingUtils.getDistance(tuple[0], tuple[1], pSpots[key].latitude, pSpots[key].longitude);
      // if parking spot is in range
      if (displacement < radius) {
        pSpots[key].distance = displacement;
        if (pSpots[key].mostRecentEvent === 'SE') {
          freeSpots[key] = pSpots[key];
        }
      }
    }
    //add list of recomendations to User in database
    console.log('free spots:', freeSpots);
    fb.child('Users').child(userKey).child('Recommendations').set(freeSpots);
  });
}

export default setLocationParking;
