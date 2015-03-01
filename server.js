'use strict';
require('newrelic');

var express     = require('express');
var app         = express();
var log         = require('./lib/logging.js');
var imageLoader = require('./lib/imageLoader.js');

app.set('view engine', 'jade');
app.use(require('express-bunyan-logger')());
app.use(require('express-bunyan-logger').errorLogger());

app.get('/url', function (req, res){
  // Take the url, turn it into a hash, save it to disk
  // then redirect the sha url
  var sha = imageLoader.findOrCreateByUrl(req.query.url, req.query.o);
  res.redirect('/' + sha);

});

// Show an image
app.get('/:sha', function (req, res) {
  var sha = req.params.sha;
  var stream = imageLoader.findBySha(sha);

  stream.on('error', function (error) {
    log.error('Caught', error);
    setTimeout(function () {
      res.redirect('/' + sha);
    }, 1000);
  });

  //res.writeHead(200, {'Content-Type': 'image/jpg' });
  stream.pipe(res);
});

app.get('/', function (req, res) {

  //console.log(req.query.url);
  res.send('hello world');
});

//app.post('/', function (req, res) {
//  var form = new formidable.IncomingForm();
//  form.uploadDir = "./tmp";
//  form.keepExtensions = true;
//
//  //horse.byImage('./chris.jpg', req.query.o)
//
//  form.on('end', function() {
//  });
//});

app.listen(3000, function () {
  log.info('server up');
});

