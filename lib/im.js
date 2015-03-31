'use strict';

var cv      = require('opencv');
var Q       = require('q');

var cvReadImage = function (buf) {
  var deferred = Q.defer();

  cv.readImage(buf, function (err, im) {
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

var findFace = function (buf) {
  return cvReadImage(buf)
  .then(detectFace);
}

module.exports = {
  findFace: findFace
}
