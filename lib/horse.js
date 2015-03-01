'use strict';
var path = require('path');

var _horsePic = function (orient) {
  var src;

  src = path.resolve(path.join(__dirname, '..', 'images', 'horse-right.png'));

  if (orient === 'left') {
    src = path.resolve(path.join(__dirname, '..', 'images', 'horse-left.png'));
  }

  return src;
}

//Horse size: { width: 410, height: 263, ratio: 1.55893536121673 }

var Face = function (face) {
  var midpointX = face.x + (face.width / 2);
  var midpointY = face.y + (face.height / 2);

  return {
    x: face.x,
    y: face.y,
    width: face.width,
    height: face.height,
    midX: midpointX,
    midY: midpointY
  }
}

var Horse = function (face, orient) {
  var _width = 390;
  var _height = 263;
  var _ratio = _width / _height;
  var _face = new Face(face);

  var horse = {
    src: _horsePic(orient),
    orient: orient,
    face: _face,
    width: _width,
    height: _height,
    ratio: _ratio,
    x: 0,
    y: 0,
    midX: 0,
    midY: 0
  };

  var _calcLocation = function () {

    var x = 2;
    var y = 2;

    if (horse.orient === 'left') {
      x = 2;
      y = 2;
    }

    horse.x    = Math.round(_face.x - (horse.width / x));
    horse.y    = Math.round(_face.y - (horse.height / y));

    horse.midX = _face.midX - (horse.width / 2);
    horse.midY = _face.midY - (horse.height / 2);
  };

  // makes the horse head larger than the detected face
  horse.resize = function () {

    // Make the horse 2.3 times larger than the person's face
    this.height = Math.round(face.height * 2.3);
    this.width = Math.round(this.height * this.ratio);

  };


  // returns the ImageMagick string for geography
  // e.g. -geography 1024x768+10+10
  horse.position = function () {
    _calcLocation();
    console.log('orient', this.orient);

    var position = this.width + 'x' + this.height;
    position += (this.midX >= 0 ? '+' : '');
    position += this.midX;
    position += (this.midY >= 0 ? '+' : '');
    position += this.midY;

    console.log('Position:', position);

    return position;
  }

  horse.resize();

  return horse;
}

module.exports = Horse;
