Img = {
	mousOverImage: function (img,id,nr,layout){
    //var pst = $("#lv_"+id).position();
    $("#" + layout + "_" + id).mouseover(function(e){
          //$('#status').html(e.pageX +', '+ e.pageY);
      var distances = {
        leftbar   : {'left':15,'top':e.pageY,"bottom":"","right":""},
        bottombar : {'left': e.pageX,'bottom': '48','top':"","right":''},
        bottombar2: {'left': e.pageX,'bottom': '135','top':"","right":''},
        rightbar  : {'right': 15,'top': e.pageY,'bottom':"",'left':""}
      };
      ttmr = setTimeout(function() {$('.tt').css(distances[layout]).fadeIn(300);},600);
    });
	},
	mouseOutImage: function (img){
    $('.tt').css({'display':'none'});
    //clearTimeout(ttmr);
    if(img)
      imname = img;
    //make border back to greyish
    //imname.style.border = '3px solid #333';
    // if(ttmr!='undefined'){
    //     clearTimeout(ttmr);
    // }
    
        //clearTimeout(timer);
	},
  bannerVideo: function(img,id,nr) {
    //console.log(img,id,nr);
    //imgm=false;
    if(img)
      imgm = img;
    if (id.constructor == String && nr) {
      imgm.src = "http://img.youtube.com/vi/"+id+"/"+nr+".jpg";
      //imname.style.border = '3px solid orange';
      nr++;
      if(nr > 3)
        nr = 1;

      timer = setTimeout(function() {
        Img.bannerVideo(false,id,nr);
      },1000);
    }else{
      clearTimeout(timer);
    }
  }
};

//objeto que manuseia os videos
Player = {
  _run : function () {
    Player.loadPlayer();
  },
  loadVideo : function (id) {
    var videoID = id ? id : "ylLzyHk54Z0";
    
    if(ytplayer) {
      ytplayer.loadVideoById(videoID);
    }
  },
  loadPlayer : function (videoId) {
    // The video to load
    var videoID = videoId ? videoId :"ylLzyHk54Z0";
    // Lets Flash from another domain call JavaScript
    var params = { allowScriptAccess: "always" };
    // The element id of the Flash embed
    var atts = { id: "ytPlayer" };
    // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
    swfobject.embedSWF("http://www.youtube.com/v/" + videoID +
                       "?version=3&enablejsapi=1&playerapiid=player1",
                       "videoDiv", "100%", "480", "9", null, null, params, atts);
  },
  onPlayerError : function (errorCode) {
    alert("An error occured of type:" + errorCode);
  },
  loadPlayList : function (videos) {
    var _vids = [];
    var _el = $(".playlistBottombar > li");
    _el.each(function(i,v){
      _vids.push(_el.eq(i).attr('id').replace("bottombar_",""));
    });

    if(ytplayer) {
      if(ytplayer.getPlayerState() === 2){
        ytPlayer.playVideo();
      }else{
        ytplayer.loadPlaylist(_vids);
      }

    }
  },
  playLastVideo: function() {
    ytplayer.playVideoAt(ytplayer.getPlaylist().length -1);
  }
};

// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById("ytPlayer");
  ytplayer.addEventListener("onError", "Player.onPlayerError");
}

// start functions
$(window).resize(function() {
  var palco = $('#videoDiv');
  palco.css('height', palco.width()*0.67);
});
