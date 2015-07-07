'use strict';

var express = require('express');
var config = require('config');
var morgan = require('morgan');

var menu = config.menu;

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('combined'));

app.use(express.static('public'));

if (!config.online) {
  app.get('/*', function(req, res) {
    res.render('maintenance', { menu: menu });
  });
}

app.get('/', function(req, res) {
  res.render('actus', { menu: menu });
});

app.get('/page/:title', function(req, res, next) {
  res.render(req.params.title, { menu: menu }, function(err, html) {
    if (err) {
      next(err);
    }
    else {
      res.send(html);
    }
  });
});

app.use(function(req, res) {
  res.render('notFound', { menu: menu });
});

app.use(function(err, req, res, next) {
  console.log(err);
  res.render('error', { menu: menu });
});

app.listen(80, function() {
  var host = config.address;
  var port = config.port;
  console.log('Example app listening at http://%s:%s', host, port);
});
