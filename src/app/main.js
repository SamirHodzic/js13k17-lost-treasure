import { setup, frame, win, onkey } from './game';
import { levels } from './maps/levels';
import { Utils } from './utils';
import { Menus } from './menus';

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    }
}

var life = 3;
var currentLvl = 0;
var inProgress = false;

function init() {
  Menus.addEndScreen();
  Menus.startScreen();
}

function playActive() {
  Menus.removeText('playButton');
  Menus.removeText('titleText');
  Menus.removeText('madeByText');
  showIntro();
}

function showIntro() {
  inProgress = true;
  Menus.showIntroScreen();

  setTimeout(() => {
    Menus.removeText('row1');
    Menus.removeText('row2');
    Menus.removeText('row3');
    showPreLevelScreen();
  }, 4000);
}

function startGame() {
  Menus.showCanvas();
  life = 3;
  setup(levels[currentLvl]);
  Menus.removeEndScreen();
}

function showPreLevelScreen() {
  Menus.showPreLevel(currentLvl + 1);

  setTimeout(() => {
    Menus.removeText('levelNo');
    if (currentLvl === 0) {
      startGame();
    } else {
      startNextLvl();
    }
  }, 3900);
}

function startNextLvl() {
  setup(levels[currentLvl]);
}

function finishCurrentLvl() {
  Menus.addEndScreen();

  if (currentLvl === levels.length - 1) {
    finishedLastLevel();
    return;
  }

  currentLvl++;

  setTimeout(() => {
    showPreLevelScreen();
    setTimeout(() => {
      Menus.removeEndScreen();
    }, 4000);
  }, 700);
}

function finishGameOver() {
  currentLvl = 0;
  Menus.addEndScreen();

  setTimeout(() => {
    Menus.gameOver();
    setTimeout(() => {
      Menus.removeText('gameOver');
      inProgress = false;
      init();
    }, 4000);
  }, 700);
}

function finishedLastLevel() {
  currentLvl = 0;
  setTimeout(() => {
    Menus.endGame();
    setTimeout(() => {
      Menus.removeText('endGameTitle');
      Menus.removeText('endGameSubtitle');
      Menus.removeText('madeByText');
      inProgress = false;
      init();
    }, 7000);
  }, 700);
}

function resetCurrentMap() {
  life--;
  setup(levels[currentLvl]);
}

init();
frame();

document.addEventListener('keydown', (ev) => {
  if (ev.keyCode === 32 && !inProgress) {
    playActive();
    return;
  }
  return onkey(ev, ev.keyCode, true);
}, false);

document.addEventListener('keyup', (ev) => {
  if (ev.keyCode === 32 && !inProgress) return;
  return onkey(ev, ev.keyCode, false);
}, false);

export { resetCurrentMap, finishCurrentLvl, finishGameOver, life };