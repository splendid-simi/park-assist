import requestUtils from './../../../utilities/requestUtils'
import baseline from './../init/initCrimes.js'

const utilities = {
  handleSortCrimes(err, data) {
    requestUtils.handleRequestCallback(err, data, baseline.sortCrimes);
  },
  handleWriteCrimes(err, data) {
    requestUtils.handleRequestCallback(err, data, baseline.requestMoreCrimes);
  },

  handleInitCrimes(err, data, res) {
    if(err) {
      console.log('error getting data:', err);
      requestUtils.send(res, 500, { error: 'Baseline Data Could Not Be Initialized.' });
      return;
    }
    requestUtils.send(res, 200, { message: 'Baseline Crime Data Initialized' });
  }
}

export default utilities;
