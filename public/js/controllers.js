function SearchController($scope, $youtube, $user, $log, $rootScope)
{
  
  $scope.cacheVideosById  = [];
  $scope.newPlaylist      = '';
  $scope.userLoading      = false;
  $scope.actualPlaylist   = false;
  $scope.btnclic          = false;
  $scope.userUpdateInfo   = false;
  $scope.favoritesToggle  = false;
  $scope.blocksToggle     = false;

  //html path for includes
  //$scope.block = {};

  $scope.uinterf = {
    blck_playing    : true,
    blck_lastviewed : false,
    blck_searchterms: true
  };

  // *****************************************************
  // Private methods used by controller features
  // *****************************************************

  function sameCase(value) {
    return $scope.filters.caseSensitive ? value : value.toUpperCase();
  }

  function updateVideos(items, merge) {
    merge = merge || false;
    this.videos = merge ? items.concat( this.videos ) : items;
  }

  function isEmpty(value) {
    return (typeof value == 'undefined') || value === '' || value === null || value !== value;
  }

  $scope.video = {
    playing: false,
    actual_page: 1,
    setActualPage: function(num_page) {
      this.actual_page = num_page;
    },
    addPlay: function (v) {//v=video obj
      console.log("video.addPlay",$scope.cacheVideosById);

      if (v.length === 11) {
        v = $scope.cacheVideosById[v];//v == video id
      }
      console.log("addPlay",v);
      this.playing = v;
      console.log("controller->addPlay " + v.media$group.yt$videoid.$t + v.title.$t + $scope.query);
      if (v.media$group.yt$videoid.$t) {
        $user.save_play(v.media$group.yt$videoid.$t, v.title.$t, $scope.query);
      }
      var lastViewModel =  {
        _id: v.media$group.yt$videoid.$t,
        term: $scope.query,
        title: v.title.$t
      };

      $scope.video_play.unshift(lastViewModel);
    },
    addItemPlayList : function () {
      
    },
    addPlayList : function () {
      
    }
  };

  //load user tree with all data and declare $scope variables
  $scope.getUser  = function () {
    //$log.log("doSearch( '" + searchTerm + " ')");
    //console.log($log);

    $scope.userLoading = true;
    $scope.putz = "partials/test.html";
    

    return $user
    .user()
    .then( function( response ){
      //console.log("USER->",response);
      
      $scope = angular.extend($scope,response);
      console.log("USER->",$scope);

      //set playlist actual
      for(var v in $scope.video_playlist)
        if($scope.video_playlist[v].active)
          $scope.actualPlaylist = $scope.video_playlist[v]._id;
      
      //last viewed
      //$scope.last_play_video = _last_search === 0 ||_last_search ? response.video_play[_last_play]._id : "jtP_sNFIz8s";
      //videos configs
      $scope.userLoading = false;
      //start search
      $scope.doSearch( $scope.query, true );
      //get infos by video id

      //
      $scope.userInfo   = {
        name: $scope.name,
        email: $scope.email,
        age: $scope.age,
        gender:$scope.gender,
        password: $scope.password
      };


      $scope.getInfoVideoById($scope.video_play[0]._id).then(
        function() {
          //load infos on actual playing
          $scope.video.playing = $scope.cacheVideosById[$scope.video_play[0]._id];
        }
      );

    });
  };

  //save info
  $scope.updateUser = function () {
    //console.log(user);
    $scope.userUpdateInfo = angular.copy($scope.userInfo);
    $user.update_user($scope.userUpdateInfo);
  };

  $scope.getUser();
  console.log('playing',$scope.video.playing);

  //
  $scope.isReload = 1;

  $scope.searching =  false;
  $scope.countDown =  180;

  $scope.debugCache = function() {
    console.log("cache",$scope.cacheVideosById);
  };

  /**
   *  Submit query request to Youtube online service
   *
   *  @param searchTerm string contain the topic to be queried.
   *  @return promise for future response
   */
  $scope.doSearch  = function (searchTerm, no_save) {
    //$log.log("doSearch( '" + searchTerm + " ')");

    $scope.searching = true;

    return $youtube
    .search( searchTerm )
    .then( function( response ){
      var merge = (searchTerm == $scope.refreshURL);
      // Call private merge() method
      angular.bind($scope, updateVideos)(response.items, merge);

      if(!no_save){
        $scope.saveSearch();
        $scope.video_search.push({name: searchTerm});
      }
      $scope.query = searchTerm;
      $scope.countDown  = 180;
      $scope.lastQuery  = $scope.query;
      $scope.refreshURL = response.refreshURL;
      $scope.searching  = false;
    });
  };

  /**
    * Methods for save in mongodb
  */
  $scope.saveSearch = function () {
    $user.save_search($scope.query);
  };

  $scope.getInfoVideoById = function(id) {
    var id_str = id.constructor == String ? id : id._id;
    //console.log(id_str,"id");
    if ($scope.cacheVideosById[id_str]) {
      $scope.mov = $scope.cacheVideosById[id_str];
      //console.log('video cache',$scope.cacheVideosById[id_str]);
      //angular.extend($scope.mov, {_id:id});
    }else{
      //console.log("getInfoVideoById",id_str);
      if(!id_str)return false;
      
      return $youtube.vid(id_str).then(function( response ) {
        $scope.cacheVideosById[id_str] = response;
        $scope.mov = $scope.cacheVideosById[id_str];
        //angular.extend($scope.mov, id);
        //console.log('movi',$scope.mov);
      });
    }
  };

  $scope.addFavorites = function(id) {
    $scope.video_favorites.push(id);
    $user.save_favorite(id);
  };

  $scope.toggleFavorites = function() {
    if($scope.favoritesToggle)
      $scope.favoritesToggle = 0;
    else
      $scope.favoritesToggle = 1;
  };

  $scope.toggleBlockModules = function() {
    if($scope.blocksToggle)
      $scope.blocksToggle = 0;
    else
      $scope.blocksToggle = 1;
  };

  $scope.activeNewPlaylist = function() {
    $scope.btnclic = 10;
  };

  $scope.addNewPlayList = function(listName) {
    //add new playlist to array
    $scope.video_playlist.push({_id:listName,ids:[]});
    //set actual playlist
    $scope.actualPlaylist = $scope.newPlaylist;
    $scope.btnclic = false;

    //console.log($scope.btnclic);
    //save playlist to server
    //$user.save_playlist({_id:listName,ids:[],nplist:1});
  };

  $scope.addToPlayList = function(id){
    var playlist_selected = $('.selectPlaylist'),
        pl = $scope.video_playlist;

    if(playlist_selected.val()){
      for(var x in pl){
        if (pl[x]._id == playlist_selected.val()) {
          pl[x].ids.push(id);
          $user.save_playlist({_id: pl[x]._id,ids:pl[x].ids,nplist:0});
        }
      }

    }
  };

  //load info from mouse over
  $scope.loadThumbMouseOverVideo = function(v) {
    //console.log($scope.cacheVideosById[v._id]);
    $scope.getInfoVideoById(v);
  };

  //console.log($scope);
}

function SoController ( $scope ) {
  console.log($scope);
}