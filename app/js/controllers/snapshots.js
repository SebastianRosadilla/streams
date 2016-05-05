function SnapShot(Effects) {
  'ngInject';

  const MEDIA_NAVIGATORS = [
    'getUserMedia',
    'webkitGetUserMedia',
    'mozGetUserMedia',
    'msGetUserMedia'
  ];

  SnapShot.prototype.start = () => {
    let media = this._config.navigator;

    // match browser with corresponding navigator object
    navigator.getMedia = navigator[media];

    navigator.getMedia({
      video: true
    }, (stream) => {
      this._config.video.src = window.URL.createObjectURL(stream);
      this._config.stream = stream;
    }, error);
  }

  SnapShot.prototype.snapshot = () => {
    let video = this._config.video;
    let canvasParent = this._config.canvasParent;
    let canvas = this._config.canvas;
    let ctx = this._config.ctx;

    if (this._config.stream) {
      ctx.drawImage(video, 0, 0, 300, 150);
      canvasParent.style['background-image'] = 'url('.concat(
        canvas.toDataURL('image/webp'), ')'
      );
      canvasParent.style['background-repeat'] = 'no-repeat';
    }
  }

  SnapShot.prototype.christmas = () => {
    let ctx = this._config.ctx;

    if (this._config.stream) {
      Effects.christmas(ctx, 300, 150);
    }
  }

  SnapShot.prototype.particles = () => {
    let canvas = this._config.canvas;
    let ctx = this._config.ctx;

    if (this._config.stream) {
      Effects.particles(canvas, ctx, 300, 150);
    }
  }


//-------------------- video functions --------------------//

let saveSnapShot = () => {

}

//-------------------- basic pre-configuration --------------------//

let error = (error) => {
  console.error(error);
}

this._config = (() => {
  let config = {
    video: document.querySelector('video'),
    canvasParent: document.getElementsByClassName('canvas')[0],
    canvas: document.querySelector('canvas')
  };
  let index = 0;

  config.ctx = config.canvas.getContext('2d');
  config.canvasParent.style.width = config.canvas.width;
  config.canvasParent.style.height = config.canvas.height;

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

return SnapShot.prototype;

}

export default {
  name: 'SnapShot',
  fn: SnapShot
};
