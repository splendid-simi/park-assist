import Firebase from 'firebase'
import fb_keys from './../config/keys.js'
import geolib from './../lib/geolib.js'
import geodesy from 'geodesy'
import request  from 'request'

let fb = new Firebase(fb_keys.url);

const setCrimeScore = (childSnapshot, prevChildKey) => {
  // let user = childSnapshot.val();
  // let userKey = childSnapshot.key();

  let radius = 321.869 // user.range in meters
  let LatLon = geodesy.LatLonSpherical;
  let destLoc = {"lat": 34.019269, "lon": -118.494344} //{"lat": user.latitude, "lon": user.longitude};

  // calculate the NW and SW corners
  let northLoc = calcDestPoint(destLoc, radius, 0);
  let southLoc = calcDestPoint(destLoc, radius, 90);
  let NWCorner = calcDestPoint({"lat": northLoc.lat, "lon": destLoc.lon}, radius, 270);
  let SECorner = calcDestPoint({"lat": destLoc.lat,  "lon": southLoc.lon}, radius, 180);

  function calcDestPoint(coords, radius, bearing) {
    let loc = new LatLon(coords.lat, coords.lon);
    let destPoint = loc.destinationPoint(radius,bearing);

    console.log('destPoint:', destPoint);
    return destPoint;
  }

  //make request for crimes in past year
  //  https:data.smgov.net/resource/kn6p-4y74.json?$where=within_box(map_point, NWCorner.lat, NWCorner.lon, SECorner.lat, SECorner.lon)
  // calculate crime score based on crimes
  // const getCrimes = () => {
  //
  // }

  // var sodaQueryBox = [
  //   bbox._northEast.lat,
  //   bbox._southWest.lng,
  //   bbox._southWest.lat,
  //   bbox._northEast.lng
  // ];

  //  store crime score in User table in database
  //   fb.child('Users').child(userKey).child('Crime').set(crimeScore);
  // });
}

export default setCrimeScore;
