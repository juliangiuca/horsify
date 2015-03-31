'use strict';

var gm         = require('gm');
var Horse      = require('./horse');
var im         = require('./im.js');
var log        = require('./logging.js');
var fetchByUrl = require('./fetchByUrl.js');

var _process = function (faceBuffer, orientation) {
  if (orientation === undefined) { orientation = 'right'; }

  return im.findFace(faceBuffer)
  .then(function (faces) {
    var pic = gm(faceBuffer).options({imageMagick: true});

    var maxWidth = 1024 * faces.length;

    for (var i=0; i<faces.length; i++) {

      var horse = new Horse(faces[i], orientation);

      pic.out(horse.src);
      pic.out('-geometry');
      pic.out(horse.position());
      pic.out('-composite');

    }

    // If the picture is too large, the horse looks silly. 
    // Resize it down to 1024xnumber of peeps
    return pic.resize(maxWidth + '>');
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
  }).fail(function (err) {
    log.error('Probably not an image');
    log.error(err);
    throw new Error(err);
  });

};

module.exports = {
  fetchByUrlAndProcess: fetchByUrlAndProcess,
  byImage: byImage
}
