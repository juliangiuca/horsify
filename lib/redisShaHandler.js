'use strict';
var redis = require('./redis.js');
var Q = require('q');
var log = require('./logging.js');

function RedisWrapper (_sha) {
  this.sha = _sha;
}


RedisWrapper.prototype = {
  checkByRedis: function (exists) {
    log.info('checking by redis', this.sha);
    if (exists) { return true; }

    return this.findBySha()
    .then(this.setPendingBySha.bind(this));
  },

  setPendingBySha: function (exists) {
    if (exists) { return true; }

    var deferred = Q.defer();

    redis.setex(this.sha, 10, 'pending', function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  },

  findBySha: function () {
    var deferred = Q.defer();

    redis.get(this.sha, function (err, exists) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(exists);
      }
    });

    return deferred.promise;
  },

  setBadBySha: function () {
    log.info('setBadBySha');
    var deferred = Q.defer();

    redis.setex(this.sha, 10, 'bad', function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  },

  deleteBySha: function () {
    log.info('deleteBySha');
    var deferred = Q.defer();

    redis.del(this.sha, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  }
}

module.exports = RedisWrapper;
