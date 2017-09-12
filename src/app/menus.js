import { TextGen } from './text_gen';

var Menus = {
  startScreen: () => {
    var play = TextGen.generateWord('press space to play');
    TextGen.button(play, 'playButton');

    var title = TextGen.generateWord('lost treasure');
    TextGen.titleText(title);

    var madeBy = TextGen.generateWord('by samirh');
    TextGen.madeByText(madeBy);
  },
  showIntroScreen: () => {
    var row1 = TextGen.generateWord('many years ago');
    TextGen.introText(row1, 'top', 190, 'row1');

    var row2 = TextGen.generateWord('flo lost his gems');
    TextGen.introText(row2, 'middle', 235, 'row2');

    var row3 = TextGen.generateWord('help him to get them back');
    TextGen.introText(row3, 'bottom', 335, 'row3');
  },
  showPreLevel: (lvl) => {
    var level = TextGen.generateWord('level ' + lvl);
    TextGen.text(level, 'levelNo', 100, { scale: 3, margin: 10 });
  },
  gameOver: () => {
    var over = TextGen.generateWord('game over');
    TextGen.text(over, 'gameOver', 280, { scale: 6, margin: 25 });
  },
  endGame: () => {
    var title = TextGen.generateWord('congratulations');
    TextGen.endGameTitle(title);

    var completed = TextGen.generateWord('gems are on safe');
    TextGen.text(completed, 'endGameSubtitle', 305, { scale: 4, margin: 15 });

    var madeBy = TextGen.generateWord('by samirh');
    TextGen.madeByText(madeBy);
  },
  addEndScreen: () => {
    document.getElementById('menus').setAttribute('style', 'box-shadow: inset 0 0 0 220px #111;');
  },
  removeEndScreen: () => {
    document.getElementById('menus').setAttribute('style', 'box-shadow: inset 0 0 0 0 #111;');
  },
  showCanvas: () => {
    document.getElementById('game').style.display = 'block';
  },
  removeText: (id) => {
    var el = document.getElementById(id);
    el.parentNode.removeChild(el);
  }
};

export { Menus };