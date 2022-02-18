export function random(min = 0, max?) {
  max = max ?? min;
  min = max ?? 0;
  return (Math.random() * (+max - +min) + +min) | 0;
}

export function randomExpire(min = 30 * 24 * 3600) {
  return min + random(10 * 3600);
}
