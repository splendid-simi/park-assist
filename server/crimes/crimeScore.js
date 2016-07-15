import Firebase from 'firebase'
import fb_keys from './../config/keys.js'
import geolib from './../lib/geolib.js'
import geodesy from 'geodesy'
import request  from 'request'
import moment from 'moment'

import hasValidUCRCode from './data/crimeratings.json'

let fb = new Firebase(fb_keys.url);
let LatLon = geodesy.LatLonSpherical;
let radius = 321.869;
let destLoc;

const getUserCoords = (childSnapshot, prevChildKey) => {
  // let user = childSnapshot.val();
  // let userKey = childSnapshot.key();

  // calculateDestCoords({"lat": user.latitude, "lon": user.longitude});
  calculateDestCoords({"lat": 34.027116, "lon": -118.486634 });
}

const calculateDestCoords = (destCoords) => {
  // calculate the NW and SW corners
  let northLoc = getDestPoint(destCoords, radius, 0);
  let southLoc = getDestPoint(destCoords, radius, 90);
  let northwest = getDestPoint({"lat": northLoc.lat, "lon": destCoords.lon}, radius, 270);
  let southeast = getDestPoint({"lat": destCoords.lat,  "lon": southLoc.lon}, radius, 180);

  destLoc = [
    northwest.lat,
    northwest.lon,
    southeast.lat,
    southeast.lon
  ]
  getCrimes();
}

// calc destination using haversine formula
const getDestPoint = (coords, radius, bearing) => {
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
      setCrimeScores(body);
  });
}

  const buildCrimeQuery = () => {
    let url = 'https:\/\/data.smgov.net/resource/kn6p-4y74.json?'
    let date = '$where=date_occurred > ' + '"' + (new Date().getFullYear() - 3) + '-01-01' + '"'
    let coords = '';

    if(destLoc) {
      coords = 'within_box(map_point,' + destLoc + ')&$order=date_occurred desc';
    }

    return url + date + ' AND ' + coords;
  }

  const setCrimeScores = (crimes) => {
    let vehicleSafetyScore = 0;
    let personalSafetyScore = 0;
    let numPersonalCrimes = 0;
    let numVehicleCrimes = 0;

    crimes.forEach((crime) => {
      // if type of crime could affect parking safety
      let crimeList = {};
      let ucrCode = crime.ucr.slice(0,2);
      let validCrimeType = hasValidUCRCode[crime.ucr] || hasValidUCRCode[ucrCode];

      if(validCrimeType && crime.map_point) {
        let dateRange = getDateScore(crime.date_occurred);
        let safetyRating = validCrimeType["personal-danger-rating"] || validCrimeType["vehicle-danger-rating"];

        let crimeScore = (safetyRating * 0.6) + (dateRange * 0.4);

        if(validCrimeType["personal-danger-rating"]) {
          personalSafetyScore += crimeScore;
          numPersonalCrimes++;
        } else {
          vehicleSafetyScore += crimeScore;
          numVehicleCrimes++;
        }
      }
    });

      vehicleSafetyScore = Math.round(vehicleSafetyScore / numVehicleCrimes);
      personalSafetyScore = Math.round(personalSafetyScore / numPersonalCrimes);
      console.log('vehicleSafetyScore after', vehicleSafetyScore, 'personalSafetyScore', personalSafetyScore);
     // score of each crime averaged to composite score
    //  fb.child('Users').child(userKey).child('Crime').update({
    //    "vehicleSafetyScore": vehicleSafetyScore,
    //    "personalSafetyScore": personalSafetyScore
    //  });
  }

  const getDateScore = (crime) => {
      let crimeDate = crime.slice(0,10);
      let highCrimePeriod = moment().add('weeks', 1).format('YYYY MM DD');
      let midCrimePeriod = moment().add('months', 6).format('YYYY MM DD');

      if(crimeDate < highCrimePeriod) {
        console.log('inside 3');
        return 3;
      } else if(crimeDate < midCrimePeriod) {
        console.log('inside 2');
        return 2;
      } else {
        console.log('inside 1');
        return 1;
      }
  }

export default setCrimeScores;
