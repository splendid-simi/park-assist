import Firebase from 'firebase'
import fb_keys from './../config/keys.js'
import geolib from './../lib/geolib.js'
import geodesy from 'geodesy'
import request  from 'request'
import moment from 'moment'

let fb = new Firebase(fb_keys.url);
let LatLon = geodesy.LatLonSpherical;
let radius = 321.869;
let destLoc;

const getUserCoords = (childSnapshot, prevChildKey) => {
  // let user = childSnapshot.val();
  // let userKey = childSnapshot.key();

  // calculateDestCoords({"lat": user.latitude, "lon": user.longitude});
  calculateDestCoords({"lat": 34.019269, "lon": -118.494344});
}

const calculateDestCoords = (destCoords) => {
  console.log('destCoords:', destCoords);
  // calculate the NW and SW corners
  let northLoc = calcDestPoint(destCoords, radius, 0);
  let southLoc = calcDestPoint(destCoords, radius, 90);
  let northwest = calcDestPoint({"lat": northLoc.lat, "lon": destCoords.lon}, radius, 270);
  let southeast = calcDestPoint({"lat": destCoords.lat,  "lon": southLoc.lon}, radius, 180);

  destLoc = [
    northwest.lat,
    northwest.lon,
    southeast.lat,
    southeast.lon
  ]
  // getCrimes();
}

// calc destination using haversine formula
const calcDestPoint = (coords, radius, bearing) => {
  let loc = new LatLon(coords.lat, coords.lon);
  let destPoint = loc.destinationPoint(radius, bearing);

  console.log('destPoint:', destPoint);
  return destPoint;
}

// get crimes that have occurred in past year near dest. location
const getCrimes = () => {
  let url = buildCrimeQuery(destLoc);
  request(url, (error, response, body) => {
    if(error) {
      console.log('Error getting data. Error:', error);
      res.sendStatus(500);
    }
      body = JSON.parse(body);
      console.log('body of get Crimes:', body);
  });
}

  const buildCrimeQuery = () => {
    let url = 'https:\/\/data.smgov.net/resource/kn6p-4y74.json?'
    let date = '$where=date_occurred > ' + '"' + (new Date().getFullYear() - 1) + '-01-01' + '"'
    let coords = '';

    if(destLoc) {
      coords = 'within_box(map_point,' + destLoc + ')&$order=date_occurred desc';
    }

    console.log('query:', url + date + ' AND ' + coords);
    return url + date + ' AND ' + coords;
  }

  //  store crime score in User table in database
  //   fb.child('Users').child(userKey).child('Crime').set(crimeScore);
  // });

export default getUserCoords;
