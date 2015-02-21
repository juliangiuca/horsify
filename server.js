'use strict';
var express = require('express');
var app = express();
var horse = require('./lib/imageHandler.js');
var fs = require('fs');

app.set('view engine', 'jade');

app.get('/horsify', function (req, res){
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  horse.byUrl(req.query.url, req.query.o)
  .then(function (gm) {
    gm.stream('jpg', function (err, stdout, stderr) {
      if (err) { console.log('err:', err); }
      stdout.pipe(res);
    })
  })
});

app.get('/', function (req, res){

  //console.log(req.query.url);
  res.send('hello world');
});

app.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = "./tmp";
  form.keepExtensions = true;

  //horse.byImage('./chris.jpg', req.query.o)

  form.on('end', function() {
  });
});

app.listen(3000);

