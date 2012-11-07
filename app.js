// The main application script, ties everything together.

var express = require('express'),
 mongoose = require('mongoose'),
 app = module.exports = express(),
 fs = require('fs'),
 pub = __dirname + '/public';

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/norum');

app.configure(function(){
  app.use(express.static(pub));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

// set up the RESTful API, handler methods are defined in api.js
var user = require('./controllers/user.js');
//user rest
app.get('/create', user.create);
app.get('/user', user.user);
app.post('/user/update', user.user_update);
app.get('/play', user.playground);
//user video rest
app.post('/video/search/save', user.save_search);
app.post('/video/play/save', user.save_play);
app.post('/video/playlist/save', user.save_playlist);
app.post('/video/favorite/save', user.save_favorite);

app.listen(3000);
console.log('Express app started on port 3000');