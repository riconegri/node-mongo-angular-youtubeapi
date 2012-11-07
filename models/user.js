var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

 /***************START SCHEMAS*********************/
var SearchSchema = new Schema({
    name    : String,
    deleted : {type: Boolean, "default": 0},
    createAt: {type: Date, "default": Date.now}
});

var BlockSchema = new Schema({
      name      : String,
      position  : Number,
      url       : String,
      layout    : String,
      active    : Boolean
});

var PlaySchema = new Schema({
  _id     : {type: String, index:{unique: true}},
  title   : String,
  term    : String,
  deleted : {type: Boolean, 'default': 0},
  createAt: {type: Date, "default": Date.now}
});

var PlaylistSchema = new Schema({
  _id     : {type: String, index:{unique: true}},
  ids     : Array,
  active  : Boolean,
  deleted : {type: Boolean, 'default': 0},
  createAt: {type: Date, "default": Date.now}
});
 
var UserSchema = new Schema({
    email       : {type: String, lowercase: true, required: true, trim: true, index: {unique: true}},
    name        : String,
    age         : Number,
    gender      : String,
    password    : String,
    deleted     : {type: Boolean, "default": 0},
    video_search: [SearchSchema],
    video_play  : [PlaySchema],
    block       : [BlockSchema],
    video_playlist    : [PlaylistSchema],
    video_favorites   : Array,
    createAt    : {type: Date, "default": Date.now}
});
 
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');