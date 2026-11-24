import {model} from '../bio-vis-p5-i6/model.mjs';
import {bounds, outlineCurves, stripX} from './bezier.mjs';

export const eyeControls = Object.freeze({
  width: Object.freeze({label: 'Largeur', min: 75, max: 120, neutral: 100, unit: '%'}),
  height: Object.freeze({label: 'Hauteur d’ouverture', min: 40, max: 130, neutral: 100, unit: '%'}),
  upper: Object.freeze({label: 'Courbure supérieure', min: 50, max: 150, neutral: 100, unit: '%'}),
  lower: Object.freeze({label: 'Courbure inférieure', min: 30, max: 140, neutral: 100, unit: '%'}),
  tilt: Object.freeze({label: 'Inclinaison', min: -12, max: 12, neutral: 0, unit: '°'}),
  taper: Object.freeze({label: 'Effilement des coins', min: 0, max: 100, neutral: 48, unit: '%'}),
  upperPeak: Object.freeze({label: 'Décalage du sommet supérieur', min: -20, max: 20, neutral: 0, unit: '%'}),
  lowerPeak: Object.freeze({label: 'Décalage du sommet inférieur', min: -20, max: 20, neutral: 0, unit: '%'})
});
const keys = Object.keys(eyeControls);
const presets = [
  ['round', 'Rond', [86, 110, 124, 135, 0, 3, 0, 0]],
  ['oval', 'Ovale', [117, 74, 100, 119, 0, 20, 0, 0]],
  ['almond', 'Amande', [108, 91, 115, 110, 0, 100, 0, -3]],
  ['narrow', 'Étroit', [111, 40, 90, 74, 0, 62, 0, 0]],
  ['upturned', 'Relevé', [105, 81, 108, 104, 12, 80, 9, 3]],
  ['downturned', 'Tombant', [104, 79, 116, 103, -12, 76, -8, -4]],
  ['heavy', 'Paupière lourde', [105, 83, 50, 140, 0, 55, -4, 2]],
  ['crescent', 'Demi-lune', [109, 88, 150, 30, 0, 81, 0, -3]]
];
export const eyePresets = Object.freeze(Object.fromEntries(presets.map(([key, label, values]) => [
  key, Object.freeze({label, values: Object.freeze(Object.fromEntries(keys.map((name, i) => [name, values[i]])))})
])));
export const eyeStroke = 0.8;

export function normalizeEyes(value) {
  if (value == null || value === 'historical') return null;
  if (typeof value === 'string') {
    if (!Object.hasOwn(eyePresets, value)) throw new RangeError('Forme d’yeux inconnue : ' + value);
    return eyePresets[value].values;
  }
  return Object.fromEntries(Object.entries(eyeControls).map(([key, {min, max, neutral}]) => [
    key, Number.isFinite(value[key]) ? Math.min(max, Math.max(min, value[key])) : neutral
  ]));
}

export function faceEnvelope(input) {
  const face = model(input);
  const {head, anchors} = face.base;
  const [cx, y] = [head.cx, anchors.eyeLeft[1]];
  const outline = outlineCurves(face.outline);
  const [, [faceTop, faceBottom]] = bounds(outline);
  const section = stripX(outline, y);
  const faceWidth = Math.max(...section) - Math.min(...section);
  const faceHeight = faceBottom - faceTop;
  const maxWidth = faceWidth * 0.25;
  const maxHeight = faceHeight * 0.12;
  // Brow: y + .2 and a 2.2 stroke. Mouth starts at anchor y - 1 with a 1.9 stroke.
  const top = Math.max(y - maxHeight, anchors.browLeft[1] + 1.6);
  const bottom = Math.min(y + maxHeight, anchors.mouth[1] - 2.25);
  const edges = stripX(outline, top, bottom);
  // Interior of the head's 4.2 stroke, with extra clearance from the facial midline.
  const left = Math.max(...edges.filter(x => x < cx)) + 2.35;
  const right = Math.min(...edges.filter(x => x > cx)) - 2.35;
  const envelopes = [anchors.eyeLeft, anchors.eyeRight].map(([x, y], i) => ({
    x, y, side: i ? 1 : -1, top, bottom,
    left: i ? cx + 0.3 : left, right: i ? right : cx - 0.3
  }));
  // The inherited triangle nose spans ±4, from y−5 to y+2, and has no stroke.
  const nose = {left: anchors.nose[0] - 4.25, right: anchors.nose[0] + 4.25, top: anchors.nose[1] - 5.25};
  const reference = {width: 2 * (head.rx * 0.26), height: 2 * (head.ry * 0.135)};
  return {
    faceWidth, faceHeight, maxWidth, maxHeight, nose, envelopes, reference,
    historicalExcess: {
      width: Math.max(0, reference.width - maxWidth),
      height: Math.max(0, reference.height - maxHeight),
      ratio: Math.max(0, reference.height / reference.width - 0.85)
    }
  };
}

function lid(halfWidth, height, peak, curvature, taper) {
  const leftSpan = peak + halfWidth, rightSpan = halfWidth - peak;
  const cornerX = 0.28 * taper;
  const cornerY = height * (0.72 - 0.55 * taper);
  // At the summit, a longer horizontal handle creates a fuller shoulder.
  const shoulder = 0.22 + 0.25 * (curvature / 150);
  return [
    [[-halfWidth, 0], [-halfWidth + leftSpan * cornerX, cornerY], [peak - leftSpan * shoulder, height], [peak, height]],
    [[peak, height], [peak + rightSpan * shoulder, height], [halfWidth - rightSpan * cornerX, cornerY], [halfWidth, 0]]
  ];
}

function makeShape(eye, reference, values) {
  const width = reference.width * values.width / 100;
  const height = reference.height * values.height / 100;
  const upperShare = 0.56 * values.upper / (0.56 * values.upper + 0.44 * values.lower);
  const upper = lid(width / 2, -height * upperShare, width * values.upperPeak / 100, values.upper, values.taper / 100);
  const lower = lid(width / 2, height * (1 - upperShare), width * values.lowerPeak / 100, values.lower, values.taper / 100);
  const angle = values.tilt * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
  const closed = [...upper, ...lower.reverse().map(curve => [...curve].reverse())];
  const curves = closed.map(curve => curve.map(([x, y]) => [
    eye.x + eye.side * (x * cos + y * sin),
    eye.y - x * sin + y * cos
  ]));
  return {curves, bounds: bounds(curves, eyeStroke / 2)};
}

function fits(shape, eye, face) {
  const [[left, right], [top, bottom]] = shape.bounds;
  const width = right - left, height = bottom - top;
  return width <= face.maxWidth && height <= face.maxHeight && height <= 0.85 * width &&
    left >= eye.left && right <= eye.right && top >= eye.top && bottom <= eye.bottom &&
    (bottom <= face.nose.top || right <= face.nose.left || left >= face.nose.right);
}

function pathOf(curves) {
  return 'M' + curves[0][0].join(',') + curves.map(curve =>
    ' C' + curve.slice(1).map(point => point.join(',')).join(' ')).join('') + 'Z';
}

export function solveEyes(face, requested) {
  if (!requested) return {face, requested, effective: null, corrected: [], shapes: []};
  const tryFit = values => {
    const shapes = face.envelopes.map(eye => makeShape(eye, face.reference, values));
    return shapes.every((shape, i) => fits(shape, face.envelopes[i], face)) ? shapes : null;
  };
  let effective = requested, shapes = tryFit(requested);
  if (!shapes) {
    const minimum = {...requested, width: eyeControls.width.min, height: eyeControls.height.min};
    const largestFit = (start, key, target) => {
      let lo = 0, hi = 1, best = start;
      if (start[key] === target) return start;
      const full = {...start, [key]: target};
      if (tryFit(full)) return full;
      for (let i = 0; i < 20; i++) {
        const amount = (lo + hi) / 2;
        const candidate = {...start, [key]: start[key] + (target - start[key]) * amount};
        if (tryFit(candidate)) {
          lo = amount;
          best = candidate;
        } else hi = amount;
      }
      return best;
    };
    // Reserve the minimum opening, then retain inclination and width as far as
    // their joint bounds allow. Recover the requested height with that span.
    const fullWidth = {...minimum, width: requested.width};
    if (tryFit(fullWidth)) effective = fullWidth;
    else if (tryFit(minimum)) effective = largestFit(minimum, 'width', requested.width);
    else {
      const level = {...minimum, tilt: 0};
      if (!tryFit(level)) throw new Error('Enveloppe faciale trop petite pour l’ouverture minimale');
      const inclined = largestFit(level, 'tilt', requested.tilt);
      effective = largestFit(inclined, 'width', requested.width);
    }
    effective = largestFit(effective, 'height', requested.height);
    shapes = tryFit(effective);
  }
  return {
    face, requested, effective, corrected: keys.filter(key => effective[key] !== requested[key]),
    shapes: shapes.map(shape => ({...shape, path: pathOf(shape.curves)}))
  };
}

export function eyesFor(input, value) {
  return solveEyes(faceEnvelope(input), normalizeEyes(value));
}

export function randomEyes(input, seed) {
  // FNV-1a seed, then a 32-bit LCG with an exact integer multiplication.
  let state = 2166136261;
  for (const character of String(seed)) state = Math.imul(state ^ character.codePointAt(0), 16777619);
  const face = faceEnvelope(input);
  let sample;
  for (let attempt = 0; attempt < 128; attempt++) {
    sample = Object.fromEntries(Object.entries(eyeControls).map(([key, {min, max}]) => {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return [key, min + Math.floor(state / 2 ** 32 * (max - min + 1))];
    }));
    if (face.envelopes.every(eye => fits(makeShape(eye, face.reference, sample), eye, face))) return sample;
  }
  return {...sample, width: eyeControls.width.min, height: eyeControls.height.min, tilt: 0};
}
