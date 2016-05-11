function Filters() {

  /**
   * @param {imagen} imagen
   *
   * @desc obtain the pixels (imagen data) for
   *       the imagen.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Filters.prototype.getPixels = (imagen) => {
    let canvas = getCanvas(imagen.width, imagen.height);
    let context = canvas.getContext('2d');
    let imagenData;

    context.drawImage(imagen, 0 , 0);

    if (canvas.width > 0 && canvas.height > 0) {
      imagenData = context.getImageData(0, 0, canvas.width, canvas.height);
    } else {
      imagenData = context.getImageData(0, 0, 1, 1);
    }

    return imagenData
  };

  Filters.prototype.filterImage = (filter, image) => {
    let data = [Filters.prototype.getPixels(image)];

    for (let index = 2; index < arguments.length; index++) {
      data.push(arguments[index]);
    }

    return filter.apply(null, data);
  };

  /**
   * @param {object} pixels - some data imagen.
   *
   * @desc Apply grayscale filter to data imagen.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Filters.prototype.grayscale = (pixels) => {
    let data = pixels.data;
    let red;
    let green;
    let blue;
    let relativeLuminance;

    for (let index = 0; index < data.length; index += 4) {
      red = data[index];
      green = data[index + 1];
      blue = data[index + 2];

      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      relativeLuminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      data[index] = data[index + 1] = data[index + 2] = relativeLuminance
    }
  }

  /**
   * @param {object} pixels - some data imagen.
   * @param {number} adjustament - adjust apply to brightness
   *
   * @desc Apply brightness filter to data imagen.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Filters.prototype.brightness = (pixels, adjustment) => {
    let data = pixels.data;

    for (let index = 0; index < data.length; index += 4) {
      data[index] += adjustment;
      data[index + 1] += adjustment;
      data[index + 2] += adjustment;
    }
  }

  /**
   * @param {object} pixels - some data imagen.
   * @param {number} threshold - adjust apply to threshold.
   *
   * @desc Apply threshold filter to data imagen.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Filters.prototype.threshold = (pixels, threshold) => {
    let data = pixels.data;
    let red;
    let green;
    let blue;
    let relativeLuminance;

    for (var index = 0; index < data.length; index += 4) {
      red = data[index];
      green = data[index + 1];
      blue = data[index + 2];
      relativeLuminance =
        (0.2126 * red + 0.7152 * green + 0.0722 * blue >= threshold) ? 255 : 0;
      data[index] = data[index + 1] = data[index + 2] = relativeLuminance;
    }
  }

  /**
   * @param {object} pixels - some data imagen.
   * @param {number} red - min 0, max 255, default 255
   *        apply to the data image.
   * @param {number} green - min 0, max 255, default 255
   *        apply to the data image.
   * @param {number} blue - min 0, max 255, default 255
   *        apply to the data image.
   *
   * @desc Apply expecific uniform colors to data imagen.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Filters.prototype.mix = (pixels, red, green, blue) => {
    let data = pixels.data;

    for (let index = 0; index < data.length; index += 4) {
      data[index] = red;
      data[index + 1] = green;
      data[index + 2] = blue;
    }
  }

  //--------------------------- private functions ---------------------------//

  let getCanvas = (width, height) => {
    let canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    return canvas;
  };

  //--------------------------- private functions ---------------------------//

  return Filters.prototype;
}

export default {
  name: 'Filters',
  fn: Filters
};
