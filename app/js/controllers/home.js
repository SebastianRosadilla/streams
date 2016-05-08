import $ from 'jquery';

function HomeCtrl($filter) {
  'ngInject';

  const MEDIA_NAVIGATORS = [
    'getUserMedia',
    'webkitGetUserMedia',
    'mozGetUserMedia',
    'msGetUserMedia'
  ];

  HomeCtrl.prototype.snapshot = () => {
    let video = this._config.video;
    let canvas = this._config.canvas;
    let image = this._config.image;
    let context = this._config.context;

    if (this._config.stream) {
      context.drawImage(video, 0, 0);
      image.src = canvas.toDataURL('image/webp');
    }
  }

  //-------------------- video functions --------------------//
  let videoPlay = (stream) => {
    let media = this._config.navigator;
    let video = this._config.video.DOMElement;

    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    this._config.stream = stream;
    video.play();

    this._intervale = setInterval(() => {
      let mainContainer = this._config.mainContainer.JQueryElement;
      let canvas = this._config.canvas.DOMElement;
      let context = this._config.context;
      let filters = this._config.filters;
      let image = new Image();
      let pixels;

      context.drawImage(video, 0, 0, 300, 150);
      image.src = canvas.toDataURL('image/jpeg', 1.0);
      pixels = $filter('Filters').getPixels(image);

      if (filters.grayscale) {
        image = $filter('Filters').grayscale(pixels);
        context.putImageData(image, 0, 0);
      } else if (filters.brightness) {
        image = $filter('Filters').brightness(
          pixels, SnapShot.prototype.bright
        );
        context.putImageData(image, 0, 0);
      } else if (filters.threshold) {
        image = $filter('Filters').threshold(
          pixels, SnapShot.prototype.hold
        );
        context.putImageData(image, 0, 0);
      } else if (filters.convolute) {
        image = $filter('Filters').convolute(
          pixels, [
            1, 0, 1,
            0.2, 0.5, 1,
            1, 0, 0
          ],
          12
        );
        context.putImageData(image, 0, 0);
      }
      mainContainer.css('background-image', 'url('.concat(
        canvas.toDataURL('image/jpeg', 1.0), ')'
      ));
      mainContainer.css('background-repeat', 'no-repeat');
      mainContainer.css('background-size', '100% 100%');
    }, 100)
  }

  //-------------------- basic pre-configuration --------------------//

  let error = (error) => {
    console.error(error);
  }

  this._config = (() => {
    let config = {
      mainContainer: {
        JQueryElement: $(document).find('#mainContainer')
      }
    };
    let index = 0;

    config.video = {
      JQueryElement: config.mainContainer.JQueryElement.children('video')
    };
    config.canvas = {
      JQueryElement: config.mainContainer.JQueryElement.children('canvas')
    }

    while (index < MEDIA_NAVIGATORS.length && !navigator[MEDIA_NAVIGATORS[index]]) {
      index++;
    }

    // verify elements and add DOM elements
    for (let element in config) {
      if (config.hasOwnProperty(element)) {
        if (config[element].JQueryElement.length === 0) {
          throw new Error(element.concat(
            ' not found. defining this._config.'
          ));
        } else {
          config[element].DOMElement = config[element].JQueryElement[0];
        }
      }
    }

    config.context = config.canvas.DOMElement.getContext('2d');

    config.filters = {
      grayscale: false,
      brightness: false,
      threshold: false,
      convolute: false
    }

    if (navigator[MEDIA_NAVIGATORS[index]]) {
      config.navigator = MEDIA_NAVIGATORS[index]
    } else {
      throw new Error('This navigator not support HTML5');
    }

    return config;
  })();

  let init = (() => {
    let media = this._config.navigator;
    let screenDimensions = {
      height: $(window).height(),
      width: $(window).width()
    }

    this._config.mainContainer.JQueryElement.css(screenDimensions);
    this._config.video.JQueryElement.css('display', 'none');
    this._config.canvas.JQueryElement.css('display', 'none');

    $(window).resize((event) => {
      screenDimensions = {
        height: $(window).height(),
        width: $(window).width()
      }

      this._config.mainContainer.JQueryElement.css(screenDimensions);
    })

    // match browser with corresponding navigator object
    navigator.getMedia = navigator[media];

    navigator.getMedia({
      video: true,
      audio: true
    }, videoPlay, error);
  })();

  return HomeCtrl.prototype;

}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
