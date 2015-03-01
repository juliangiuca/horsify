'use strict';

var Horse   = require('./horse');
var gm      = require('gm');
var request = require('request');
var im      = require('./im.js');
var Q       = require('q');
var log     = require('./logging.js');


var _process = function (faceData, orientation) {
  if (orientation === undefined) { orientation = 'right'; }

  return im.findFace(faceData)
  .then(function (faces) {
    var pic = gm(faceData).options({imageMagick: true});

    for (var i=0; i<faces.length; i++) {

      var horse = new Horse(faces[i], orientation);

      pic.out(horse.src);
      pic.out('-geometry');
      pic.out(horse.position());
      pic.out('-composite');

    }

    return pic;
  }).fail(function (err) {
    log.error(err);
    log.error(err.stack);
  })

}

var byImage = _process;

var _fetchUrl = function (url) {
  var deferred = Q.defer();

  var bufs = [];
  var options = {};
  options.url = url;
  options.timeout = 1000; // 1second timeout
  options.followRedirect = 3;
  options.method = 'GET';

  log.info('fetching', url);
  var req = request.get(options);

  req.on('data', function(d) { 
    bufs.push(d);
  });

  req.on('end', function(){
    log.info('done fetching', url);
    deferred.resolve(Buffer.concat(bufs));
  });

  return deferred.promise;
}

var fetchByUrl = function (url, orientation) {
  return _fetchUrl(url)
  .then(function (buf) {
    log.info('processing');
    return _process(buf, orientation);
  })

};

//horsify(process.argv[2], process.argv[3]);
//debugImage(process.argv[2]);
//byUrl(process.argv[2], process.argv[3]);


module.exports = {
  fetchByUrl: fetchByUrl,
  byImage: byImage
}
