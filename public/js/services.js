YoutubeSearch = function() {

  angular.module('Youtube', [ ], function($provide) {

     $provide.factory('$user', function($http, $log) {

      return {
        user: function(){
        return $http.get( 'user' ).then( function(response) {
          var u = response.data;
          //console.log('antes: ',u.video_search);
          //console.log('para: ',u.video_search);
          u.video_search.reverse();
          u.video_play.reverse();

          //create url variable for blocks
          var lyt = {};
          for(var x in u.block){
            u.block[x].url = "partials/"+u.block[x].name+".html";
            lyt[u.block[x].layout]=[];
          }
          for(var z in lyt){
            for(var y in u.block){
                //console.log(z,u.block[y].layout);
              if(u.block[y].layout == z){
                lyt[z].push(u.block[y]);
              }
            }
          }
          u.block = lyt;
          //console.log("blcs",u.block);

          //page number convert to string
          var _b = (u.video_play.length / 16)+'';

          u.video_play_pages = Array(_b.split('.')[0]);

          //console.log(u.video_search);
          //init vars declaration
          var init = {
            videos    :  [],
            selected  :  {},
            isReload : false,
            query: u.video_search.length > 0 ? u.video_search[0]['name'] : "first time"
          };

          //extend object with init variables
          
          return angular.extend(u, init);

          });
        },
        update_user: function(user_data) {
          return $http.post('user/update', user_data).then( function (response) {
            return response.data;
          });
        },
        save_search: function(query){
         return $http.post('video/search/save', {query:query}).then( function (response) {
           return response.data;
         });
        },
        save_playlist: function(obj){
         return $http.post('video/playlist/save', obj).then( function (response) {
           return response.data;
         });
        },
        save_favorite: function(id){
         return $http.post('video/favorite/save', {vid:id}).then( function (response) {
           return response.data;
         });
        },
        save_play: function(vid, title, query){
         console.log("service save_search");
         return $http.post('video/play/save', {videoid: vid, title: title, term: query}).then( function (response) {
           return response.data;
         });
        },
        other: function () {
          console.log('estou aqui');
        }
      };

     });

    $provide.factory('$youtube', function($http, $log) {

      // Urls access api youtube
      var urls = {
        youtube_path: 'http://gdata.youtube.com/feeds/api/videos',
        search      : function() {//general search by post
          return this.youtube_path + '?max-results=25&v=2&alt=json&v=2&format=5';
        },
        by_id       : function(id) {//get info by video id
          //console.log("by_id",id);
          if(id.constructor != String){
            id = id._id;
          }
          return this.youtube_path + '/' + id + '?v=2&alt=json&v=2&format=5';
        }
      };
      /**
             * Publish search API for our custom Youtube service
             */
      return {
        /** !! search() responds with promise instance
               * but intercept the initial response to parse the data items
               */
        vid: function (id) {
          if(id){
            return $http.get( urls.by_id(id) ).then( function(response) {
              return response.data.entry;
            });
          }else{
            return false;
          }
          
        },
        search: function(searchTerm, lastID) {
          var params = '&q=' + searchTerm;
          //$log.log( params );
          
          // return a promise
          //return $http.jsonp( url + params ).then( function(response) {
          return $http.get( urls.search() + params ).then( function(response) {
             //console.log(response.data);
            // isolate good infos from videos
            var d = response.data.feed.entry,
              new_thumbnail = [];
            for (var i = 0; i < d.length; i++)
            {
              //adjust date
              d[i].date = Date.parse(d[i].published.$t);

              // only 3 images for thumbnails
              for (var j = 0; j < d[i].media$group.media$thumbnail.length; j++) {
                if (j > 2) {
                  new_thumbnail.push(d[i].media$group.media$thumbnail[j]);
                }
              }
              d[i].media$group.media$thumbnail = new_thumbnail;
              new_thumbnail = [];
            }

            //console.log(d);
            // Build special response
            return {
              items       : d,
              refreshURL  : response.data.refresh_url,
              query       : response.data.query
            };

          });
        }
      };
    });
  });
};

// Start the application
YoutubeSearch();