function enter() {

  if (navigator.mozGetUserMedia) {
    navigator.myGetMedia = navigator.mozGetUserMedia;
    navigator.myGetMedia({
      video: true
    }, connect, error);
  } else {
    alert("NO");
  }

  function connect(stream) {

    var video = document.getElementById("my_video");
    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    video.play();

    var canvas = document.getElementById("c");
  }

  function error(e) {
    console.log(e);
  }
}
