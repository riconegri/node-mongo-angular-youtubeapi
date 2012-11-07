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

      this.playing = v;

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

    $scope.userLoading = true;
    $scope.putz = "partials/test.html";
    

    return $user
    .user()
    .then( function( response ){
      
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

      //user info for update server
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
    $scope.userUpdateInfo = angular.copy($scope.userInfo);
    $user.update_user($scope.userUpdateInfo);
    setTimeout(function() {
      $('#myModal').fadeToggle();
    },2000);
  };

  $scope.getUser();

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

    $scope.searching = true;

    return $youtube
    .search( searchTerm )
    .then( function( response ){
      var merge = (searchTerm == $scope.refreshURL);
      // Call private merge() method
      angular.bind($scope, updateVideos)(response.items, merge);

      if(!no_save){
        $scope.saveSearch();

        for(var x in $scope.video_search)
          if ( $scope.video_search[x]['name'] ==  searchTerm)
            $scope.video_search.splice(x,1);
        
        $scope.video_search.unshift({name: searchTerm});
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
    if ($scope.cacheVideosById[id_str]) {
      $scope.mov = $scope.cacheVideosById[id_str];
      //angular.extend($scope.mov, {_id:id});
    }else{
      if(!id_str)return false;
      
      return $youtube.vid(id_str).then(function( response ) {
        $scope.cacheVideosById[id_str] = response;
        $scope.mov = $scope.cacheVideosById[id_str];
        //angular.extend($scope.mov, id);
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
    //toggle input add playlist
    $scope.btnclic = 1;
  };

  $scope.addNewPlayList = function(listName) {
    //add new playlist to array
    $scope.video_playlist.push({_id:listName,ids:[]});
    //set actual playlist
    $scope.actualPlaylist = $scope.newPlaylist;
    alert(listName);
    $scope.actualPlaylist = listName;
    $('.selectPlaylist').val(listName);
    alert($('.selectPlaylist').val());
    $scope.btnclic = false;

  };

  $scope.addToPlayList = function(id){
    var playlist_selected = $('.selectPlaylist'),
        pl = $scope.video_playlist;

    if(playlist_selected.val()){

      for(var x in pl){

        if (pl[x]._id == playlist_selected.val()) {

          pl[x].ids.push(id);
          $user.save_playlist({
            _id: pl[x]._id,
            ids:pl[x].ids,
            nplist:pl[x].ids.length>0?1:0
          });

        }

      }

    }
  };

  //load info from mouse over
  $scope.loadThumbMouseOverVideo = function(v) {
    $scope.getInfoVideoById(v);
  };

}

function SoController ( $scope ) {
  console.log($scope);
}