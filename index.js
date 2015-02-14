var cv = require('opencv');
var images = require("images");
var Q = require('q');


//cv.readImage("./examples/files/mona.png", function(err, im){
//  im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
//
//    //for (var i=0;i<faces.length; i++){
//    //  var x = faces[i]
//    //  im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
//    //}
//    //im.save('./out.jpg');
//
//  });
//})


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

var face = "./examples/files/mona.png";
var horse = "./horse.jpg";

cvReadImage(face)
.then(detectFace)
.then(function (faces) {
  var x = faces[0];

  images(face)
  .draw(images(horse), x.width/2, x.height/2)
  .save('foo.jpg');
}).fail(function (err) {
  console.log(err);
})
