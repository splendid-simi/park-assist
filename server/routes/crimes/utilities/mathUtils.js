import analyzeUtils from './analyzeUtils.js'

const utilities = {
  getCrimesByMonth(crimeByType) {
    let crimesByMonth = {};
    analyzeUtils.each(crimeByType, (crimes, index) => {
      analyzeUtils.each(crimes, (crime) => {
        let month = crime["date_occurred"].slice(5,7);
        if(!crimesByMonth[month]) {
          crimesByMonth[month] = {};
        }
        crimesByMonth[month]["total_crimes"] = (crimesByMonth[month]["total_crimes"] || 0) + 1;
      });
    });
    return crimesByMonth;
  },

  getMonthlyAverage(crimesByMonth) {
    let year = new Date().getFullYear();
    analyzeUtils.each(crimesByMonth, (crimes, month) => {
      let daysInMonth = analyzeUtils.getDaysInMonth(month, year);
      crimes["average"] = Math.round(crimes["total_crimes"] / (daysInMonth * 3));
    });
    console.log('crimes by month with average:', crimesByMonth);
    return crimesByMonth;
  },

  getDailyAverage(crimesByMonth) {
    let total = Object.keys(crimesByMonth).reduce((sum, key) => {
      return sum + crimesByMonth[key];
    }, 0);
    // divide by num of days in 3 years
    return Math.round(total / 1095);
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
