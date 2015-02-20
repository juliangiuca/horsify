'use strict';

var Horse   = require('./horse');
var gm      = require('gm');
var request = require('request');
var im      = require('./im.js');
var Q = require('q');
var _ = require('lodash');


var _foo = function (err, buf) {
  return gm(buf).options({imageMagick: true})
  .geometry(horse.position())
  .composite(horse.src)
}

var _process = function (faceData, orientation) {
  if (orientation === undefined) { orientation = 'right'; }
  var arr = [];

  return im.findFace(faceData)
  .then(function (faces) {

    var fd = faceData;

    for (var i=0; i<faces.length; i++) {

      var face = faces[i];
      var horse = new Horse(face, orientation);

      //arr.push(horse.src + ' -geometry ' + horse.position() + ' -composite')
     // pic
     // .geometry(horse.position())
     // .composite(horse.src)
     // pic.out(horse.src + ' -geometry ' + horse.position() + ' -composite');

     foo(null, fd).then(function (buf) {
       foo(null, fd);
     })
    // gm(fd).options({imageMagick: true})
    // .geometry(horse.position())
    // .composite(horse.src).toBuffer(foo);

    }

    //pic.out(arr.join(' '));


    //for (var k in pic) {
    //  console.log(k, ':', pic[k]);
    //}
    fd.write('foo.jpg', function(err) {
      if(!err) console.log("Written composite image.");
    });
    debugger
    return fd;
  }).fail(function (err) {
    console.log(err);
    console.log(err.stack);
  })

}

var byImage = _process

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
