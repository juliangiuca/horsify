'use strict';
var Q = require('q');
var log = require('./logging.js');
var request = require('request');

var mbLimit = 2;
var maxSize = mbLimit * 1024 * 1024;

var Request = function (url) {
  this.url = url;
  this.bufs = [];

}

Request.prototype = {
  pullDownAsset: function () {
    var that = this;

    return this.getHead()
     .then(function() {
       return that.getBody();
     })
     .then(function () {
       return Buffer.concat(that.bufs);
     });
  },

  getHead: function () {
    var deferred = Q.defer();

    var options = {};
    options.uri            = this.url;
    options.timeout        = 2000; // 1second timeout
    options.followRedirect = 3;
    options.method         = 'HEAD';

    request(options, function (err, headRes) {

      if (err) {
        deferred.reject(err);
      } else {
        var size = headRes.headers['content-length'];
        if (size > maxSize) {
          log.error('Header says the image is too big', size);
          deferred.reject();
        } else {
          deferred.resolve();
        }
      }
    });

    return deferred.promise;
  },

  getBody: function () {
    var deferred = Q.defer();

    var options = {};
    options.uri            = this.url;
    options.timeout        = 2000; // 1second timeout
    options.followRedirect = 3;
    options.method         = 'GET';
    var size = 0;
    var req = request(options);
    var that = this;

    req.on('data', function(d) {
      size += d.length;
      that.bufs.push(d);

      if (size > maxSize) {
        log.error('Resource stream exceeded limit (' + size + ')');

        req.abort(); // Abort the response (close and cleanup the stream)
        deferred.reject();
      }
    });

    req.on('end', function(){
      log.info('done fetching', that.url);
      deferred.resolve();
    });

    return deferred.promise;
  }
}



var _fetchByUrl = function (url) {
  var req = new Request(url);
  return req.pullDownAsset();
}

module.exports = _fetchByUrl;
