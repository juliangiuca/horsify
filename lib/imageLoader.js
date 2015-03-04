'use strict';
var imageProcess = require('./imageProcess.js');
var sh           = require('shorthash');
var fs           = require('fs');
var path         = require('path');
var log          = require('./logging.js');
var RedisShaHandler        = require('./redisShaHandler.js');
var Q = require('q');

var HORSEIMAGES  = path.resolve(path.join(__dirname, '..', 'horsifiedImages'));

var findBySha = function (sha) {
  return fs.createReadStream(path.join(HORSEIMAGES, sha +  '.jpg'));
}

var errorImage = function (sha) {
  return fs.createReadStream(path.join(__dirname, '..', 'images', 'error.jpg'));
}

var imageByPath = function (_path) {
  return fs.createReadStream(_path);
}

var _checkFs = function (sha) {
  var deferred = Q.defer();

  fs.exists(path.join(HORSEIMAGES, sha + '.jpg'), function (exists) {
    deferred.resolve( exists );
  })

  return deferred.promise;
}


var findOrCreateByUrl = function (url, orientation) {

  var sha = _sha(url, orientation);
  var r = new RedisShaHandler(sha);

  //Check FS
  //Then check Redis
  //Then image process (if it's not found)
  return _checkFs(sha)
  .then(r.noopOrCreateBySha.bind(r))
  .then(function (exists) {

    if (!exists) {
      _fetchAndSave(url, orientation, sha);
    }

    return sha;
  }).fail(function (err) {
    log.error('err:', err);
  })

}

var _fetchAndSave = function (url, orientation, sha) {
  var r = new RedisShaHandler(sha);

  imageProcess.fetchByUrlAndProcess(url, orientation)
  .then(function (gm) {
    log.info('Writing image to disk:', url, '->', sha);
    //Write to a temporary path, then move when the write is completed
    gm.write(path.join(HORSEIMAGES, '_' + sha + '.jpg'), function (err) {
      if (err) { log.error(err); }

      var oldName = path.join(HORSEIMAGES, '_' + sha + '.jpg');
      var newName = path.join(HORSEIMAGES, sha + '.jpg');

      fs.rename(oldName, newName, function () {
        r.deleteBySha();
      });
    });
  }).fail(function (err) {

    r.setBadBySha()
    .then(function () {
      log.error('couldnt fetch by url (Redis set to bad for', sha, ')', err);
    });

  });
}
var _sha = function (url, orientation) {
  return sh.unique(url + '-' + orientation);
}


module.exports = {
  findOrCreateByUrl: findOrCreateByUrl,
  findBySha: findBySha,
  errorImage: errorImage,
  imageByPath: imageByPath
}
