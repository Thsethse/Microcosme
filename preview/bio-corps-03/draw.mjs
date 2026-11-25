import {acceptsEyes, eyeControls, faceEnvelope, randomEyes} from './eyes.mjs';

export const legacyDraw = 'lcg-v1';
export const currentDraw = 'xoshiro128ss-rejet-v2';
const budget = 8192;
const axes = Object.entries(eyeControls);
const uint32 = 2 ** 32;

function generator(seed) {
  // Four xmur3 outputs seed xoshiro128**. This version fixes UTF-16 seed encoding.
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  const word = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
  let a = word(), b = word(), c = word(), d = word();
  if (!(a | b | c | d)) d = 1;
  return () => {
    const product = Math.imul(b, 5), t = b << 9;
    const result = Math.imul((product << 7) | (product >>> 25), 9) >>> 0;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = (d << 11) | (d >>> 21);
    return result;
  };
}

function integer(next, span) {
  const limit = uint32 - (uint32 % span);
  for (let attempt = 0; attempt < 32; attempt++) {
    const value = next();
    if (value < limit) return value % span;
  }
  throw new Error('Budget de conversion du tirage dépassé. Essayez une autre graine.');
}

export function seededIndex(seed) {
  const next = generator(seed);
  return span => integer(next, span);
}

export function drawEyes(input, seed, version = currentDraw) {
  if (typeof seed !== 'string') throw new TypeError('Graine textuelle requise.');
  if (version === legacyDraw) return {values: randomEyes(input, seed), attempts: null};
  if (version !== currentDraw) throw new RangeError('Version de tirage inconnue.');
  const face = faceEnvelope(input);
  const next = generator(seed);
  for (let attempts = 1; attempts <= budget; attempts++) {
    const values = Object.fromEntries(axes.map(([key, {min, max}]) => [
      key, min + integer(next, max - min + 1)
    ]));
    if (acceptsEyes(face, values)) return {values, attempts};
  }
  throw new Error('Aucun tuple admissible trouvé après 8 192 propositions. Essayez une autre graine.');
}
