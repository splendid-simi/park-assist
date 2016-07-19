import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'

import crimeByType from './../data/baseline.json'
import analyzeUtils from './../utilities/analyzeUtils.js'
import mathUtils from './../utilities/mathUtils.js'

let fb = new Firebase(fb_keys.url);

const getBaselineScore = () => {
  let crimesByMonth = mathUtils.getCrimesByMonth(crimeByType);
  let monthlyScore = mathUtils.getMonthlyAverage(crimesByMonth, 3);
  let dailyScore = mathUtils.getDailyAverage(crimesByMonth, 1095);

  setBaselineScore(monthlyScore, dailyScore);
}

const setBaselineScore = (monthly, daily) => {
  // store array of monthly averages in fb
  fb.child('Baseline').child('Score').set({
    "monthly": monthly,
    "daily": daily
  });
}

export default getBaselineScore;
