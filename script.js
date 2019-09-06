let searchTerm = 'VR Virtual Reality';
/* NewsAPi keys and endpoint */
const apiKey = 'f8bf2ba3981049d5b63a26340c970e25';
const searchURL = 'https://newsapi.org/v2/everything';
/* YouTubeAPi keys and endpoint */
const apiKeyYoutube = 'AIzaSyBCCJT9l3ufF2B-kVSwZ-RSxNLgAAxONDE'; 
const searchURLYoutube = 'https://www.googleapis.com/youtube/v3/search';
/* TwitterAPi keys and endpoint */
const API_KEY = 'yk3wp5Rm2Xa90PFrgDy3fvYwz'
const API_SECRET_KEY = 'DOks3iDYXBZ3SLuStt9iTxpy84k8WmdEomsTAqv6cEV1L2ZYJV';
const API_BASE_SEARCH_URL = 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?count=25&q=';
const API_TOKEN_URL = 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/oauth2/token';
const base64Encoded = 'TlVnN3dmTGVOYXhYSmRQV3BFcUJBVGJReTpnVUsxR1gzcmtLMTdBeFh3WFBmTTRTQ3IzdlVBUGNlWGZBRUVhUVBVaElUVmJaSVFtUg==';

/* Prepare the query parameters */
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

/* News articles start here */
/* Implementation of the press articles display */
function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.articles.length & i<maxResults ; i++){  
    let articleDate = parseDate(responseJson.articles[i].publishedAt);
    let articleImage = responseJson.articles[i].urlToImage || 'https://cdn.pixabay.com/photo/2016/12/16/13/50/vr-1911451_960_720.png';
    $('#results-list').append(
      `<a href="${responseJson.articles[i].url}" target="_blank">
        <div class="news card wow fadeIn">
        <div class="wrapper" style="background: url(${articleImage}) 20% 1%/cover no-repeat;">
        <div class="date">
        <span class="year">Published:</span>
          <span class="day">${articleDate}</span>          
        </div>
        <div class="data">
          <div class="content">
            <span class="author">By ${responseJson.articles[i].author}</span>
            <span class="magazine">${responseJson.articles[i].source.name}</span>
            <h1 class="title">${responseJson.articles[i].title}</h1>
            <p class="text">${responseJson.articles[i].description}</p>
          </div>
        </div>
      </div>
    </div></a>`
    )};   
  $('#results').removeClass('hidden');
};
// Fetching the newsAPI response
function getNews(query, maxResults=10) {
  const params = {
    qInTitle: query,
    sortBy:'publishedAt',
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

/* youtube videos start here */
/* Implementation of the video display */
function displayVideos(responseJson) {
  console.log(responseJson);
  $('#results-list-youtube').empty();
  for (let i = 0; i < responseJson.items.length; i++){
    let videoDate = parseDate(responseJson.items[i].snippet.publishedAt);
    $('#results-list-youtube').append(
      `<div class="video card wow fadeIn">
        <div class="wrapper" style="background: url(${responseJson.items[i].snippet.thumbnails.high.url}) center/cover no-repeat">
          <div class="header">
            <div class="date">
              <span class="month">${videoDate}</span>
            </div>
          </div>
          <div class="video-data">
            <div class="content">
              <div class="js-overlay-start start" data-url="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}?rel=0&amp;showinfo=0&amp;autoplay=1">
              <div class="play"></div>
          </div>
          <div class="author video-author">${responseJson.items[i].snippet.channelTitle}</div>
          <h1 class="title js-overlay-start" data-url="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}?rel=0&amp;showinfo=0&amp;autoplay=1">${responseJson.items[i].snippet.title}</h1>  
          </div>
          </div>
        </div>
      </div>`
    )};
  playInOverlay();
};
// Fetching the youTube response
function getYouTubeVideos(query, maxResults=10) {
  const params = {
    key: apiKeyYoutube,
    q: query,
    part: 'snippet',
    order:'date',
    safeSearch: 'strict',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURLYoutube + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVideos(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
/* Youtube overlay */
function playInOverlay(){
  $(".js-overlay-start").unbind("click").bind("click", function(e) {
    e.preventDefault();
    let src = $(this).attr("data-url");
    $(".overlay-video").show();
    setTimeout(function() {
      $(".overlay-video").addClass("overlay-main");
      $("#player").attr("src", src);
    }, 100);
  });
  /* close overlay by clicking outside */
  $(".overlay-video").click(function(event) {
    if (!$(event.target).closest(".videoWrapperExt").length) {
      let PlayingVideoSrc = $("#player").attr("src").replace("&autoplay=1", "");
      $("#player").attr("src", PlayingVideoSrc);
      $(".overlay-video").removeClass("overlay-main");
      setTimeout(function() {
        $(".overlay-video").hide();
      }, 600);
    }
  });
  /* close overlay by button */
  $(".close").click(function(event) {
      let PlayingVideoSrc = $("#player").attr("src").replace("&autoplay=1", "");
      $("#player").attr("src", PlayingVideoSrc);
      $(".overlay-video").removeClass("overlay-main");
      setTimeout(function() {
        $(".overlay-video").hide();
      }, 600);
  });
}

/* Tweets start here */
/* Implementation of the tweeter display */
function displayTweetsData(tweets) {
  $('#tweets').empty(); 
  console.log(tweets);
  for (let i = 0; i < tweets.length; i++){
    // Truncate the Twitter date parameter
    let str = tweets[i].created_at; 
    let tweeterDate = jQuery.trim(str).substring(0, 20)
    .split(" ").slice(0, -1).join(" ");

    $('#tweets').append(
      `<li class="tweet wow slideDown">
          <a class="link-to" href="https://twitter.com/${tweets[i].user.id}/status/${tweets[i].id_str}" target="_blank">
            <div class="tweet-header">
              <img class="avatar" src="${tweets[i].user.profile_image_url_https}" alt="avatar">
              <div class="TweetAuthor-nameScreenNameContainer">
                <span class="TweetAuthor-decoratedName">
                <span class="TweetAuthor-name Identity-name customisable-highlight">${tweets[i].user.name}</span>
                </span>
                <span class="TweetAuthor-screenName Identity-screenName">@${tweets[i].user.screen_name}</span>
              </div>
              <div class="icon--twitter"></div>
            </div>
            <p class="tweet-text">${tweets[i].text}</p>
            <div class="TweetInfo-timeGeo">${tweeterDate}</div>
          </a>
      </li>`
    );
  }
}
async function getAuthToken() {
  const authResponse = await fetch(API_TOKEN_URL, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': 'Basic ' + base64Encoded,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
  const authJSON = await authResponse.json();
  return authJSON;
}
// Fetching the Twitter response data
async function getTweets(param) {
  const authJSON = await(getAuthToken())
  console.log(authJSON)
  const tweetResponse = await fetch(API_BASE_SEARCH_URL+param, {
        headers: {
          'Authorization': 'Bearer ' + authJSON.access_token
        }
  })
  console.log(tweetResponse);     
  const tweetJSON = await tweetResponse.json();
  displayTweetsData(tweetJSON.statuses);
}
/* Parse the date parameters for human-readable depiction*/
function parseDate(param) {
  let articleDateArr=[];
  let date = new Date(param);
  let month = date.getUTCDate();
  articleDateArr.push(month);
  month = date.getUTCMonth();
  if (month===11){month="Dec";} else if(month===10){month="Nov";}    
    else if(month===9){month="Oct"} else if(month===8){month="Sep";}
    else if(month===7){month="Aug"} else if(month===6){month="Jul";}
    else if(month===5){month="Jun";} else if(month===4){month="May";}
    else if(month===3){month="April";} else if(month===2){month="March";} 
    else if(month===1){month="Feb";}else if(month===0){month="Jan"; 
  }
  articleDateArr.push(month);
  month=date.getUTCFullYear();
  articleDateArr.push(month)
  return articleDate = articleDateArr.join(' ');
}
/* Back to top implementation */
function scrollBack() {
  let back_to_top_button = ['<a href="#top" class="back-to-top">Back to Top</a>'].join("");
    $("body").append(back_to_top_button)
    $("a.back-to-top").hide();
    $(function () {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 600) { 
          $('a.back-to-top').fadeIn();
        } else {
          $('a.back-to-top').fadeOut();
        }
      });
      $('a.back-to-top').click(function () { 
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
    });
}
/* Implementing smooth scroll functionality */
function handleAutoScroll() {
  $('a[href^="#"]').on('click', function(event) { 
      let scrollTarget = $(this.getAttribute('href')); 
      if( scrollTarget.length ) {
          $('html, body').stop().animate({scrollTop: scrollTarget.offset().top }, 800);   
      }
  });
}
/* Handle change topic */
function showArTopic() {
  $("#topic-AR").on('click', function(){
    searchTerm = 'AR Augmented Reality';
    getNews(searchTerm, 10);
    getYouTubeVideos(searchTerm + "Technology", 10);
    getTweets(searchTerm); 
    /* Change topic titles */ 
    $(this).addClass('topic-selected');
    $("#topic-VR").removeClass('topic-selected');
    $(this).closest('header').find('h1 span').hide().text('AR').fadeIn('slow');
    $(this).closest('body').find('.news-title span').hide().text('AR').slideDown('slow');
    $(this).closest('body').find('.videos-title span').hide().text('AR').slideDown('slow');
    $(this).closest('body').find('.tweets-title span').hide().text('AR').slideDown('slow');
  });
}
function showVrTopic() {
  $("#topic-VR").on('click', function(){
    searchTerm = 'VR Virtual Reality';
    getNews(searchTerm, 10);
    getYouTubeVideos(searchTerm + "Technology", 10); 
    getTweets(searchTerm);
    /* Change topic titles */ 
    $(this).addClass('topic-selected');
    $("#topic-AR").removeClass('topic-selected');
    $(this).closest('header').find('h1 span').hide().text('VR').fadeIn('slow');
    $(this).closest('body').find('.news-title span').hide().text('VR').slideDown('slow');
    $(this).closest('body').find('.videos-title span').hide().text('VR').slideDown('slow');
    $(this).closest('body').find('.tweets-title span').hide().text('VR').slideDown('slow');
  });
}

function initApp() {   
  showVrTopic();
  showArTopic();
  scrollBack();
  handleAutoScroll();
  const maxResults = 10;
  getNews(searchTerm, maxResults);
  getYouTubeVideos(searchTerm + "Technology", maxResults); 
  getTweets(searchTerm); 
  new WOW().init();
}

$(initApp);