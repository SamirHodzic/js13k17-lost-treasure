import { timestamp, bound, overlap } from './helpers';
import { MAP, TILE, GRAVITY, MAXDX, MAXDY, ACCEL, FRICTION, IMPULSE, DIAMOND_COLORS, KEY, fps, step, canvas, ctx, width, height, assets, font } from './constants';
import { Utils } from './utils';
import { resetCurrentMap, finishCurrentLvl, finishGameOver, life } from './main';
import { TextGen } from './text_gen';

var player = {},
  chest = {},
  enemies = [],
  treasure = [],
  spikes = [],
  cells = [],
  win = false,
  gameOver = false;

var t2p = (t) => {
    return t * TILE;
  },
  p2t = (p) => {
    return Math.floor(p / TILE);
  },
  cellAvailable = (x, y) => {
    return tcell(p2t(x), p2t(y));
  },
  tcell = (tx, ty, notRend = true) => {
    var cell = cells[tx + (ty * MAP.tw)];
    if (notRend && cell >= 22) return 0;
    return cell;
  };

function onkey(ev, key, down) {
  switch (key) {
    case KEY.LEFT:
      player.left = down;
      ev.preventDefault();
      return false;
    case KEY.RIGHT:
      player.right = down;
      ev.preventDefault();
      return false;
    case KEY.SPACE:
      player.jump = down;
      ev.preventDefault();
      return false;
  }
}

function update(dt) {
  updatePlayer(dt);
  updateEnemies(dt);
  updateSpikes(dt);
  checkTreasure();
  if (treasure.length === player.collected) checkChest();
}

function updatePlayer(dt) {
  updateEntity(player, dt, true);
}

function updateEnemies(dt) {
  for (var n = 0; n < enemies.length; n++) {
    updateEnemy(enemies[n], dt);
  }
}

function updateEnemy(enemy, dt) {
  updateEntity(enemy, dt);

  if (overlap(player.x, player.y, TILE, TILE, enemy.x, enemy.y, TILE, TILE)) {
    Utils.startShake();
    killPlayer(player);
  }
}

function updateSpikes(dt) {
  for (var n = 0; n < spikes.length; n++) {
    var spike = spikes[n];

    if (overlap(player.x, player.y, TILE, TILE, spike.x, spike.y - TILE, TILE, TILE)) {
      Utils.startShake();
      killPlayer(player);
    }
  }
}

function checkTreasure() {
  for (var n = 0; n < treasure.length; n++) {
    var t = treasure[n];

    if (!t.collected && overlap(player.x, player.y, TILE, TILE, t.x, t.y, TILE, TILE)) collectTreasure(t);
  }
}

function checkChest() {
  if (win) return;
  if (overlap(player.x, player.y, TILE, TILE, chest.x, chest.y - TILE, TILE, TILE)) {
    win = true;
    finishCurrentLvl();
  }
}

function killPlayer(player) {
  if (life === 1) {
    gameOver = true;
    finishGameOver();
  }
  player = {};
  enemies = [];
  spikes = [];
  treasure = [];
  cells = [];
  if (life !== 1) resetCurrentMap();
}

function collectTreasure(t) {
  player.collected++;
  t.collected = true;
}

function updateEntity(entity, dt, player_entity = false) {
  var wasleft = entity.dx < 0,
    wasright = entity.dx > 0,
    falling = entity.falling,
    friction = entity.friction * (falling ? 0.5 : 1),
    accel = entity.accel * (falling ? 0.5 : 1);

  if (player_entity) checkPlayerPositions(entity);

  entity.ddx = 0;
  entity.ddy = entity.gravity;

  if (entity.left) {
    entity.orientation = 'left';
    entity.ddx = entity.ddx - accel;
  } else if (wasleft) {
    entity.ddx = entity.ddx + friction;
  }

  if (entity.right) {
    entity.orientation = 'right';
    entity.ddx = entity.ddx + accel;
  } else if (wasright) {
    entity.ddx = entity.ddx - friction;
  }

  if (entity.jump && !entity.jumping && !falling) {
    entity.ddy = entity.ddy - entity.impulse;
    entity.jumping = true;
  }

  entity.x = entity.x + (dt * entity.dx);
  entity.y = entity.y + (dt * entity.dy);
  entity.dx = bound(entity.dx + (dt * entity.ddx), -entity.maxdx, entity.maxdx);
  entity.dy = bound(entity.dy + (dt * entity.ddy), -entity.maxdy, entity.maxdy);

  if ((wasleft && (entity.dx > 0)) || (wasright && (entity.dx < 0))) entity.dx = 0;

  var tx = p2t(entity.x),
    ty = p2t(entity.y),
    nx = entity.x % TILE,
    ny = entity.y % TILE,
    cell = tcell(tx, ty),
    cellright = tcell(tx + 1, ty),
    celldown = tcell(tx, ty + 1),
    celldiag = tcell(tx + 1, ty + 1);

  if (entity.dy > 0) {
    if ((celldown && !cell) || (celldiag && !cellright && nx)) {
      entity.y = t2p(ty);
      entity.dy = 0;
      entity.falling = false;
      entity.jumping = false;
      ny = 0;
    }
  } else if (entity.dy < 0) {
    if ((cell && !celldown) || (cellright && !celldiag && nx)) {
      entity.y = t2p(ty + 1);
      entity.dy = 0;
      cell = celldown;
      cellright = celldiag;
      ny = 0;
    }
  }

  if (entity.dx > 0) {
    if ((cellright && !cell) || (celldiag && !celldown && ny)) {
      entity.x = t2p(tx);
      entity.dx = 0;
    }
  } else if (entity.dx < 0) {
    if ((cell && !cellright) || (celldown && !celldiag && ny)) {
      entity.x = t2p(tx + 1);
      entity.dx = 0;
    }
  }

  if (entity.enemy) {
    if (entity.left && (cell || !celldown)) {
      entity.left = false;
      entity.right = true;
    } else if (entity.right && (cellright || !celldiag)) {
      entity.right = false;
      entity.left = true;
    }
  }

  entity.falling = !(celldown || (nx && celldiag));
}

function checkPlayerPositions(entity) {
  if (Math.round(entity.x) >= (TILE * (MAP.tw - 1))) {
    if (cellAvailable(0, entity.y) === 0 && cellAvailable(1, entity.y) === 0) {
      entity.x = 0.5;
    } else {
      entity.x = (TILE * (MAP.tw - 1)) - 0.5;
    }
  } else if (Math.round(entity.x) <= 0) {
    if (cellAvailable((TILE * (MAP.tw - 1)), entity.y) === 0 && cellAvailable((TILE * (MAP.tw - 1)) - 1, entity.y) === 0) {
      entity.x = (TILE * (MAP.tw - 1)) - 0.5;
    } else {
      entity.x = 0.5;
    }
  } else if (Math.round(entity.y) >= (TILE * (MAP.th - 1))) {
    if (cellAvailable(entity.x, 0) === 0 && cellAvailable(entity.x, 1) === 0) {
      entity.y = 0.5;
    } else {
      entity.y = (TILE * (MAP.th - 1)) - 0.5;
    }
  } else if (Math.round(entity.y) <= 0) {
    if (cellAvailable(entity.x, (TILE * (MAP.th - 1))) === 0 && cellAvailable(entity.x, (TILE * (MAP.th - 1)) - 1) === 0) {
      entity.y = (TILE * (MAP.th - 1)) - 0.5;
    } else {
      entity.y = 0.5;
    }
  }
}

function render(ctx, frame, dt) {
  ctx.clearRect(0, 0, width, height);
  renderMap(ctx);
  renderTreasure(ctx, frame);
  renderPlayer(ctx, dt);
  renderEnemies(ctx, dt);
  renderSpikes(ctx, dt);
  if (treasure.length === player.collected) renderChest(ctx, frame);
}

function renderMap(ctx) {
  for (var y = 0; y < MAP.th; y++) {
    for (var x = 0; x < MAP.tw; x++) {
      var cell = tcell(x, y, false);
      if (cell === 0) {
        ctx.drawImage(assets, 9 * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
      } else if (cell) {
        ctx.drawImage(assets, (cell - 1) * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
      }
    }
  }
}

function renderPlayer(ctx, dt) {
  var or = player.orientation === 'right' ? 27 : 28;
  ctx.drawImage(assets, or * TILE, 0, TILE, TILE, player.x, player.y, TILE, TILE);
  for (var n = 0; n < life; n++) {
    ctx.drawImage(assets, 26 * TILE, 0, TILE, TILE, n * TILE + 2, 1, TILE * 0.8, TILE * 0.8);
  }
}

function renderChest(ctx, frame) {
  ctx.globalAlpha = 0.45 + tweenTreasure(frame, 60);
  ctx.drawImage(assets, 13 * TILE, 0, TILE, TILE, chest.x, chest.y - (TILE * 1.5), TILE * 1.5, TILE * 1.5);
  ctx.globalAlpha = 1;
}

function renderEnemies(ctx, dt) {
  for (var n = 0; n < enemies.length; n++) {
    var enemy = enemies[n];
    var side = enemy.type === '1' ? (enemy.right ? 14 : 15) : (enemy.right ? 16 : 17);
    ctx.drawImage(assets, side * TILE, 0, TILE, TILE, enemy.x, enemy.y, TILE, TILE);
  }
}

function renderSpikes(ctx, dt) {
  for (var n = 0; n < spikes.length; n++) {
    var spike = spikes[n];
    ctx.drawImage(assets, spike.gid * TILE, 0, TILE, TILE, spike.x, spike.y - TILE, TILE, TILE);
  }
}

function renderTreasure(ctx, frame) {
  ctx.globalAlpha = 0.45 + tweenTreasure(frame, 60);
  for (var n = 0; n < treasure.length; n++) {
    var t = treasure[n];
    if (!t.collected) Utils.drawDiamond(t.x, t.y, 15, 13, ctx, DIAMOND_COLORS[t.color]);
  }
  ctx.globalAlpha = 1;
}

function tweenTreasure(frame, duration) {
  var half = duration / 2;
  var pulse = frame % duration;
  return pulse < half ? (pulse / half) : 1 - (pulse - half) / half;
}

function setup(map) {
  player = {};
  enemies = [];
  spikes = [];
  treasure = [];
  cells = [];
  win = false;
  gameOver = false;

  var data = map.layers[0].data,
    objects = map.layers[1].objects;

  for (var n = 0; n < objects.length; n++) {
    var obj = objects[n];
    var entity = setupEntity(obj);

    switch (obj.type) {
      case 'player':
        player = entity;
        break;
      case 'enemy':
        enemies.push(entity);
        break;
      case 'spike':
        spikes.push(entity);
        break;
      case 'coin':
        treasure.push(entity);
        break;
      case 'chest':
        chest = entity;
        break;
    }
  }

  cells = data;
}

function setupEntity(obj) {
  if (!obj.properties) obj.properties = {};

  var entity = {
    x: obj.x,
    y: obj.y,
    dx: 0,
    dy: 0,
    gravity: TILE * (obj.properties.gravity || GRAVITY),
    maxdx: TILE * (obj.properties.maxdx || MAXDX),
    maxdy: TILE * (obj.properties.maxdy || MAXDY),
    impulse: TILE * (obj.properties.impulse || IMPULSE),
    enemy: obj.type == 'enemy',
    player: obj.type == 'player',
    treasure: obj.type == 'coin',
    chest: obj.type == 'chest',
    spike: obj.type == 'spike',
    gid: obj.gid - 1,
    left: obj.properties.left,
    right: obj.properties.right,
    color: obj.properties.color,
    type: obj.properties.type,
    orientation: 'right',
    start: {
      x: obj.x,
      y: obj.y
    },
    killed: 0,
    collected: 0
  };

  entity.accel = entity.maxdx / (obj.properties.accel || ACCEL);
  entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);

  return entity;
}

var counter = 0,
  dt = 0,
  now,
  last = timestamp();

function frame() {
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > step) {
    dt = dt - step;
    update(step);
  }
  if (!win && !gameOver) render(ctx, counter, dt);
  last = now;
  counter++;
  requestAnimationFrame(frame, canvas);
}

export { setup, frame, onkey };