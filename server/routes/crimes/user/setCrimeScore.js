import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'

import request  from 'request'
import moment from 'moment'

import distanceUtils from './../utilities/distanceUtils.js'
import mathUtils from './../utilities/mathUtils.js'
import queryUtils from './../utilities/queryUtils.js'
import requestUtils from './../../../utilities/requestUtils.js'
import hasValidUCRCode from './../data/crimeratings.json'
import dummyCrimeDate from './../data/baseline.json'

let fb = new Firebase(fb_keys.url);
let radius = 321.869;
let destLoc;
let destSquareMiles = 517998;
let baselineScore;
let userkey;

const getUserCoords = (childSnapshot, prevChildKey) => {
  // let user = childSnapshot.val();
  // let userKey = childSnapshot.key();

  // calculateDestCoords({"lat": user.latitude, "lon": user.longitude}, radius);
  destLoc = distanceUtils.calculateDestCoords({"lat": 34.027116, "lon": -118.486634 }, radius);

  if(destLoc) {
    // getCrimes();
    compareCrimeScore();
  }
}

// get crimes that have occurred in past year near dest. location
const getCrimes = () => {
  let url = queryUtils.buildQuery(false, destLoc);

  request(url, (err, response, body) => {
    requestUtils.handleRequestCallback(err, JSON.parse(body), compareCrimeScores);
  });
}

const getCrimeScore = (crimes) => {
  let crimesByMonth = mathUtils.getCrimesByMonth(crimes);
  let monthlyAverage = mathUtils.getMonthlyAverage(crimesByMonth,1);

  return monthlyAverage;
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

getBaselineScore();

export default getUserCoords;
