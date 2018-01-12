let YOUTUBE_DATA = "https://www.googleapis.com/youtube/v3/search";
let APIKey = "AIzaSyDqIVbCutc1gMj331WakQ19WQmehefOdtE";
let feedData = YOUTUBE_DATA + APIKey;

let youtube_VideoURL = "https://www.youtube.com/watch?v=";
let youtube_ChannelURL = "https://www.youtube.com/channel/";
let searchTerm;

let token;

$("form").on("click", "button", function(e) {
  e.preventDefault();

  searchTerm = $("#tt-search").val();
  $("#tt-search").val("") 
  getDataFromApi(searchTerm, function(data) {
      token = data;
    
    data.items.forEach(item => {
      youtubeThumbnails.push(item);
    });
    renderTemplate();
  });
});

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: YOUTUBE_DATA,
    data: {
      part: "snippet",
      key: APIKey,
      q: searchTerm
    },
    dataType: "json",
    type: "GET",
    success: callback
  };

  $.ajax(settings);
}

let youtubeThumbnails = [];

function renderTemplate() {
  $('ul').html('');
  let dump = [];
  let title = [];
  dump = searchTerm.split(' ');
  dump.forEach(word => {
     let oldWord = word.toLowerCase();
     let firstLetter = word.charAt(0).toUpperCase()
     
     title.push(firstLetter + oldWord.slice(1));
  });
  
  title = title.join(' ');
  
  $('main').prepend(
    `
     <h2>Related to
      <span class="search-term f-style--italic color-red">${title}</span>
    </h2>
    `);

  $('main').prop('hidden', false);
  
  youtubeThumbnails.map(item => {
    $("ul").append(
      `
        <li class="card --is-displaying">
        <div class="card__container">
          <a href=${youtube_VideoURL + item.id.videoId} class="card__thumbnail-link thumbnail">
            <span class="screenreader-only">${item.snippet.title}</span><img src=${item.snippet.thumbnails.medium.url} alt=""></a>
          <div class="card__details">
            <h3>${item.snippet.title}</h3>
            <a class="channel-name" href="${youtube_ChannelURL + item.snippet.channelId}">
              ${item.snippet.channelTitle}
            </a>
          </div>

          <a href=${youtube_VideoURL + item.id.videoId} class="cta-container display-block bg-color-red color-white text-center"><span class="cta">View on YouTube</span></a>
        </div>
      </li>
      `
    );
    
  });

  iframeHandler();
}

function iframeHandler() {
  $(".thumbnail").on("click", function(e) {
    e.preventDefault();

    let snippetURL = $(this)
      .attr("href")
      .replace(youtube_VideoURL, "");
    $('body').addClass('overflow--hidden');
    $('body').append(`<div class="container-modal">
<div class="overlay"></div><div class="modal"></div></div>`)
    $(".modal").append(`
      <iframe width="854" height="480" src="https://www.youtube.com/embed/${snippetURL}" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
`);
  });
}

function removeIFrame(e) {
  if (e.type === 'keyup' && e.which === 27) {
    $('body').removeClass('overflow--hidden');
    $('.overlay').remove();
    $('.container-modal').remove();
    $('iframe').remove();
  } else if (e.type === 'click') {
    $('body').removeClass('overflow--hidden');
    $('.overlay').remove();
    $('.container-modal').remove();
    $('iframe').remove();
  }
}


$('body').on('click', '.overlay', removeIFrame);

if ($('.overlay')) {
  $('html').on('keyup', removeIFrame);
}