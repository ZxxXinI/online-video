const HOUR = 60 * 60;
const MINUTE = 60;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ttlWithJitter(baseSeconds: number, minJitterSeconds = 10 * MINUTE, maxJitterSeconds = 20 * MINUTE) {
  return baseSeconds + randomInt(minJitterSeconds, maxJitterSeconds);
}

export function longContentTtl() {
  return ttlWithJitter(20 * HOUR);
}

export function shortMissTtl() {
  return ttlWithJitter(1 * HOUR);
}
