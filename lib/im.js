'use strict';

var cv      = require('opencv');
var Q       = require('q');

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
  findFace: findFace
}
