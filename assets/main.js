function initShareButtons() {
  var init = function (selector, width, height, url) {
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    var params = 'top=' + top + ', left=' + left + ', width=' + width + ', height=' + height;
    $(selector).click(function () {
      window.open(url, '_blank', params);
    });
  };
  var url = encodeURIComponent(location.href);
  var text = encodeURIComponent($(document).find('title').text());
  init('.hp-social-fb', 550, 420, 'https://www.facebook.com/sharer.php?u=' + url);
  init('.hp-social-tw', 550, 420, 'https://twitter.com/share?url=' + url + '&text=' + text);
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function showPlayerTip(msg) {
  $('#player-tip').text(msg).toggle(Boolean(msg));
}

function playM3U8(src) {
  window.location.hash = 'type=m3u8&src=' + encodeURIComponent(src);
  showPlayerTip('');
  if (isMobile()) {
    playM3U8byNative(src);
  } else {
    playM3U8byHlsJS(src);
  }
}

function playM3U8byNative(src) {
  var html =
    '<video id="player" style="width: 100%;" controls autoplay>' +
    '<source src="' + src + '" type="application/x-mpegurl">' +
    '<source src="' + src + '" type="video/mp4">' +
    '</video>';
  $('#player').replaceWith(html);
}

function playM3U8byHlsJS(src) {
  $('#player').replaceWith('<video id="player" style="width: 100%;" controls></video>');
  var video = document.getElementById('player');

  if (!window.Hls || !Hls.isSupported()) {
    showPlayerTip('이 브라우저는 hls.js 재생을 지원하지 않습니다.');
    return;
  }

  var hls = new Hls();
  hls.attachMedia(video);
  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    hls.loadSource(src);
  });
  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    console.log('manifest loaded, found ' + data.levels.length + ' quality level');
    video.play().catch(function () {});
  });
  hls.on(Hls.Events.ERROR, function (event, data) {
    if (data && data.fatal) {
      var code = data.response && data.response.code ? ' (HTTP ' + data.response.code + ')' : '';
      showPlayerTip('재생 실패' + code + ': 서버 접근 제한(403/CORS) 또는 스트림 오류일 수 있습니다.');
      hls.destroy();
    }
  });
}

function playMP4(src) {
  window.location.hash = 'type=mp4&src=' + encodeURIComponent(src);
  showPlayerTip('');
  var html = '<video id="player" controls autoplay><source src="' + src + '" type="video/mp4"></video>';
  $('#player').replaceWith(html);
}

$(document).ready(function () {
  initShareButtons();
  if (window.location.hash) {
    var hash = window.location.hash.substr(1);
    var result = hash.split('&').reduce(function (acc, item) {
      var parts = item.split('=');
      acc[parts[0]] = parts[1];
      return acc;
    }, {});
    if (result.src) {
      var src = decodeURIComponent(result.src);
      $('#player-src').val(src);
      if (result.type === 'mp4') {
        playMP4(src);
      } else {
        playM3U8(src);
      }
    }
  }
});
