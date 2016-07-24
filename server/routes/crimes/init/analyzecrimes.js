import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'

import crimeByType from './../data/baseline.json'
import analyzeUtils from './../utilities/analyzeUtils.js'
import mathUtils from './../utilities/mathUtils.js'

let fb = new Firebase(fb_keys.url);

const getBaselineScore = () => {
  let crimesByMonth = mathUtils.getCrimesByMonth(crimeByType);
  console.log('crimesByMonth:', crimesByMonth)
  let monthlyAverageDailyCrimes = mathUtils.getDailyAverageByMonth(crimesByMonth, 3); // init crimes line 38 uses the past 3 years
  let perSqMile = mathUtils.getCrimesPerSquareMile(monthlyAverageDailyCrimes, 8.461); // 8.461 miles sqaured is the total area of Santa Monica City)
   //console.log('per Sq Mile:', perSqMile)
  setBaselineScore(monthlyAverageDailyCrimes, perSqMile);
}

const setBaselineScore = (monthly, perSqMile) => {
  // store array of monthly averages in fb
  fb.child('Baseline').child('Score').set({
    "monthly": monthly
  });
}

export default getBaselineScore;
