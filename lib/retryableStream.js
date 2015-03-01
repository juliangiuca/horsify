'use strict';
var log         = require('./logging.js');
var imageLoader = require('./imageLoader.js');

var _loadImageWithRetry = function(stream, res, counter) {
  var maxRetry = 9;

  stream.on('error', function (error) {
    log.error('Try', counter, 'Caught fs streaming err:', error);

    var newStream = (counter < maxRetry) ? 'imageByPath' : 'errorImage';

    setTimeout(function () {
      //Meta-laming to call either imageLoader.imageByPath or imageLoader.errorImage
      //depending on how many times we have retried
      _loadImageWithRetry(imageLoader[newStream](stream.path), res, counter + 1);
    }, 1000);
  });

  //res.writeHead(200, {'Content-Type': 'image/jpg' });
  stream.pipe(res);
}

module.exports = _loadImageWithRetry;
