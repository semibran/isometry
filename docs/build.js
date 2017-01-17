(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

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











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var directions = {
  LEFT: [-1, 0],
  UP_LEFT: [-1, -1],
  UP: [0, -1],
  UP_RIGHT: [1, -1],
  RIGHT: [1, 0],
  DOWN_RIGHT: [1, 1],
  DOWN: [0, 1],
  DOWN_LEFT: [-1, 1]
};
var LEFT = directions.LEFT;
var UP = directions.UP;
var RIGHT = directions.RIGHT;
var DOWN = directions.DOWN;

var cardinalDirections = { LEFT: LEFT, UP: UP, RIGHT: RIGHT, DOWN: DOWN };

var Cell = {
  directions: directions, cardinalDirections: cardinalDirections,
  isCell: isCell, isEqual: isEqual, isEdge: isEdge, isInside: isInside, isNeighbor: isNeighbor, toString: toString, fromString: fromString, toIndex: toIndex, fromIndex: fromIndex, getNeighbors: getNeighbors, getManhattan: getManhattan, getDistance: getDistance
};

function isCell(value) {
  return value && Array.isArray(value) && value.length === 2 && !value.filter(function (value) {
    return isNaN(value) || typeof value !== 'number';
  }).length;
}

function isEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function isEdge(cell, size) {
  var _cell = slicedToArray(cell, 2),
      x = _cell[0],
      y = _cell[1];

  var rect = [0, 0, size, size];
  if (Array.isArray(size)) rect = size;

  var _rect = rect,
      _rect2 = slicedToArray(_rect, 4),
      rectX = _rect2[0],
      rectY = _rect2[1],
      rectWidth = _rect2[2],
      rectHeight = _rect2[3];

  return isInside(cell, size) && (x === rectX || x === rectX + rectWidth - 1 || y === rectY || y === rectY + rectHeight - 1);
}

function isInside(cell, size) {
  var _cell2 = slicedToArray(cell, 2),
      x = _cell2[0],
      y = _cell2[1];

  var rect = [0, 0, size, size];
  if (Array.isArray(size)) rect = size;

  var _rect3 = rect,
      _rect4 = slicedToArray(_rect3, 4),
      rectX = _rect4[0],
      rectY = _rect4[1],
      rectWidth = _rect4[2],
      rectHeight = _rect4[3];

  return x >= rectX && y >= rectY && x < rectX + rectWidth && y < rectY + rectHeight;
}

function isNeighbor(cell, other) {
  var _cell3 = slicedToArray(cell, 2),
      cx = _cell3[0],
      cy = _cell3[1];

  var _other = slicedToArray(other, 2),
      ox = _other[0],
      oy = _other[1];

  var dx = Math.abs(ox - cx);
  var dy = Math.abs(oy - cy);
  return (!dx || dx === 1) && (!dy || dy === 1);
}

function toString(cell) {
  return cell.toString();
}

function fromString(string) {
  return string.split(',').map(Number);
}

function toIndex(cell, size) {
  var _cell4 = slicedToArray(cell, 2),
      x = _cell4[0],
      y = _cell4[1];

  return y * size + x;
}

function fromIndex(index, size) {
  var x = index % size;
  var y = (index - x) / size;
  return [x, y];
}

function getNeighbors(cell, diagonals, step) {
  if (!isCell(cell)) throw new TypeError('Cannot get neighbors of cell \'' + cell + '\'');
  step = step || 1;

  var _cell5 = slicedToArray(cell, 2),
      x = _cell5[0],
      y = _cell5[1];

  var neighbors = [];
  var dirs = cardinalDirections;
  if (diagonals) dirs = directions;
  for (var key in dirs) {
    var _dirs$key = slicedToArray(dirs[key], 2),
        dx = _dirs$key[0],
        dy = _dirs$key[1];

    var current = [x + dx * step, y + dy * step];
    var cx = current[0],
        cy = current[1];

    neighbors.push([cx, cy]);
  }
  return neighbors;
}

function getManhattan(a, b) {
  var _a = slicedToArray(a, 2),
      ax = _a[0],
      ay = _a[1];

  var _b = slicedToArray(b, 2),
      bx = _b[0],
      by = _b[1];

  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function getDistance(a, b, sqrt) {
  if (typeof sqrt === 'undefined') sqrt = true;

  var _a2 = slicedToArray(a, 2),
      ax = _a2[0],
      ay = _a2[1];

  var _b2 = slicedToArray(b, 2),
      bx = _b2[0],
      by = _b2[1];

  var dx = bx - ax,
      dy = by - ay;

  var squared = dx * dx + dy * dy;
  if (sqrt) return Math.sqrt(squared);
  return squared;
}

var tileData = ['floor walkable', 'wall opaque', 'door opaque door', 'doorOpen walkable door', 'doorSecret opaque door secret', 'entrance walkable stairs', 'exit walkable stairs'];

var tiles = function (tileData) {
  var tiles = [];
  var i = tileData.length;
  while (i--) {
    var tile = tiles[i] = { type: 'tile', id: i };

    var _tileData$i$split = tileData[i].split(' '),
        _tileData$i$split2 = toArray(_tileData$i$split),
        kind = _tileData$i$split2[0],
        props = _tileData$i$split2.slice(1);

    tile.kind = kind;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var prop = _step.value;

        tile[prop] = true;
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
  }
  return tiles;
}(tileData);

var tileNames = Object.keys(tiles);

var tileIds = function (tiles) {
  var tileIds = {};
  var i = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = tiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var tile = _step2.value;

      var id = tile.kind.split('').reduce(function (result, char, index) {
        var CHAR = char.toUpperCase();
        if (char === CHAR || !index) result[result.length] = '';
        result[result.length - 1] += CHAR;
        return result;
      }, []).join('_');
      tileIds[id] = i;
      i++;
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

  return tileIds;
}(tiles);

var tileCosts = function (tiles) {
  var tileCosts = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = tiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var tile = _step3.value;

      var cost = 0;
      if (!tile.walkable && !tile.door) cost = Infinity;
      if (tile.secret) cost = 1000;
      if (tile.door) {
        cost++;
        if (!tile.walkable) cost++;
      }
      tileCosts.push(cost);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return tileCosts;
}(tiles);

var WALL$1 = tileIds.WALL;


var World$$1 = {
  tiles: tiles, tileNames: tileNames, tileIds: tileIds, tileCosts: tileCosts,
  create: create
};

function create(size) {

  var area = size * size;
  var data = new Uint8ClampedArray(area);

  var world = {
    size: size, data: data, elements: new Set(), entrance: null, exit: null,
    getAt: getAt, tileAt: tileAt, elementsAt: elementsAt, setAt: setAt, fill: fill, clear: clear, spawn: spawn, kill: kill, findPath: findPath, findStep: findStep
  };

  return world;

  function getAt(cell) {
    if (!Cell.isInside(cell, size)) return null;
    var index = Cell.toIndex(cell, size);
    return data[index];
  }

  function tileAt(cell) {
    return tiles[getAt(cell)];
  }

  function elementsAt(cell) {
    return [].concat(toConsumableArray(world.elements)).filter(function (element) {
      return Cell.isEqual(cell, element.cell);
    });
  }

  function setAt(cell, value) {
    if (!Cell.isInside(cell, size)) return null;
    var index = Cell.toIndex(cell, size);
    data[index] = value;
    return value;
  }

  function fill(rect, value) {

    if (!Array.isArray(rect)) rect = [0, 0, size, size];

    if (isNaN(value)) value = WALL$1;

    var _rect = rect,
        _rect2 = slicedToArray(_rect, 4),
        rectX = _rect2[0],
        rectY = _rect2[1],
        rectWidth = _rect2[2],
        rectHeight = _rect2[3];

    var area = rectWidth * rectHeight;

    var i = area;
    while (i--) {
      var _Cell$fromIndex = Cell.fromIndex(i, rectWidth),
          _Cell$fromIndex2 = slicedToArray(_Cell$fromIndex, 2),
          x = _Cell$fromIndex2[0],
          y = _Cell$fromIndex2[1];

      var index = Cell.toIndex([x + rectX, y + rectY], size);
      data[index] = value;
    }

    return world;
  }

  function clear(rect) {
    return world;
  }

  function spawn(element, cell) {
    element.world = world;
    element.cell = cell;
    world.elements.add(element);
  }

  function kill(element) {
    return world.elements.delete(element);
  }

  function findPath(start, goal, costs, diagonals) {

    if (!costs) costs = {};

    if (!costs.tiles) costs.tiles = tileCosts;

    if (!costs.cells) costs.cells = {};

    var path = [];

    var startKey = start.toString();
    var goalKey = goal.toString();

    var opened = [startKey];
    var closed = {};

    var scores = { f: {}, g: {} };
    var parent = {};

    var cells = data.map(function (id, index) {
      return Cell.fromIndex(index, size);
    });
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = cells[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _cell2 = _step4.value;

        scores.g[_cell2] = Infinity;
        scores.f[_cell2] = Infinity;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    scores.g[start] = 0;
    scores.f[start] = Cell.getManhattan(start, goal);

    while (opened.length) {
      if (opened.length > 1) opened = opened.sort(function (a, b) {
        return scores.f[b] - scores.f[a];
      });
      var cellKey = opened.pop();
      var cell = Cell.fromString(cellKey);
      if (cellKey === goalKey) {
        var _cell = goal;
        do {
          path.unshift(_cell);
          _cell = parent[_cell];
        } while (_cell);
        return path;
      }
      closed[cell] = true;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Cell.getNeighbors(cell, diagonals)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var neighbor = _step5.value;

          if (!Cell.isInside(neighbor, size) || neighbor in closed) continue;
          var key = neighbor.toString();
          var tileCost = costs.tiles[getAt(neighbor)] || 0;
          var cellCost = costs.cells[neighbor] || 0;
          var cost = tileCost + cellCost;
          if (cost === Infinity && key !== goalKey) continue;
          var g = scores.g[cell] + 1 + cost;
          if (!opened.includes(key)) opened.push(key);else if (g >= scores.g[neighbor]) continue;
          parent[neighbor] = cell;
          scores.g[neighbor] = g;
          scores.f[neighbor] = g + Cell.getManhattan(neighbor, goal);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }

    return null;
  }

  function findStep(path, cell) {
    if (!path) return null;
    var next = void 0,
        index = 0;
    do {
      next = path[index++];
    } while (next && !Cell.isEqual(cell, next));
    next = path[index];
    if (!next) return null;

    var _cell3 = slicedToArray(cell, 2),
        cx = _cell3[0],
        cy = _cell3[1];

    var _next = next,
        _next2 = slicedToArray(_next, 2),
        nx = _next2[0],
        ny = _next2[1];

    var step = [nx - cx, ny - cy];
    return step;
  }
}

var RNG = create$1();
RNG.create = create$1;

function create$1(initialSeed) {

  if (isNaN(initialSeed)) initialSeed = Math.random() * 10000;

  var currentSeed = initialSeed;

  return { get: get$$1, choose: choose, seed: seed };

  function get$$1(min, max) {
    var a = arguments.length;
    if (a === 0) {
      var x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    } else if (a === 1) {
      if (!isNaN(min)) max = min, min = 0;else if (Array.isArray(min)) {
        
        var _min = min;

        var _min2 = slicedToArray(_min, 2);

        min = _min2[0];
        max = _min2[1];
      }
    }
    if (min > max) {
      
      var _ref = [max, min];
      min = _ref[0];
      max = _ref[1];
    }return Math.floor(get$$1() * (max - min)) + min;
  }

  function choose(array) {
    if (Array.isArray(array) && !array.length) return null;
    if (!isNaN(array)) return !get$$1(array);
    if (!array) array = [0, 1];
    return array[get$$1(array.length)];
  }

  function seed(newSeed) {
    if (!isNaN(newSeed)) initialSeed = currentSeed = newSeed;
    return currentSeed;
  }
}

var _World$tileIds$1 = World$$1.tileIds;
var FLOOR$2 = _World$tileIds$1.FLOOR;
var WALL$2 = _World$tileIds$1.WALL;


var rng = RNG.create();

var Dungeon$$1 = { create: create$2 };

function create$2(size) {

  var area = size * size;
  var center = (size - 1) / 2;
  var world = World$$1.create(size).fill();

  var data = world.data;

  var i = area;
  while (i--) {
    var cell = void 0,
        _cell = cell = Cell.fromIndex(i, size),
        _cell2 = slicedToArray(_cell, 2),
        x = _cell2[0],
        y = _cell2[1];
    var id = FLOOR$2;
    if (Cell.isEdge(cell, size) && x !== center && y !== center || x === center && y === center) id = WALL$2;
    data[i] = id;
  }

  return world;
}

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

var Alpha = { process: process };

function process(images) {
  if (!Array.isArray(images)) images = [images];
  var processed = [];

  for (var _len = arguments.length, colors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    colors[_key - 1] = arguments[_key];
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

var Display = { create: create$3 };

function create$3(size) {
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

var WORLD_SIZE = 9;

var _World$tileIds = World$$1.tileIds;
var FLOOR = _World$tileIds.FLOOR;
var WALL = _World$tileIds.WALL;


var display = Display.create([320, 240]);
var world = Dungeon$$1.create(WORLD_SIZE);

Image$1.load(['floor.png', 'wall.png', 'shadow.png'], setup);

function setup(sprites) {
  display.mount('#app');

  var _sprites = sprites = Alpha.process(sprites, 'magenta'),
      _sprites2 = slicedToArray(_sprites, 3),
      floor = _sprites2[0],
      wall = _sprites2[1],
      shadow = _sprites2[2];

  var sprite = floor;

  var size = WORLD_SIZE;
  var area = size * size;

  for (var i = 0; i < area; i++) {
    var cell = void 0,
        _cell = cell = Cell.fromIndex(i, size),
        _cell2 = slicedToArray(_cell, 2),
        cx = _cell2[0],
        cy = _cell2[1];
    var id = world.data[i];
    var _sprite = sprites[id];

    var elevation = getIsoElevation(_sprite);

    var _getIsoPos = getIsoPos(cell, _sprite.width),
        _getIsoPos2 = slicedToArray(_getIsoPos, 2),
        x = _getIsoPos2[0],
        y = _getIsoPos2[1];

    x += display.width / 2;
    y += display.height / 2 - (size / 2 + elevation) * _sprite.width / 2;

    display.context.drawImage(_sprite, x, y);
    if (id === FLOOR && world.getAt([cx - 1, cy]) === WALL) display.context.drawImage(shadow, x, y);
  }

  loop();
}

function loop() {}

function getIsoPos(cell, tileSize) {
  var _cell3 = slicedToArray(cell, 2),
      x = _cell3[0],
      y = _cell3[1];

  return [(x - y - 1) * tileSize / 2, (x + y) * tileSize / 4];
}

function getIsoElevation(sprite) {
  return (sprite.height - sprite.width / 2) / (sprite.width / 2);
}

})));
//# sourceMappingURL=build.js.map
