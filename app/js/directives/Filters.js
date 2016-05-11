function Filters(Streams) {
  'ngInject';

  let FILTERS = [{
    name: 'Gray Scale-1',
    class: 'grayScale'
  }, {
    name: 'Sepia-1',
    class: 'sepia'
  }, {
    name: 'Blur-10px',
    class: 'blur'
  }, {
    name: 'Brightness-10',
    class: 'brightness'
  }, {
    name: 'Contrast-10',
    class: 'grayScale'
  }, {
    name: 'Hue Rotate-180deg',
    class: 'hue-rotate'
  }, {
    name: 'Invert',
    class: 'invert-1'
  }, {
    name: 'Saturate',
    class: 'saturate'
  }, {
    name: 'Opacity',
    class: 'opacity'
  }]

  let createStruct = (element) => {
    let struct;

    for (let index = 0; index < FILTERS.length; index++) {
        struct = '<div>\n<video autoplay></video>\n<canvas></canvas>\n<h3>';
        struct = struct.concat(FILTERS[index].name, '</h3>\n</div>');
        element.append(struct);
    }
  }

  let link = (scope, element) => {
    let containers;
    let canvas;
    let videos;
    let context = [];
    let styles;

    createStruct(element);

    containers = element.children();
    canvas = containers.find('canvas');
    videos = containers.find('video');

    Streams.obtainVideo()
      .then((stream) => {
        setInterval(function () {
          for (let index = 0; index < containers.length; index++) {
            context.push(canvas[index].getContext('2d'));

            videos[index]
              .src = window.URL ? window.URL.createObjectURL(stream) : stream;

            context[index].drawImage(videos[index], 0, 0);

            // apply styles
            containers[index].style['background-image'] = 'url('.concat(
              canvas[index].toDataURL('image/jpeg', 1.0), ')'
            )

            containers[index].style['position'] = 'absolute';

          }
        }, 20);
      }, (error) => {
        throw error;
      })
  }

  return {
    restrict: 'EA',
    templateUrl: 'directives/Filters.html',
    replace: true,
    scope: {
      title: '@',
      message: '@clickMessage'
    },
    link: link
  };
}

export default {
  name: 'filters',
  fn: Filters
};
