'use strict';

var gm         = require('gm');
var Horse      = require('./horse');
var im         = require('./im.js');
var log        = require('./logging.js');
var fetchByUrl = require('./fetchByUrl.js');


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


var fetchByUrlAndProcess = function (url, orientation) {
  return fetchByUrl(url)
  .then(function (buf) {
    log.info('processing');
    return _process(buf, orientation);
  });

};

module.exports = {
  fetchByUrlAndProcess: fetchByUrlAndProcess,
  byImage: byImage
}
