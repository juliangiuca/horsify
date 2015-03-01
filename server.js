'use strict';
require('newrelic');
var express     = require('express');
var app         = express();
var log         = require('./lib/logging.js');
var imageLoader = require('./lib/imageLoader.js');
var retryableStream = require('./lib/retryableStream.js');
var _ = require('lodash');

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
  retryableStream(imageLoader.findBySha(sha), res, 0);
});

app.get('/', function (req, res) {
  var images = [
    {url: 'http://www.wallpaperfo.com/thumbnails/detail/20120429/ellen%20page%202400x1800%20wallpaper_www.wallpaperfo.com_11.jpg', o: 'right'},
    {url: 'http://resources3.news.com.au/images/2009/11/30/1225805/212259-tony-abbott-091130.jpg', o: 'right'},
    {url: 'http://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg', o: 'left'}
  ]

  var pic = images[_.random(0, images.length-1)];
  res.redirect('/url?url=' + pic.url + '&o=' + pic.o );
});


app.listen(3000, function () {
  log.info('server up - log');
});

