'use strict';

var cv = require('opencv');
//var images = require('images');
var Q = require('q');
var gm = require('gm');
//var fs = require('fs');
var im = require('imagemagick');
var Horse = require('./lib/horse');


var circle = function (faceSrc) {
  cv.readImage(faceSrc, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

      for (var i=0;i<faces.length; i++){
        var x = faces[i];
        im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      }
      im.save('./out.jpg');

    });
  })
};


var cvReadImage = function (img) {
  var deferred = Q.defer();

  cv.readImage(img, function (err, im) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(im);
    }
  });

  return deferred.promise;
}

var detectFace = function (im) {
  var deferred = Q.defer();

  im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(faces);
    }
  });

  return deferred.promise;
}

var fetchSize = function (horse) {
  var deferred = Q.defer();

  horse.size(function (err, size) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(size);
    }
  });

  return deferred.promise;
}




var horsify = function (faceSrc, orientation) {

  if (orientation === undefined) { orientation = 'right'; }

  cvReadImage(faceSrc)
  .then(detectFace)
  .then(function (faces) {
    for (var i=0; i<faces.length; i++) {

      var face = faces[i];
      var horse = new Horse(face, orientation);
      console.log('Horse deets:', horse);

      console.log('Face deets:', face);

        var position = horse.position();
        console.log('Position:', position);

        im.convert(['-composite', faceSrc, horse.src, '-geometry', position, 'foo.jpg'], function (err, stdout) {
          console.log('err', err);
          console.log('stdout', stdout);
        });

    }
  }).fail(function (err) {
    console.log(err);
    console.log(err.stack);
  })
}

horsify(process.argv[2], process.argv[3]);
circle(process.argv[2]);
