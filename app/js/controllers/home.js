function HomeCtrl() {

  const MEDIA_NAVIGATORS = [
    'getUserMedia',
    'webkitGetUserMedia',
    'mozGetUserMedia',
    'msGetUserMedia'
  ];

  HomeCtrl.prototype.video = () => {
    let media = this._config.navigator;

    // match browser with corresponding navigator object
    navigator.getMedia = navigator[media];

    navigator.getMedia({
      video: true,
      audio: true
    }, videoPlay, error);
  }

  HomeCtrl.prototype.snapshot = () => {
    let video = this._config.video;
    let canvas = this._config.canvas;
    let image = this._config.image;
    let ctx = this._config.ctx;

    if (this._config.stream) {
      ctx.drawImage(video, 0, 0);
      image.src = canvas.toDataURL('image/webp');
    }
  }


  //-------------------- video functions --------------------//
  let videoPlay = (stream) => {
    let media = this._config.navigator;
    let video = this._config.video;

    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    video.setAttribute('controls', '');

    this._config.stream = stream;

    video.onloadedmetadata = (error) => {
       // Haz algo con el video aquí.
    };
  }

  let saveSnapShot = () => {

  }

  let disableCam = () => {
    let video = document.getElementById('my_video');

    video.pause();
  }

  let reload = () => {
    let video = document.getElementById('my_video');

    video.load();
  }

  //-------------------- basic pre-configuration --------------------//

  let error = (error) => {
    console.error(error);
  }

  this._config = (() => {
    let config = {
      video: document.getElementById('my_video'),
      image: document.querySelector('img'),
      canvas: document.querySelector('canvas')
    };
    let index = 0;

    config.ctx = config.canvas.getContext('2d');

    while (index < MEDIA_NAVIGATORS.length && !navigator[MEDIA_NAVIGATORS[index]]) {
      index++;
    }

    if (navigator[MEDIA_NAVIGATORS[index]]) {
      config.navigator = MEDIA_NAVIGATORS[index]
    } else {
      throw new Error('This navigator not support HTML5');
    }

    return config;
  })();

  return HomeCtrl.prototype;

}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
