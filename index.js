var app = require('./server/server.js');

app.listen(app.get('port'), function() {
  console.log("Running on port ", app.get('port'));
});