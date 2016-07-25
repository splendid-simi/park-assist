import Firebase from 'firebase'
import fb_keys from './../../../config/keys.js'

import crimeByType from './../data/baseline.json'
import analyzeUtils from './../utilities/analyzeUtils.js'
import mathUtils from './../utilities/mathUtils.js'

let fb = new Firebase(fb_keys.url);

const santaMonicaArea = 8.461 // 8.461 miles sqaured is the total area of Santa Monica City

const getBaselineScore = () => {
  let years = 3 //the number of years we are normalizing the data to
  let crimesByMonth = mathUtils.getCrimesByMonth(crimeByType);
  let monthlyAverageDailyCrimes = mathUtils.getDailyAverageByMonth(crimesByMonth, years); // init crimes line 38 uses the past 3 years
  let monthlyCrimesPerSqMile = mathUtils.getCrimesPerSquareMile(monthlyAverageDailyCrimes, santaMonicaArea);

  // for data by year
  let yearly = {};
  let totalCrimes = 0;
  analyzeUtils.each(crimesByMonth, (month) => {
    totalCrimes += month.total_crimes;
  })
  yearly.total_crimes = totalCrimes
  yearly.averageDailyCrimes = totalCrimes/(years*365)
  yearly.crimesPerSqMile = yearly.averageDailyCrimes/santaMonicaArea


  setBaselineScore(monthlyCrimesPerSqMile, yearly);
}

const setBaselineScore = (monthly, yearly) => {
  // store array of monthly averages in fb
  fb.child('Baseline').child('Score').set({
    "monthly": monthly,
    "yearly": yearly
  });
}

export default getBaselineScore;
