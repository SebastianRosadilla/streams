function Filters() {

  Filters.prototype.filters = {};

  Filters.prototype.getPixels = (img) => {
    let canvas = Filters.prototype.getCanvas(img.width, img.height);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0 , 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  Filters.prototype.getCanvas = (width, height) => {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  Filters.prototype.filterImage = (filter, image) => {
    let args = [Filters.prototype.getPixels(image)];
    for (let index = 2; index < arguments.length; index++) {
      args.push(arguments[index]);
    }
    return filter.apply(null, args);
  };

  Filters.prototype.grayscale = (pixels, args) => {
    let d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
  };

  Filters.prototype.brightness = (pixels, adjustment) => {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
      d[i] += adjustment;
      d[i + 1] += adjustment;
      d[i + 2] += adjustment;
    }
    return pixels;
  };

  Filters.prototype.threshold = (pixels, threshold) => {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
  };

  Filters.prototype.tmpCanvas = document.createElement('canvas');
  Filters.prototype.tmpCtx = Filters.prototype.tmpCanvas.getContext('2d');

  Filters.prototype.createImageData = (w, h) => {
    return Filters.prototype.tmpCtx.createImageData(w, h);
  };

  Filters.prototype.convolute = (pixels, weights, opaque) => {
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;
    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    var output = Filters.prototype.createImageData(w, h);
    var dst = output.data;
    // go through the destination image pixels
    var alphaFac = opaque ? 1 : 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y * w + x) * 4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r = 0,
          g = 0,
          b = 0,
          a = 0;
        for (var cy = 0; cy < side; cy++) {
          for (var cx = 0; cx < side; cx++) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy * sw + scx) * 4;
              var wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        dst[dstOff + 3] = a + alphaFac * (255 - a);
      }
    }
    return output;
  };


  return Filters.prototype;
}

export default {
  name: 'Filters',
  fn: Filters
};
