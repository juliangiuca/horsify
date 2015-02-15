'use strict';


var _horsePic = function (orient) {
  var src;

  src = './horseFlip2-dev.png';

  if (orient === 'left') {
    src = './horse2-dev.png';
  }

  return src;
}

//Horse size: { width: 410, height: 263, ratio: 1.55893536121673 }

var Horse = function (face, orient) {
  var _width = 410;
  var _height = 263;
  var _ratio = _width / _height;

  var horse = {
    src: _horsePic(orient),
    orient: orient,
    face: face,
    width: _width,
    height: _height,
    ratio: _ratio,
    x: 0,
    y: 0,

    // makes the horse head larger than the detected face
    resize: function () {

      // Make the horse 2.3 times larger than the person's face
      this.height = Math.round(face.height * 2.3);
      this.width = Math.round(this.height * this.ratio);

    },

    calcLocation: function () {
      console.log('orient', this.orient);

      var x = 2;
      var y = 2;

      if (orient === 'left') {
        x = 2;
        y = 2;
      }

      this.x     = Math.round(face.x - (this.width / x));
      this.y     = Math.round(face.y - (this.height / y));
    },

    // returns the ImageMagick string for geography
    // e.g. -geography 100x100+10+10
    position: function () {
      this.calcLocation();

      var position = this.width + 'x' + this.height;
      position += (this.x >= 0 ? '+' : '');
      position += this.x;
      position += (this.y >= 0 ? '+' : '');
      position += this.y;

      return position;
    }
  };

  horse.resize();

  return horse;
}

module.exports = Horse;
