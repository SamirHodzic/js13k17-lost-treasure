var Utils = {
  style: game.style,
  amp: 15,
  t: 0,
  step: 0.03,
  shake: () => {
    var a = (Math.random() * 2 - 1) * Utils.t;
    var x = (Math.random() * Utils.amp * 2 - Utils.amp) * Utils.t;
    var y = (Math.random() * Utils.amp - Utils.amp * 0.5) * Utils.t;
    var s = Math.max(1, 1.05 * Utils.t);
    var b = 2 * Utils.t;
    var tr = 'rotate(' + a + 'deg) translate(' + x + 'px,' + y + 'px) scale(' + s + ')';

    Utils.style.transform = Utils.style.webkitTransform = tr;
    Utils.t -= Utils.step;

    if (Utils.t > 0) {
      requestAnimationFrame(Utils.shake);
    } else {
      Utils.t = 0;
      Utils.style.transform = 'matrix(1,0,0,1,0,0)';
    }
  },
  startShake: () => {
    if (Utils.t) {
      Utils.t = 1;
    } else {
      Utils.t = 1;
      Utils.shake();
    }
  },
  drawDiamond(x, y, w, h, ctx, colors) {
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w / 2, y + 0.7 * h);
    ctx.lineTo(x + w / 2, y);
    ctx.fill();

    ctx.fillStyle = colors[1];
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + 0.7 * h);
    ctx.lineTo(x + w, y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w / 4, y - 0.3 * h);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w / 2, y);
    ctx.fill();

    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.moveTo(x + w / 4, y - 0.3 * h);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + 0.75 * w, y - 0.3 * h);
    ctx.fill();

    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(x + 0.75 * w, y - 0.3 * h);
    ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w, y);
    ctx.fill();
  }
}

export { Utils };