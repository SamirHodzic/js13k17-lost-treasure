import { font } from './constants';

var TextGen = {
  mapping: {
    'a': 0,
    'b': 3,
    'c': 6,
    'd': 9,
    'e': 12,
    'f': 15,
    'g': 18,
    'h': 21,
    'i': 24,
    'j': 27,
    'k': 30,
    'l': 33,
    'm': 36,
    'n': 39,
    'o': 42,
    'p': 45,
    'q': 48,
    'r': 51,
    's': 54,
    't': 57,
    'u': 60,
    'v': 63,
    'w': 66,
    'x': 69,
    'y': 72,
    'z': 75,
    '0': 78,
    '1': 81,
    '2': 84,
    '3': 87,
    '4': 90,
    '5': 93,
    '6': 96,
    '7': 99,
    '8': 102,
    '9': 105,
    ' ': 108
  },
  generateWord: (text) => {
    var l = text.length;
    var arr = [];

    for (var i = 0; i < l; i++) {
      arr.push(TextGen.mapping[text[i]]);
    }

    return arr;
  },
  titleText: (arr) => {
    var mainBlock = document.getElementById('renders');
    var div = document.createElement('div');

    div.setAttribute('style', 'position: absolute; top: 40px; right: 0; left: 0; margin: auto; width: 460px; height: 28px;')
    div.id = 'titleText';

    mainBlock.appendChild(div);

    arr.forEach((el) => {
      var span = TextGen.createSpan(el, 8, 30);
      div.appendChild(span);
    }, this);
  },
  madeByText: (arr) => {
    var mainBlock = document.getElementById('renders');
    var div = document.createElement('div');

    div.setAttribute('style', 'position: absolute; bottom: 30px; right: 0; left: 0; margin: auto; width: 130px; height: 28px;')
    div.id = 'madeByText';

    mainBlock.appendChild(div);

    arr.forEach((el) => {
      var span = TextGen.createSpan(el, 3, 10);
      div.appendChild(span);
    }, this);
  },
  introText: (arr, position, width, id) => {
    var mainBlock = document.getElementById('renders');
    var div = document.createElement('div');
    var pos;

    switch (position) {
      case 'top':
        pos = 'top: 150px;';
        break;
      case 'bottom':
        pos = 'bottom: 150px;';
        break;
      case 'middle':
        pos = 'top: 0; bottom: 0;';
        break;
    }

    div.setAttribute('style', 'position: absolute; ' + pos + ' right: 0; left: 0; margin: auto; width: ' + width + 'px; height: 28px;')
    div.id = id;

    mainBlock.appendChild(div);

    arr.forEach((el) => {
      var span = TextGen.createSpan(el, 3, 10);
      div.appendChild(span);
    }, this);
  },
  button: (arr, id, position = {}) => {
    var mainBlock = document.getElementById('renders');
    var div = document.createElement('div');

    div.setAttribute('style', 'position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: auto; width: 355px; height: 28px; opacity: 1; animation: fadeinout 1s infinite;')
    div.id = id;

    mainBlock.appendChild(div);

    arr.forEach((el) => {
      var span = TextGen.createSpan(el, 4, 15);
      div.appendChild(span);
    }, this);
  },
  text: (arr, id, width, sizes) => {
    var mainBlock = document.getElementById('renders');
    var div = document.createElement('div');

    div.setAttribute('style', 'position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: auto; width: ' + width + 'px; height: 28px;')
    div.id = id;

    mainBlock.appendChild(div);

    arr.forEach((el) => {
      var span = TextGen.createSpan(el, sizes.scale, sizes.margin);
      div.appendChild(span);
    }, this);
  },
  endGameTitle: (arr) => {
    var mainBlock = document.getElementById('renders');
    var div = document.createElement('div');

    div.setAttribute('style', 'position: absolute; top: 100px; right: 0; left: 0; margin: auto; width: 450px; height: 28px;')
    div.id = 'endGameTitle';

    mainBlock.appendChild(div);

    arr.forEach((el) => {
      var span = TextGen.createSpan(el, 6, 25);
      div.appendChild(span);
    }, this);
  },
  createSpan: (val, scale = 1, margin = 0) => {
    var div = document.createElement('div');
    div.setAttribute('style', 'transform: scale(' + scale + '); margin-left: ' + margin + 'px; image-rendering: pixelated; image-rendering: optimizespeed; image-rendering: crisp-edges; display: inline-block; height: 5px; width: 3px; background: url(' + font + ') -' + val + 'px 0;');
    return div;
  }
};

export { TextGen };