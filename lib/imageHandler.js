'use strict';

var Horse   = require('./horse');
var gm      = require('gm');
var request = require('request');
var im      = require('./im.js');
var Q = require('q');
var _ = require('lodash');


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
    console.log(err);
    console.log(err.stack);
  })

}

var byImage = _process;

var _fetchUrl = function (url) {
  var deferred = Q.defer();

  var bufs = [];

  console.log('fetching', url);
  request.get(url)
  .on('data', function(d){ bufs.push(d); })
  .on('end', function(){
    console.log('done fetching', url);
    deferred.resolve(Buffer.concat(bufs));
  });

  return deferred.promise;
}

var byUrl = function (url, orientation) {
  return _fetchUrl(url)
  .then(function (buf) {
    console.log('processing');
    return _process(buf, orientation);
  })

};

//horsify(process.argv[2], process.argv[3]);
//debugImage(process.argv[2]);
//byUrl(process.argv[2], process.argv[3]);


module.exports = {
  byUrl: byUrl,
  byImage: byImage
}
