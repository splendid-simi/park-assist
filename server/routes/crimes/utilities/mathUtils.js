import analyzeUtils from './analyzeUtils.js'

const utilities = {
  // an object with months as keys and values are the total number of crimes over the last 3 years
  getCrimesByMonth(crimeByType) {
    let crimesByMonth = {};
    analyzeUtils.each(crimeByType, (crimes, index) => {
      analyzeUtils.each(crimes, (crime) => {
        //get month from the date occurred
        let month = crime["date_occurred"].slice(5,7);
        if(!crimesByMonth[month]) {
          crimesByMonth[month] = {};
        }
        crimesByMonth[month]["total_crimes"] = (crimesByMonth[month]["total_crimes"] || 0) + 1;
      });
    });
    return crimesByMonth;
  },

  // the number of crimes on average during a day in a given month
  getDailyAverageByMonth(crimesByMonth, averageBy) {
    let year = new Date().getFullYear();
    analyzeUtils.each(crimesByMonth, (crimes, month) => {
      let daysInMonth = analyzeUtils.getDaysInMonth(month, year);
      crimes["averageCrimesPerDay"] = crimes["total_crimes"] / (daysInMonth * averageBy);
    });
    console.log('crimes by month with average:', crimesByMonth);
    return crimesByMonth;
  },

  // average number of crimes per day independent of month
  getDailyAverage(crimesByMonth, averageBy) {
    console.log('crimesbyMonth:', JSON.stringify(crimesByMonth));
    let total = Object.keys(crimesByMonth).reduce((sum, key) => {
      return sum + crimesByMonth[key]["total_crimes"];
    }, 0);
    console.log('daily average:', total, Math.round(total / averageBy))
    // divide by num of days in 3 years
    return Math.round(total / averageBy);
  },

  getCrimesPerSquareMile(months, squareMiles) {
    console.log('months line 43', months)
    analyzeUtils.each(months, (month) => {
      month.perSqMile = (month.averageCrimesPerDay)/squareMiles
    });
    return months;
  },

  crimeOccurredin72Hours(crimes) {
    let startRange = utilities.getDate(1);
    let endRange = utilities.getDate(3);
    let flag = false;
    console.log(startRange, endRange)
    analyzeUtils.each(crimes, (crime) => {
      if(crime >= startRange && crime <= endRange)
        flag = true;
    });

    return flag;
  },

  getDate(offset) {
    var date = new Date();
    date.setDate(date.getDate() - offset);

    return date;
   }
}

export default utilities;
