import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'

import request  from 'request'
import moment from 'moment'

import distanceUtils from './../utilities/distanceUtils.js'
import mathUtils from './../utilities/mathUtils.js'
import queryUtils from './../utilities/queryUtils.js'
import analyzeUtils from './../utilities/analyzeUtils.js'
import requestUtils from './../../../utilities/requestUtils.js'
import hasValidUCRCode from './../data/crimeratings.json'
import dummyCrimeData from './../data/baseline.json'

let fb = new Firebase(fb_keys.url);
let radius = 804.672; // .5 miles
let area = Math.pow(radius*2, 2) // the square meters of the area around the destination given a radius in meters
let destLoc;
let destSquareMiles = 517998;
let baselineScore;
let userkey;
let years = 3;
let santaMonicaArea =  8.461 * Math.pow(1609, 2)// 8.461 miles squared is the total area of Santa Monica City, 1 mile is 1,609 meters
let scaleFactor = santaMonicaArea/area // this tells us how much smaller the area we are looking at is compared with all of Santa Monica


const getUserCoords = (childSnapshot, prevChildKey) => {
  // let user = childSnapshot.val();
  // let userKey = childSnapshot.key();

  // calculateDestCoords({"lat": user.latitude, "lon": user.longitude}, radius);
  destLoc = distanceUtils.calculateDestCoords({"lat": 34.027116, "lon": -118.486634 }, radius);
  // SMC {"lat": 34.017819, "lon": -118.469659 }
  // ROC {"lat": 34.027116, "lon": -118.486634 }

  if(destLoc) {
    //getCrimes();
    //compareCrimeScore();
  }
}

// get crimes that have occurred in past year near dest. location
const getCrimes = () => {
  let url = queryUtils.buildQuery(false, destLoc);

  request(url, (err, response, body) => {
    requestUtils.handleRequestCallback(err, JSON.parse(body), getCrimeScore);
  });
}

const getCrimeScore = (crimes) => {
  //expects an array of objects each object representing one crime, currently the data is an object of crimes per crime type
  crimes = crimes || dummyCrimeData;
  console.log('crimes in getCrimeScore', crimes);
  let crimeInfo = {};
  let totalCrimes = 0;
  analyzeUtils.each(crimes, (crime) => {
    totalCrimes += 1;
  })
  crimeInfo.total_crimes = totalCrimes
  crimeInfo.averageDailyCrimes = totalCrimes/(years*365)
  crimeInfo.averageDailyCrimesScaledByArea = totalCrimes*scaleFactor //if all of Santa Monica was like this area there would be this many crimes per day


  console.log('crimeInfo is:', crimeInfo)

  //compareCrimeScore(averageDailyCrimesScaledbyArea);
}

const compareCrimeScore = (dest) => {
  let destScore = getCrimeScore(dest);
  // ************ LOGIC FOR COMPARING CRIME SCORES **********

  // // if current month has higher rate of crimes
  // let currentMonth = new Date().getMonth();
  // let baselineCrimesByMonth =  baseline[currentMonth] / destSquareMiles;
  //
  // if(dest[currentMonth] > baselineCrimesByMonth) {
  //   score *= 0.2;
  // }
  //
  // // heightened risk due to potential for crime clustering
  // if(mathUtils.crimeOccurredin72Hours(dest)) {
  //   score *= 0.2;
  // }
  //
  // must have user key defined in getUserCoords to work
  //
  // get the current month

  setCrimeScore(3);
}

const getBaselineScore = () => {
  // score of each crime averaged to composite score
   fb.child('Baseline').child('Score').on('value', function(snapshot) {
      baselineScore = snapshot.val();
  });
}

const setCrimeScore = (score) => {
// score of each crime averaged to composite score
 fb.child('Users').child(userKey).child('Crime').update({
   "SafetyScore": score
 });
}

//getBaselineScore();

export default getCrimeScore;
