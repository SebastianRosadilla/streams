import $ from 'jquery';

function HomeCtrl($scope, $filter, Streams) {
  'ngInject';

  /**
   * the object this._config.filters it's created
   * this object contain booleans (default false), that
   * represent the value (active or disable) for the filters
   * added inside this dicctionary.
   */
  const FILTERS = [
    'grayscale',
    'brightness',
    'threshold',
    'mix'
  ];

  /**
   * the object $scope
   * contain booleans (default false), that
   * represent the value (active or disable) for the buttons
   * added inside this dicctionary.
   */
  const VIEW_DYNAMIC_BUTTONS = [
    'video',
    'sound'
  ];

  $scope.snapshot = () => {
    let video = this._config.video;
    let canvas = this._config.canvas;
    let image = this._config.image;
    let context = this._config.context;

    if (this._config.stream) {
      context.drawImage(video, 0, 0);
      image.src = canvas.toDataURL('image/webp');
    }
  }

  $scope.videoStream = () => {
    $scope.video ? play() : pause();

    $scope.video = !$scope.video;
  }

  $scope.soundStream = () => {
    $scope.sound ? unmute() : mute();

    $scope.sound = !$scope.sound;
  }

  //-------------------- video functions --------------------//

  let streamOn = (stream) => {
    let media = this._config.navigator;
    let video = this._config.video.DOMElement;

    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    this._config.stream = stream;
    video.play();
    mute();

    this._intervale = setInterval(() => {
      let mainContainer = this._config.mainContainer.JQueryElement;
      let canvas = this._config.canvas.DOMElement;
      let context = this._config.context;
      let filters = this._config.filters;
      let image = new Image();
      let pixels;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
      }

      mainContainer.css('background-image', 'url('.concat(
        canvas.toDataURL('image/jpeg', 1.0), ')'
      ));
      mainContainer.css('background-repeat', 'no-repeat');
      mainContainer.css('background-size', '100% 100%');
    }, 100)
  }

  let play = () => {
    this._config.video.DOMElement.play();
  }

  let pause = () => {
    this._config.video.DOMElement.pause();
  }

  let mute = () => {
    this._config.video.DOMElement.muted = true;
  }

  let unmute = () => {
    this._config.video.DOMElement.muted = false;
  }

  let factoryFilter = function(name, functionName) {
    this.name = name;
    this.function = $filter('Filters')[functionName];
  }

  //-------------------- basic pre-configuration --------------------//

  let error = (error) => {
    throw error;
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

    config.filters = {};
    for (let index = 0; index < FILTERS.length; index++) {
      config.filters[FILTERS[index]] = false;
    }

    config.navigator = Streams.mediaNavigator;

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

    for (let index = 0; index < VIEW_DYNAMIC_BUTTONS.length; index++) {
      $scope[VIEW_DYNAMIC_BUTTONS[index]] = false;
    }

    // create filters objects
    $scope.filters = {
      grayScale: new factoryFilter('Gray Scale', 'grayscale'),
      brightness: new factoryFilter('Brightness', 'brightness'),
      threshold: new factoryFilter('Threshold', 'threshold')
    };

    Streams.obtainMedia()
      .then((stream) => {
        streamOn(stream);
      }, (error) => {
        throw (error);
      })
  })();
}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
