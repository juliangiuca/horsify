'use strict';

var cv      = require('opencv');
var Q       = require('q');

var debugImage = function (faceSrc) {
  cv.readImage(faceSrc, function (err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function (err, faces){

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

  im.detectObject(cv.FACE_CASCADE, {}, function (err, faces){
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(faces);
    }
  });

  return deferred.promise;
}

var findFace = function (url) {
  return cvReadImage(url)
  .then(detectFace)
}

module.exports = {
  debugImage: debugImage,
  findFace: findFace
}
