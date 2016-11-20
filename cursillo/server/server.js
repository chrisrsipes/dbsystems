var express = require('express');

var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var accounts = require('./routing/accounts');
var positions = require('./routing/positions');

var port = 8080;

// app.use(express.static(path.join(__dirname, '/../client')));

/* GET home page for client side app */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/../client')));
app.use(express.static(path.join(__dirname, '/../swagger/dist')));

app.get('/', function (req, res) {
  res.status(200).sendFile(path.join(__dirname+'/../client/index.html'));
});
app.get('/explorer/', function (req, res) {

  res.status(200).sendFile(path.join(__dirname+'/../swagger/dist/index.html'));
});

app.use('/api/accounts', accounts);
app.use('/api/positions', positions);


app.listen(port, function () {
  console.log('listening on port ' + port);
});

module.exports = app;
