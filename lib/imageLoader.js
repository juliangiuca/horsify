'use strict';
var imageProcess = require('./imageProcess.js');
var sh           = require('shorthash');
var fs           = require('fs');
var path         = require('path');
var log          = require('./logging.js');
var redis        = require('./redis.js');
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

var _checkRedis = function (sha, deferred, cb) {
  redis.get(sha, function (err, exists) {
    if (err) {
      log.error(err);
      deferred.reject(sha);
    }
    if (!exists) { 
      cb();
      deferred.resolve(sha);
    }
  });
}

var findOrCreateByUrl = function (url, orientation) {
  var deferred = Q.defer();

  var sha = _sha(url, orientation);

  //Check FS
  //Then check Redis
  //Then image process (if it's not found)
  fs.exists(path.join(HORSEIMAGES, sha + '.jpg'), function (exists) {

    if (exists) {
      // noop
      log.info('File', sha, 'already exists');
      deferred.resolve(sha);
    } else {

      _checkRedis(sha, deferred, function () {
        log.info('Setting state to pending', sha);
        redis.setex(sha, 10, 'pending', function () {
          log.info('redis set', sha);
          _fetchAndSave(url, orientation, sha);
        });
      });
    }
  });

  return deferred.promise;
}

var _fetchAndSave = function (url, orientation, sha) {
  imageProcess.fetchByUrlAndProcess(url, orientation)
  .then(function (gm) {
    log.info('Writing image to disk:', url, '->', sha);
    //Write to a temporary path, then move when the write is completed
    gm.write(path.join(HORSEIMAGES, '_' + sha + '.jpg'), function (err) {
      if (err) { log.error(err); }

      var oldName = path.join(HORSEIMAGES, '_' + sha + '.jpg');
      var newName = path.join(HORSEIMAGES, sha + '.jpg');

      fs.rename(oldName, newName, function () {
        redis.del(sha);
      });
    });
  }).fail(function (err) {
    redis.setex(sha, 10, 'bad', function () {
      log.error('couldnt fetch by url (Redis set to bad for', sha, ')', err);
    });
  })
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
