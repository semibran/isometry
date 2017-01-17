(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

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

Image$1.load('tile.png', setup);

function setup(tile) {
  display.mount('#app');
  var width = tile.width / 2;
  var height = tile.height / 2;
  var side = 8;
  var area = side * side;
  for (var i = area; i--;) {
    var x = i % side;
    var y = (i - x) / side;
    display.context.drawImage(tile, display.width / 2 + (x - y - 1) * width, display.height / 2 + (x + y) * height - side / 2 * width);
  }
  loop();
}

function loop() {}

})));
//# sourceMappingURL=build.js.map
