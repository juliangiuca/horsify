'use strict';
var redis = require('./redis.js');
var Q = require('q');
var log = require('./logging.js');

function RedisWrapper (sha) {
  this.sha = sha;
  log.info('Sha set to', sha);
}


RedisWrapper.prototype = {
  noopOrCreateBySha: function (exists) {
    log.info('noopOrCreateBySha');
    if (exists) { return true; }

    var that = this;

    debugger
    return this.findBySha()
    //.then(this.setPendingBySha);
  },

  setPendingBySha: function (exists) {
    log.info('setPendingBySha');
    if (exists) { return true; }

    var deferred = Q.defer();

    redis.setex(this.sha, 10, 'pending', function (err, exists) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(exists);
      }
    });

    return deferred.promise;
  },

  findBySha: function () {
    log.info('findBySha');
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
