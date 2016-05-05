function HomeCtrl() {

   HomeCtrl.prototype.enter = function() {
    if (navigator.mozGetUserMedia) {
      navigator.myGetMedia = navigator.mozGetUserMedia;
      navigator.myGetMedia({
        video: true
      }, this.connect, this.error);
    } else {
      alert('NO');
    }
  }

  let connect = (stream) => {
    let video = document.getElementById('my_video');
    let canvas;

    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    video.play();

    canvas = document.getElementById('c');
  }

  let error = (error) => {
    console.error(error);
  }

}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
