var cv = require('opencv');
var images = require("images");
var Q = require('q');
var gm = require('gm');
var fs = require('fs');
var im = require('imagemagick');


var circle = function (faceSrc) {
  cv.readImage(faceSrc, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

      for (var i=0;i<faces.length; i++){
        var x = faces[i]
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

//var horseSrc = (Math.random() > 0.5 ? './horse.png' : './horseFlip.png');
var horseSrc = './horse.png';

var horseFace = function (orient) {
  var img = {}

  if (!orient) {
    img.src = './horseFlip.png';
    img.orient = 'right';
  } else if (orient == 'left') {
    img.src = './horse.png';
    img.orient = 'left';
  } else {
    img.src = './horseFlip.png';
    img.orient = 'right';
  }

  return img;
}

var rightSkew = { x: 4, y: 2.5 };
var leftSkew = { x: 2.2, y: 3.3 };

var horsify = function (faceSrc, orientation) {
  var horse = horseFace(orientation);

  cvReadImage(faceSrc)
  .then(detectFace)
  .then(function (faces) {
    for (var i=0; i<faces.length; i++) {

      var face = faces[i];
      var horseGm = gm(horse.src);
      var sourceGm = gm(faceSrc);

      Q.all([fetchSize(horseGm),fetchSize(sourceGm)])
      .then(function (sizes) {

        var horseSize       = {width: sizes[0].width, height: sizes[0].height};
        var originalPicSize = {width: sizes[1].width, height: sizes[1].height};
        var faceSize        = {width: face.width, height: face.height};

        // Make the horse 2.3 times larger than the person's face
        newHorse = { height: Math.round(faceSize.height * 2.3) };

        console.log('orient', horse.orient);
        if (horse.orient === 'left') {
          x = leftSkew.x;
          y = leftSkew.y;
        } else {
          x = rightSkew.x;
          y = rightSkew.y;
        }

        newHorse.ratio = (horseSize.width / horseSize.height);
        newHorse.width = Math.round(newHorse.height * newHorse.ratio);
        newHorse.x     = Math.round(face.x - (newHorse.width / x));
        newHorse.y     = Math.round(face.y - (newHorse.height / y));

        var position = newHorse.width + 'x' + newHorse.height;
        position += (newHorse.x >= 0 ? '+' : '');
        position += newHorse.x;
        position += (newHorse.y >= 0 ? '+' : '');
        position += newHorse.y;
        console.log(position);

        im.convert(['-composite', faceSrc, horse.src, '-geometry', position, 'foo.jpg'], function (err, stdout) {
          console.log('err', err);
          console.log('stdout', stdout);
        });

      }).fail(function (err) {
        console.log('size err:', err);
      });

    }
  }).fail(function (err) {
    console.log(err);
    console.log(err.stack);
  })
}

horsify(process.argv[2], process.argv[3]);
circle(process.argv[2]);
