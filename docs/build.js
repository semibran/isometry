(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var Color = { isHex: isHex, toHex: toHex, toRGB: toRGB };

function isHex(value) {
  return value[0] === '#' && parseInt(value.slice(1), 16) < 16777215;
}

function toHex(color) {
  if (Array.isArray(color)) return '#' + color.map(function (channel) {
    return channel < 16 ? '0' + channel : channel.toString(16);
  }).join('');
  context.fillStyle = color;
  return context.fillStyle;
}

function toRGB(hex) {
  if (!isHex(hex)) hex = toHex(hex);
  var rgb = [];
  for (var i = 3; i--;) {
    rgb[i] = parseInt(hex.slice(i * 2 + 1, (i + 1) * 2 + 1), 16);
  }return rgb;
}

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var Alpha = { process: process };

function process(colors) {
  if (!Array.isArray(colors)) colors = [colors];
  var processed = [];

  for (var _len = arguments.length, images = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    images[_key - 1] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var image = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = colors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var color = _step2.value;

          image = processOne(Color.toRGB(color), image);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      processed.push(image);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (processed.length === 1) return processed[0];
  return processed;
}

function processOne(key, image) {
  var _key2 = slicedToArray(key, 3),
      red = _key2[0],
      green = _key2[1],
      blue = _key2[2];

  var width = image.width,
      height = image.height;


  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  console.log(canvas.toDataURL());

  var imageData = context.getImageData(0, 0, width, height);
  var data = imageData.data;

  var area = width * height;
  for (var i = area; i--;) {
    var index = i * 4;

    var _data$slice = data.slice(index, index + 4),
        _data$slice2 = slicedToArray(_data$slice, 4),
        r = _data$slice2[0],
        g = _data$slice2[1],
        b = _data$slice2[2],
        a = _data$slice2[3];

    if (a && r === red && g === green && b === blue) {
      data[index] = 0;
      data[index + 1] = 0;
      data[index + 2] = 0;
      data[index + 3] = 0;
    }
  }

  context.putImageData(imageData, 0, 0);

  console.log(canvas.toDataURL());

  return canvas;
}

var regex = /^\/?(?:.+\/)*(.+)\./;

var Image$1 = { load: load };

function load(paths, callback) {
  if (!callback) return;
  if (!Array.isArray(paths)) return loadOne(paths, callback);
  var images = [];
  var index = 0;
  var max = paths.length;
  var path = paths[index];
  var loaded = [path];
  function next(image) {
    var id = regex.exec(path)[1];
    if (!images[id]) images[id] = image;else images[id] = [images[id], image];
    images[index++] = image;
    if (index >= max) return callback(images);
    path = paths[index];
    loadOne(path, next);
  }
  loadOne(path, next);
}

function loadOne(path, callback) {
  if (!callback) return;
  var image = new Image();
  image.src = path;
  image.onload = function () {
    callback(image);
  };
}

var Display = { create: create };

function create(size) {
  var _size = slicedToArray(size, 2),
      width = _size[0],
      height = _size[1];

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext('2d');

  return {
    width: width, height: height, context: context,
    mount: mount, clear: clear, render: render
  };

  function mount(element) {
    if (typeof element === 'string') element = document.querySelector(element);
    if (!element) throw new TypeError('Cannot mount display on element ' + element);
    element.appendChild(canvas);
    clear();
  }

  function clear() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
  }

  function render() {}
}

var display = Display.create([320, 240]);

Image$1.load(['floor.png', 'wall.png'], setup);

function setup(sprites) {
  display.mount('#app');

  var floor = Alpha.process('magenta', sprites.floor);

  var width = 16;
  var height = 8;

  var side = 8;
  var area = side * side;
  for (var i = 0; i < area; i++) {
    var x = i % side;
    var y = (i - x) / side;
    display.context.drawImage(floor, display.width / 2 + (x - y - 1) * width, display.height / 2 + (x + y) * height - side / 2 * width);
  }
  loop();
}

function loop() {}

})));
//# sourceMappingURL=build.js.map
