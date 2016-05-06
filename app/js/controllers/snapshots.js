function SnapShot(Effects, $filter) {
  'ngInject';

  const MEDIA_NAVIGATORS = [
    'getUserMedia',
    'webkitGetUserMedia',
    'mozGetUserMedia',
    'msGetUserMedia'
  ];

  let filters = {
    grayscale: false,
    brightness: false,
    threshold: false,
    convolute: false
  }

  SnapShot.prototype.bright = 80;

  SnapShot.prototype.hold = 80;

  SnapShot.prototype.start = () => {
    let media = this._config.navigator;
    let video = this._config.video;
    let canvasParent = this._config.canvasParent;
    let canvas = this._config.canvas;
    let ctx = this._config.ctx;

    this._intervale;

    // match browser with corresponding navigator object
    navigator.getMedia = navigator[media];

    navigator.getMedia({
      video: true
    }, (stream) => {
      this._config.video.src = window.URL.createObjectURL(stream);
      this._config.stream = stream;

      canvasParent.style.height = canvas.clientHeight.toString().concat('px');
      canvasParent.style.width = window.innerWidth.toString().concat('px');
      window.addEventListener('resize', (event) => {
        canvasParent.style.width = window.innerWidth.toString().concat('px');
      })
      canvasParent.style['background-position'] = 'center';
      canvas.style.display = 'none';

      this._intervale = setInterval(() => {
        let image = new Image();
        let pixels;

        ctx.drawImage(video, 0, 0, 300, 150);
        image.src = canvas.toDataURL('image/webp');
        pixels = $filter('Filters').getPixels(image);

        if (filters.grayscale) {
          image = $filter('Filters').grayscale(pixels);
          ctx.putImageData(image, 0, 0);
        } else if (filters.brightness) {
          image = $filter('Filters').brightness(
            pixels,SnapShot.prototype.bright
          );
          ctx.putImageData(image, 0, 0);
        } else if (filters.threshold) {
          image = $filter('Filters').threshold(
            pixels, SnapShot.prototype.hold
          );
          ctx.putImageData(image, 0, 0);
        } else if (filters.convolute) {
          image = $filter('Filters').convolute(
            pixels,
            [
              1, 0 , 1,
              0.2, 0.5, 1,
              1, 0, 0
            ],
            12
          );
          ctx.putImageData(image, 0, 0);
        }
        canvasParent.style['background-image'] = 'url('.concat(
          canvas.toDataURL('image/webp'), ')'
        );
        canvasParent.style['background-repeat'] = 'no-repeat';
      }, 100)

    }, error);
  }

  SnapShot.prototype.snapshot = () => {
    let canvas = this._config.canvas;

    saveSnapShot(canvas);
  }

  SnapShot.prototype.change = (fil) => {
    for (let filter in filters) {
      if (filters.hasOwnProperty(filter)) {
        filters[filter] = false;
      }
    }
    filters[fil] = !filters[fil];
  }

  SnapShot.prototype.stop = () => {
    clearInterval(this._intervale);
    this._iterator = 0;
  }

  let downloadCanvas = (link, canvasId, filename) => {
    if (this._config.stream) {
      link.href = this._config.canvas.toDataURL("image/jpeg", 1.0);
      link.download = filename;
    }
  }

  /**
   * The event handler for the link's onclick event. We give THIS as a
   * parameter (=the link element), ID of the canvas and a filename.
   */
  document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'canvas', 'image.jpg');
  }, false);

  SnapShot.prototype.images = ((that) => {
    let images = [];

    that._iterator = 0;

    for (let index = 0; index < 9; index++) {
      images.push({
        src: './images/angular.png',
        alt: 'Fail to charge image'
      });
    }

    return images;
  })(this);

  //-------------------- video functions --------------------//

  let saveSnapShot = (canvas) => {
    let video = this._config.video;
    let ctx = this._config.ctx;

    ctx.drawImage(video, 0, 0, video.width, video.height);
    SnapShot.prototype.images[this._iterator].src = canvas.toDataURL();

    this._iterator > 7 ? this._iterator = 0 : this._iterator++;;

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
