function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function bound(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(((x1 + w1 - 1) < x2) || ((x2 + w2 - 1) < x1) || ((y1 + h1 - 1) < y2) || ((y2 + h2 - 1) < y1));
}

export { timestamp, bound, overlap };