import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import {character as before} from '../../bio-col-01/render.mjs';
import {choices} from '../../bio-col-01/catalogue.mjs';
import {palette} from '../../bio-col-01/palette.mjs';
import {auditCases, bodies, controls, model} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
import {outlineCurves, pointAt} from '../bezier.mjs';
import {eyeControls, eyePresets, eyeStroke, eyesFor, faceEnvelope, normalizeEyes, randomEyes, solveEyes} from '../eyes.mjs';
import {character} from '../render.mjs';

const keyValues = Object.entries(eyeControls);
const corners = entries => Array.from({length: 2 ** entries.length}, (_, bits) =>
  Object.fromEntries(entries.map(([key, {min, max}], index) => [key, bits & (1 << index) ? max : min])));
const eyeCorners = corners(keyValues);
const faceCorners = corners(Object.entries(controls));
const approx = (a, b, epsilon = 1e-8) => assert(Math.abs(a - b) <= epsilon, `${a} ≠ ${b}`);
const views = [{headOnly: true}, {headOnly: false}, {headOnly: true, smallScale: true}];
const pupils = svg => [...svg.matchAll(/<ellipse [^>]*fill="#171713"[^>]*\/>/g)].map(match => match[0]);
const openings = /<ellipse [^>]*fill="#ebebeb"[^>]*\/><ellipse [^>]*fill="#171713"[^>]*\/>/g;
const groups = /<g data-bio-eye="(?:left|right)">.*?<\/g><\/g>/g;
const inputFor = ({style, arrangement}, values = {}) => ({...values, style, arrangement: arrangement === 'U' ? 'G' : arrangement});

test('T1/T7 — 129 fichiers figés et SVG historiques strictement identiques à toutes les échelles', () => {
  const manifest = JSON.parse(readFileSync(new URL('../../bio-col-01/tests/frozen-manifest.json', import.meta.url)));
  assert.equal(manifest.length, 129);
  for (const entry of manifest) {
    const bytes = readFileSync(new URL('../../' + entry.path, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, entry.path);
  }
  for (const [index, choice] of choices.entries()) for (const body of Object.keys(bodies)) for (const view of views) {
    const input = inputFor(choice, {body, accessories: index % 2 === 0, contrast: index % 3 === 0});
    const options = {...view, hairColor: palette[index % palette.length].id, instance: 'comparison'};
    assert.equal(character(input, options), before(input, options), choice.key);
    assert.equal(character(input, {...options, eyes: 'historical'}), before(input, options), choice.key);
  }
});

test('T2 — huit profils vectoriels distincts et propriétés directionnelles lisibles', () => {
  const result = Object.fromEntries(Object.keys(eyePresets).map(key => [key, eyesFor({}, key).shapes[1]]));
  assert.equal(new Set(Object.values(result).map(shape => shape.path)).size, 8);
  const span = (key, axis) => result[key].bounds[axis][1] - result[key].bounds[axis][0];
  assert(span('round', 1) / span('round', 0) > span('oval', 1) / span('oval', 0));
  assert(span('narrow', 1) < span('oval', 1) * 0.65);
  const inclination = key => result[key].curves[1][3][1] - result[key].curves[0][0][1];
  assert(inclination('upturned') < -2);
  assert(inclination('downturned') > 2);
  const rise = (key, lid) => Math.abs(result[key].curves[lid][3][1] - faceEnvelope({}).envelopes[1].y);
  assert(rise('heavy', 0) < rise('heavy', 2) * 0.6);
  assert(rise('crescent', 2) < rise('crescent', 0) * 0.2);
  const horizontalCornerHandle = key => result[key].curves[0][1][0] - result[key].curves[0][0][0];
  assert(horizontalCornerHandle('almond') > horizontalCornerHandle('round') * 10);
  for (const key of Object.keys(result)) assert.doesNotMatch(character({}, {eyes: key}), /<image\b|data:image/i);
});

test('T3 — effets indépendants, coordonnées locales et centres historiques', () => {
  const input = {style: 'shaved'};
  const baseline = {width: 80, height: 52, upper: 95, lower: 95, tilt: 0, taper: 50, upperPeak: 0, lowerPeak: 0};
  const original = eyesFor(input, baseline);
  const signatures = new Set();
  for (const [key] of keyValues) {
    const variant = eyesFor(input, {...baseline, [key]: baseline[key] + 5});
    assert.deepEqual(variant.corrected, [], key);
    assert.notEqual(variant.shapes[0].path, original.shapes[0].path, key);
    signatures.add(variant.shapes[0].path);
    checkShape(variant);
  }
  assert.equal(signatures.size, 8);
  const right = original.shapes[1], shifted = eyesFor(input, {...baseline, upperPeak: 15, lowerPeak: -12}).shapes[1];
  assert(shifted.curves[0][3][0] > right.curves[0][3][0]);
  assert(shifted.curves[2][3][0] < right.curves[2][3][0]);
  assert.equal(normalizeEyes({width: Infinity}).width, 100);
  assert.equal(normalizeEyes({width: -300}).width, 75);
  assert.equal(normalizeEyes({width: 300}).width, 120);
  assert.throws(() => normalizeEyes('unknown'), RangeError);
});

function checkShape({face, effective, shapes}) {
  for (const [key, range] of keyValues) assert(effective[key] >= range.min && effective[key] <= range.max, key);
  const radians = effective.tilt * Math.PI / 180, sin = Math.sin(radians), cos = Math.cos(radians);
  for (const [index, shape] of shapes.entries()) {
    const eye = face.envelopes[index];
    const [[left, right], [top, bottom]] = shape.bounds;
    assert(right - left <= face.maxWidth + 1e-8);
    assert(bottom - top <= face.maxHeight + 1e-8);
    assert(bottom - top <= (right - left) * 0.85 + 1e-8);
    assert(left >= eye.left - 1e-8 && right <= eye.right + 1e-8);
    assert(top >= eye.top - 1e-8 && bottom <= eye.bottom + 1e-8);
    assert(bottom <= face.nose.top + 1e-8 || right <= face.nose.left + 1e-8 || left >= face.nose.right - 1e-8);
    const [innerX, innerY] = shape.curves[0][0], [outerX, outerY] = shape.curves[1][3];
    approx((innerX + outerX) / 2, eye.x);
    approx((innerY + outerY) / 2, eye.y);
    // Invert rotation and mirror. Monotone X within each lid plus opposite
    // signs of the Y controls proves that their interiors cannot intersect.
    for (const [part, curve] of shape.curves.entries()) {
      const local = curve.map(([x, y]) => {
        const dx = (x - eye.x) * eye.side, dy = y - eye.y;
        return [dx * cos - dy * sin, dx * sin + dy * cos];
      });
      const direction = part < 2 ? 1 : -1;
      for (let i = 1; i < local.length; i++) {
        assert((local[i][0] - local[i - 1][0]) * direction >= -1e-8);
        assert(local[i][1] * direction <= 1e-8);
      }
      assert(Math.abs(local[1][1]) > 1e-8);
      for (const [point, [x, y]] of curve.entries()) {
        assert(Number.isFinite(x) && Number.isFinite(y));
        if (index === 0) {
          const opposite = shapes[1].curves[part][point];
          approx(x + opposite[0], eye.x + face.envelopes[1].x);
          approx(y, opposite[1]);
        }
      }
    }
  }
  assert(shapes[0].bounds[0][1] < shapes[1].bounds[0][0]);
}

test('T4 — 65 536 combinaisons de coins et 1 024 combinaisons intérieures', () => {
  const sample = (entries, i) => Object.fromEntries(entries.map(([key, {min, max}], j) => [
    key, min + (max - min) * ((i * (31 + 2 * j) + 19 * j) % 1031) / 1031
  ]));
  for (const values of faceCorners) {
    const envelope = faceEnvelope(values);
    for (const eyes of eyeCorners) checkShape(solveEyes(envelope, eyes));
  }
  for (let i = 1; i <= 1024; i++) {
    checkShape(eyesFor(sample(Object.entries(controls), i), sample(keyValues, i)));
  }
});

function inside(point, polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x, y] = polygon[i], [px, py] = polygon[j];
    if ((y > point[1]) !== (py > point[1]) && point[0] < (px - x) * (point[1] - y) / (py - y) + x) result = !result;
  }
  return result;
}

test('T5 — contours hérités, fenêtres sans débordement et exceptions historiques mesurées', () => {
  let maxWidth = 0, maxHeight = 0, maxRatio = 0;
  for (const values of [...faceCorners, ...auditCases().map(value => value.values), priorityCase]) {
    const m = model(values);
    const polygon = outlineCurves(m.outline).flatMap(curve => Array.from({length: 32}, (_, i) => pointAt(curve, i / 32)));
    const envelope = faceEnvelope(values);
    maxWidth = Math.max(maxWidth, envelope.historicalExcess.width);
    maxHeight = Math.max(maxHeight, envelope.historicalExcess.height);
    maxRatio = Math.max(maxRatio, envelope.historicalExcess.ratio);
    for (const eye of envelope.envelopes) {
      // Independently check the entire conservative envelope against the face.
      for (let i = 0; i <= 12; i++) for (const x of [eye.left, eye.right]) {
        assert(inside([x, eye.top + (eye.bottom - eye.top) * i / 12], polygon));
      }
    }
    for (const eyes of Object.keys(eyePresets)) checkShape(solveEyes(envelope, normalizeEyes(eyes)));
  }
  assert(maxWidth > 0 && maxHeight > 0 && maxRatio > 0);
  assert.deepEqual(faceEnvelope({}).envelopes.map(({x, y}) => [x, y]), [model({}).base.anchors.eyeLeft, model({}).base.anchors.eyeRight]);
  console.log('Dépassements historiques maximaux (unités SVG, unités SVG, rapport)', maxWidth, maxHeight, maxRatio);
});

test('T5 — toutes les coiffures et palettes, pupilles d’origine, ordre des couches et masques', () => {
  const morphs = [...auditCases().map(value => value.values), priorityCase];
  for (const [index, choice] of choices.entries()) for (const [j, eye] of Object.keys(eyePresets).entries()) {
    const input = inputFor(choice, {...morphs[(index + j) % morphs.length], body: Object.keys(bodies)[j % 6]});
    for (const view of views) {
      const options = {...view, hairColor: palette[(index + j) % palette.length].id, instance: 'test'};
      const historical = before(input, options);
      const proposed = character(input, {...options, eyes: eye});
      assert.deepEqual(pupils(proposed), pupils(historical));
      assert.equal(proposed.replace(groups, ''), historical.replace(openings, ''), choice.key);
      const paths = [...proposed.matchAll(/<clipPath id="(bio-yeux-[^"]+)"><path d="([^"]+)"\/><\/clipPath><\/defs><path d="([^"]+)"[^>]*stroke-width="([^"]+)"[^>]*\/><g clip-path="url\(#([^ )]+)\)">/g)];
      assert.equal(paths.length, 2, choice.key);
      for (const [, id, mask, opening, stroke, reference] of paths) {
        assert.equal(id, reference);
        assert.equal(mask, opening);
        assert.equal(+stroke, eyeStroke);
      }
    }
  }
});

test('T6 — 256 graines reproductibles, résultats immédiatement admissibles et sélection conservée', () => {
  const seen = new Set();
  for (const [i, face] of faceCorners.entries()) {
    const input = Object.freeze({...face, style: 'p5-056', arrangement: 'D', body: 'bust'});
    const eyes = randomEyes(input, 'Microcosme-' + i);
    const again = randomEyes(input, 'Microcosme-' + i);
    assert.deepEqual(again, eyes);
    assert.deepEqual(eyesFor(input, eyes).corrected, []);
    assert.equal(character(input, {eyes}), character(input, {eyes: again}));
    assert.equal(character(input), before(input));
    seen.add(JSON.stringify(eyes));
  }
  assert.equal(seen.size, 256);
});
