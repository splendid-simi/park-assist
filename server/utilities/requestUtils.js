const utilities = {
  send(res, status, body) {
    res.statusCode = status
    res.send(body)
  },
  handleRequestCallback(err, data, callback) {
    if (err) {
      console.log('error inside of getCrimes', err)
      return;
    }
    callback(null, data);
  }
}

export default utilities;
