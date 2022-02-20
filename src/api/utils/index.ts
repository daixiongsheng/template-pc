export function random(min?: number, max?: number): number {
  max = max === void 0 ? (min === void 0 ? 100 : min) : max
  min = min === void 0 ? 0 : max === min ? 0 : min
  max = max > min ? max : [min, (min = max)][0]
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomExpire(min = 30 * 24 * 3600): number {
  return min + random(10 * 3600)
}
