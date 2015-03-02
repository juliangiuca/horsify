'use strict';
var log         = require('./logging.js');
var imageLoader = require('./imageLoader.js');
var redis        = require('./redis.js');

var _loadImageWithRetry = function(stream, sha, res) {

  stream.on('error', function (error) {
    log.error('Caught fs streaming err:', error);
    stream.unpipe();

    // A file can be pending, and that state is stored in Redis
    // Otherwise, it exists in the FS, or it doesn't exist.
    redis.get(sha, function (err, exists) {
      log.info('[redis -', sha + ']', 'exists:', !!exists);
      if (exists === 'pending') {
        setTimeout(function () {
          //Metacoding to call either imageLoader.imageByPath or imageLoader.errorImage
          //depending on how many times we have retried
          _loadImageWithRetry(imageLoader.findBySha(sha), sha, res);
        }, 1000);
      } else if (exists === 'bad') {
        res.redirect('/bad');
      } else {
        res.redirect('/404');
      }
    })
  });

  //res.writeHead(200, {'Content-Type': 'image/jpg' });
  stream.pipe(res);
}

module.exports = _loadImageWithRetry;
