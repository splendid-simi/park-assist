import crimeByType from './../data/baseline.json'

exports.getCrimesByMonth = (crimeByType) => {
  let crimesByMonth = {};
  each(crimeByType, (crimes, index) => {
    each(crimes, (crime) => {
      let month = crime["date_occurred"].slice(5,7);
      if(!crimesByMonth[month]) {
        crimesByMonth[month] = {};
      }
      crimesByMonth[month]["total_crimes"] = (crimesByMonth[month]["total_crimes"] || 0) + 1;
    });
  });
  return crimesByMonth;
}

exports.getMonthlyAverage = (crimesByMonth) => {
  let year = new Date().getFullYear();
  each(crimesByMonth, (crimes, month) => {
    let daysInMonth = getDaysInMonth(month, year);
    crimes["average"] = Math.round(crimes["total_crimes"] / (daysInMonth * 3));
  });
  console.log('crimes by month with average:', crimesByMonth);
  return crimesByMonth;
}

exports.getDailyAverage = (crimesByMonth) => {
  let total = Object.keys(crimesByMonth).reduce((sum, key) => {
    return sum + crimesByMonth[key];
  }, 0);
  // divide by num of days in 3 years
  return Math.round(total / 1095);
}

const getDaysInMonth = (month,year) => {
    return new Date(year, month, 0).getDate();
}

const each = (collection, callback) => {
  if(Array.isArray(collection)) {
    for(var i = 0; i < collection.length; i++) {
      callback(collection[i], i, collection);
    }
  } else {
    for (var key in collection) {
      callback(collection[key], key, collection);
    }
  }
}

exports.getMonthlyAverage(exports.getCrimesByMonth(crimeByType));
// {
//   '01': 682,
//   '02': 498,
//   '03': 650,
//   '04': 630,
//   '05': 642,
//   '06': 618,
//   '07': 650,
//   '08': 624,
//   '09': 574,
//   '10': 616,
//   '11': 548,
//   '12': 594
// }

// 682 650 650 642 630 624 618 616 594 574 (Sept) 548 (Nov) 498 (Feb)
