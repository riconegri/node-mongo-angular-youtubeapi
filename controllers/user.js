//load models for variable User
var User = require("../models/user.js");

/**************START ROUTES********************/
exports.post = function(req, res) {
    new Thread({title: req.body.title, author: req.body.author}).save();
};

exports.user = function (req, res) {

  User.findOne(function (err, user) {

    if (!user) {

      //sample user if not user
      var star_user = {
        email       : "riconegri@gmail.com",
        name        : "Ricardo Negri",
        age         : 41,
        password    : "123456",
        block       : [
          {name: 'searchterm',position: 4,active: 1,layout:"leftbar"},
          {name: 'last_viewed',position: 4,active: 1,layout:"leftbar"},
          {name: 'now',position: 1,active: 1,layout:"leftbar"},
          {name: 'mouseovervideo',position: 1,active: 1, layout: "general"},
          {name: 'topmenu',position: 1,active: 1, layout: "menubar"},
          {name: 'favorite', position: 1, active: 1, layout: "bottombar"},
          {name: 'bottombar',position: 1,active: 1, layout: "bottombar"},
          {name: 'player',position: 1,active: 1, layout: "main"},
          {name: 'favoritemain',position: 1,active: 0, layout: "main"},
          {name: 'search',position: 1,active: 1, layout: "rightbar"},
          {name: 'search_result',position: 1,active: 1, layout: "rightbar"}
        ],
        video_search: [{name    :  "hubble constant"}],
        video_play  : [
          {_id     : "kffacxfA7G4",title   : "Justin Bieber",term    : "justin bieber"},
          {_id     : "t4H_Zoh7G5A",title   : "Jennifer Lopez",term    : "jennifer Lopez"},
          {_id     : "uelHwf8o7_U",title   : "Eminen",term    : "eminem"}
        ],
        video_playlist    : [{_id:'principal',ids:["kffacxfA7G4","t4H_Zoh7G5A","uelHwf8o7_U"],active:1}],
        video_favorites   : ["kffacxfA7G4","t4H_Zoh7G5A","uelHwf8o7_U"]
      };

      var new_user = new User(star_user);
      new_user.save();

      res.send(new_user);

    }else
      res.send( user );

  });
};

exports.user_update = function( req, res ) {
  User.findOne(function (err, user) {
    if(err)
      res.send(err);

    User.update( { _id: user._id }, { $set : req.body }, {multi:false}, function (err, rowaffected) {
      res.send(err?err:rowaffected);
    });
  });
  //res.send({success:1,err:0});
};

exports.save_search = function (req, res) {
  User.findOne(function (err, user) {
    for(var x in user.video_search){
      if(user.video_search[x].name == req.body.query)
        user.video_search[x].remove();
    }
    user.video_search.push(
        {name:req.body.query}
    );
    //res.send(user.video_search);
    user.save(function (err) {
      if (err) {res.send(err);}else{res.send(user);}
    });
  });
};

exports.save_favorite = function (req, res) {
  User.findOne(function (err, user) {
    user.video_favorites.push(req.body.vid);
    user.save(function(err) {
      if (err) {
       res.send(err);
      }else{
        res.send({success:1});
      }
    });
//    res.send(user);
  });
};

exports.save_playlist = function (req, res) {
  User.findOne(function (err, user) {
    //res.send(req.body);
    if(req.body.nplist){
      user.video_playlist.push(req.body);
    }else{
      for(var p in user.video_playlist){
        if (user.video_playlist[p]._id == req.body._id) {
          user.video_playlist[p].ids = req.body.ids;
        }
      }
    }
    user.save( function ( err ) {
      if ( err )
        res.send( err );
      else
        res.send( user.video_playlist );
    });
  });
};

exports.save_play = function (req, res) {
  User.findOne(function (err, user) {
    user.video_play.push(
        {_id:req.body.videoid, title:req.body.title, term: req.body.term}
    );
    user.save(function (err) {
      if (err) {res.send(err);}else{res.send(user);}
    });
  });
};

exports.list = function(req, res) {
  new Thread({title: req.body.title, author: req.body.author}).save();
  Thread.find(function(err, threads) {
    res.send(threads);
  });
};