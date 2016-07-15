import crimeByType from './../data/baseline.json'
import analyzeUtils from './../utilities/analyzeUtils.js'
import mathUtils from './../utilities/mathUtils.js'

exports.getBaselineScore = () => {
  let crimesByMonth = mathUtils.getCrimesByMonth(crimeByType);

  mathUtils.getMonthlyAverage(crimesByMonth);
  mathUtils.getDailyAverage(crimesByMonth);
}

console.log('crime occurred in 72:', mathUtils.crimeOccurredin72Hours(crimeByType));
// exports.getMonthlyAverage();

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
