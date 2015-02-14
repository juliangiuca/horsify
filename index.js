var cv = require('opencv');
var images = require("images");
var Q = require('q');


var circle = function (faceSrc) {
  cv.readImage("./cory.jpg", function(err, im){
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

var faceSrc = "./erica.jpg";
var horseSrc = "./horse.png";

var horsify = function (faceSrc) {
  cvReadImage(faceSrc)
  .then(detectFace)
  .then(function (faces) {
    for (var i=0; i<faces.length; i++) {
      var face = faces[i];
      var horse = images(horseSrc);
      var max = (face.width > face.height ? face.width : face.height);
      horse.size(max*2.5);

      var newX = face.x - (horse.width()/2.7);
      var newY = face.y - (horse.height()/4);

      console.log(newX, newY);
      newX = newX > 0 ? newX : 0;
      newY = newY > 0 ? newY : 0;

      images(faceSrc)
      .draw(horse, newX, newY)
      .save('foo.jpg');

    }
  }).fail(function (err) {
    console.log(err);
  })
}

horsify(process.argv[2]);
