// Diagnostic BIO-INV-01. Reads the generators as-is and writes JSON to stdout.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {character} from '../../../../bio-yeux-01/render.mjs';
import {eyeControls, eyePresets, faceEnvelope, normalizeEyes, randomEyes, solveEyes} from '../../../../bio-yeux-01/eyes.mjs';
import {choices, groups} from '../../../../bio-col-01/catalogue.mjs';
import {palette, oklab, contrast} from '../../../../bio-col-01/palette.mjs';
import {restoreSelection, exportSelection} from '../../../../bio-col-01/selection.mjs';
import {bodies, controls, model, normalize, presets} from '../../../../preview/bio-vis-p5-i6/model.mjs';
import {bounds as legacyBounds, choices as legacyChoices, geometry as legacyGeometry} from '../../../../preview/bio-vis-p1/model.mjs';
import {bodyMarkup as legacyBody, character as legacyCharacter} from '../../../../preview/bio-vis-p1/render.mjs';
import {priorityCase, halfWidthAt} from '../../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const keyValues = Object.entries(eyeControls);
const faceKeys = Object.entries(controls);
const limits = (entries, key) => Object.fromEntries(entries.map(([name, range]) => [name, range[key]]));
const corners = entries => Array.from({length: 2 ** entries.length}, (_, bits) =>
  Object.fromEntries(entries.map(([key, {min, max}], index) => [key, bits & (1 << index) ? max : min])));
const grid = (min, max, step = 1) => Array.from({length: Math.round((max - min) / step) + 1},
  (_, i) => Number((min + i * step).toFixed(6)));
const sig = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const distinct = values => new Set(values).size;
const round = (x, digits = 6) => +x.toFixed(digits);
const cases = {
  neutral: {}, tall: presets.tall.values, broad: presets.broad.values,
  ipad: Object.fromEntries(faceKeys.map(([key]) => [key, priorityCase[key]])),
  min: limits(faceKeys, 'min'), max: limits(faceKeys, 'max'),
  narrow: {...limits(faceKeys, 'min'), forehead_width: 1.14, jowls: 1.35},
  elongated: {...limits(faceKeys, 'min'), skull_height: 1.18, forehead_width: 1.14, jowls: 1.35}
};
const bodyInputs = Object.keys(bodies);
const eyeCases = {neutral: normalizeEyes({}), ...Object.fromEntries(Object.entries(eyePresets).map(([key, p]) => [key, p.values]))};
const svg = (input, options = {}) => character(input, {instance: 'inv', ...options});
const inputFor = entry => ({style: entry.style, arrangement: entry.arrangement === 'U' ? 'G' : entry.arrangement});
const effectiveBody = value => /<g class="body-shape">.*?<\/g>/.exec(value)?.[0] ?? '';
const coords = result => result.shapes[0].curves.flat(2);
const difference = (a, b) => Math.max(...a.map((value, i) => Math.abs(value - b[i])));
const runs = values => values.reduce((out, value) => {
  const last = out.at(-1);
  if (last && last[1] === value - 1) last[1] = value;
  else out.push([value, value]);
  return out;
}, []);

function bodiesResults() {
  const active = Object.fromEntries(bodyInputs.map(body => [body, {parameters: model({style: 'shaved', body}).body.parameters,
    primitiveInputsIgnored: svg({style: 'shaved', body, shoulders: .72, belly: .72, hips: .72, head: 'square'}) ===
      svg({style: 'shaved', body, shoulders: 1.25, belly: 1.30, hips: 1.25, head: 'pear'})}]));
  assert.equal(distinct(bodyInputs.map(body => sig(effectiveBody(svg({style: 'shaved', body}))))), 6);
  const primitive = Object.fromEntries(Object.entries(legacyBounds).map(([key, extent]) => [
    key, Object.fromEntries(legacyChoices.silhouette.map(silhouette => [silhouette,
      distinct(grid(...extent, .01).map(x => sig(legacyBody(legacyGeometry({silhouette, [key]: x})))))]))
  ]));
  const legacyCategories = Object.fromEntries(Object.entries(legacyChoices).map(([key, domain]) => [key, {
    domain,
    head: distinct(domain.map(value => legacyCharacter({[key]: value}, {headOnly: true}))),
    body: distinct(domain.map(value => effectiveBody(legacyCharacter({[key]: value}))))
  }]));
  return {active, primitive, legacyCategories};
}

function facesResults() {
  const contextStyles = ['shaved', 'classic', 'fringe_bob', 'p5-038', 'p5-063', 'p5-071'];
  const axes = {};
  for (const [key, {min, max}] of faceKeys) {
    const values = grid(min, max, .01);
    axes[key] = {range: [min, max], steps: values.length,
      outlines: distinct(values.map(value => model({[key]: value}).outline)),
      eyeAnchors: distinct(values.map(value => JSON.stringify(model({[key]: value}).base.anchors.eyeLeft))),
      fullRender: Object.fromEntries(contextStyles.map(style => [style, distinct(values.map(value =>
        svg({style, [key]: value}, {headOnly: true})))]))
    };
  }
  const cap = Object.fromEntries(['classic', 'bob', 'curls', 'fringe_bob'].map(style => [style,
    grid(.84, 1.18, .01).map(value => {
      const m = model({style, forehead_height: value});
      const temples = m.fit.temple * (.9 / .88), contour = halfWidthAt(m, m.fit.forehead + 2) - 6.5;
      return {value, limitedBy: temples <= contour ? 'temples' : 'outline', join: round(Math.min(temples, contour))};
    })]));
  const combo = [
    {jowls: 1, cheek_width: 1},
    {jowls: 1.1, cheek_width: .82 / (.82 + .75 * .1)}
  ].map(input => {
    const m = model(input);
    return {input, cheek: m.anchors.cheekRight, jowl: m.anchors.jowlRight, outline: sig(m.outline)};
  });
  return {axes, cap, combo};
}

function hairResults() {
  const historical = {}, flags = {accessories: [], contrast: [], monochrome: [], arrangementsDiffer: []};
  const invisibleColors = {}, monochromeMasked = [];
  for (const entry of choices) {
    const input = inputFor(entry);
    const normal = svg(input);
    historical[entry.key] = sig(normal);
    for (const key of ['accessories', 'contrast', 'monochrome']) {
      if (svg({...input, [key]: key === 'monochrome'}) !== normal) flags[key].push(entry.key);
    }
    if (entry.arrangement === 'U' && svg({...input, arrangement: 'D'}) !== normal) flags.arrangementsDiffer.push(entry.key);
    const available = palette.filter(p => svg(input, {hairColor: p.id}) !== normal);
    if (available.length !== palette.length) invisibleColors[entry.key] = palette.filter(p => !available.includes(p)).map(p => p.id);
    const options = {hairColor: 'chatain-clair'};
    if (svg({...input, monochrome: true}, options) === svg({...input, monochrome: false}, options)) monochromeMasked.push(entry.key);
  }
  const colors = palette.flatMap((a, i) => palette.slice(i + 1).map(b => ({
    a: a.id, b: b.id,
    fillDelta: round(Math.hypot(...oklab(a.fill).map((channel, j) => channel - oklab(b.fill)[j]))),
    strokeDelta: round(Math.hypot(...oklab(a.stroke).map((channel, j) => channel - oklab(b.stroke)[j])))
  }))).sort((a, b) => a.fillDelta - b.fillDelta);
  return {flags, historicalUnique: distinct(Object.values(historical)), invisibleColors, monochromeMasked,
    knownGroups: groups.map(g => ({id: g.id, a: g.primary, b: g.secondary})),
    colors: {closest: colors.slice(0, 15), uniqueFills: distinct(palette.map(p => p.fill)),
      uniqueStrokes: distinct(palette.map(p => p.stroke)), contrast: palette.map(p => [p.id, round(contrast(p.fill, p.stroke))])}};
}

// Expose private fit predicates in an in-memory diagnostic module. Production
// imports and filesystem bytes stay unchanged. Its outputs are cross-checked below.
const href = new URL('../../../../bio-yeux-01/eyes.mjs', import.meta.url);
const source = readFileSync(href, 'utf8').replace(/from '([^']+)'/g, (_, src) => "from '" + new URL(src, href) + "'");
const {makeShape, fits} = await import('data:text/javascript;base64,' + Buffer.from(source + '\nexport {makeShape, fits};').toString('base64'));
const accepts = (face, values) => face.envelopes.every(eye => fits(makeShape(eye, face.reference, values), eye, face));
function leaves(threshold, samples) {
  return runs(samples.slice(1).filter((value, i) => difference(value.points, samples[i].points) <= threshold)
    .map(value => value.requested));
}

function eyeResults() {
  const sweeps = {};
  for (const [faceKey, input] of Object.entries(cases)) {
    const envelope = faceEnvelope(input);
    sweeps[faceKey] = {};
    for (const [context, base] of Object.entries(eyeCases)) {
      sweeps[faceKey][context] = Object.fromEntries(keyValues.map(([key, {min, max}]) => {
        const samples = grid(min, max).map(requested => {
          const request = {...base, [key]: requested}, result = solveEyes(envelope, request);
          const accepted = accepts(envelope, request);
          assert.equal(result.corrected.length === 0, accepted);
          return {requested, applied: round(result.effective[key]), accepted, corrected: result.corrected, points: coords(result)};
        });
        return [key, {
          direct: runs(samples.filter(sample => sample.accepted).map(sample => sample.requested)),
          effective: [Math.min(...samples.map(sample => sample.applied)), Math.max(...samples.map(sample => sample.applied))],
          corrected: samples.filter(sample => sample.corrected.includes(key)).length,
          changesOther: samples.filter(sample => sample.corrected.some(axis => axis !== key)).length,
          exact: leaves(0, samples), numerical: leaves(.000025, samples)
        }];
      }));
    }
  }
  const faceCorners = corners(faceKeys), integerBounds = {};
  for (const key of ['width', 'height', 'tilt']) {
    const {min, max} = eyeControls[key];
    integerBounds[key] = faceCorners.map(input => {
      const e = faceEnvelope(input), values = {...eyeCases.neutral, width: 80, height: 45};
      return runs(grid(min, max).filter(value => accepts(e, {...values, [key]: value})));
    });
  }
  // Look for genuine admissible islands with all other eye axes held fixed.
  const envelopes = [...Object.entries(cases).map(([key, input]) => ({key, input, e: faceEnvelope(input)})),
    ...faceCorners.map((input, i) => ({key: 'corner-' + i, input, e: faceEnvelope(input)}))];
  const sliceExample = {};
  let seed = 20261124, tested = 0;
  const u = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;
  for (let i = 0; i < 6000; i++) {
    const {e, key: face, input} = envelopes[Math.floor(u() * envelopes.length)];
    const values = Object.fromEntries(keyValues.map(([key, {min, max}]) => [key, min + Math.floor(u() * (max - min + 1))]));
    for (const axis of ['width', 'height', 'tilt']) {
      if (sliceExample[axis]) continue;
      const {min, max} = eyeControls[axis];
      const admissible = runs(grid(min, max).filter(point => accepts(e, {...values, [axis]: point})));
      tested++;
      if (admissible.length > 1) {
        const gap = admissible[0][1] + 1;
        const request = {...values, [axis]: gap};
        sliceExample[axis] = {face, input, values, admissible, gap, solved: solveEyes(e, request).effective};
      }
    }
  }
  const contextRanges = Object.fromEntries(Object.entries(integerBounds).map(([key, domains]) => [key, {
    empty: domains.filter(domain => !domain.length).length,
    different: distinct(domains.map(JSON.stringify)),
    samples: domains.map((domain, i) => ({i, domain})).filter((x, _, list) =>
      list.findIndex(y => JSON.stringify(y.domain) === JSON.stringify(x.domain)) === x.i)
  }]));
  return {sweeps, contextRanges, testedSlices: tested, sliceExample};
}

function fnv(value) {
  let seed = 2166136261;
  for (const character of value) seed = Math.imul(seed ^ character.codePointAt(0), 16777619);
  return seed >>> 0;
}
function independent(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
}
const uniformProposal = next => Object.fromEntries(keyValues.map(([key, {min, max}]) => [
  key, min + Math.floor(next() * (max - min + 1))
]));
function examineRandom(input, name, count = 4096) {
  const envelope = faceEnvelope(input);
  const observed = [], control = [], attempts = [], repeated = new Set();
  let fallback = 0, rejected = 0;
  const fallbackSeeds = [];
  const other = independent(fnv('verification-' + name));
  for (let i = 0; i < count; i++) {
    const seed = 'bio-inv-' + i;
    let state = fnv(seed), candidate, done = false;
    const next = () => (state = (Math.imul(1664525, state) + 1013904223) >>> 0) / 2 ** 32;
    for (let n = 1; n <= 128; n++) {
      candidate = uniformProposal(next);
      if (accepts(envelope, candidate)) { attempts.push(n); done = true; break; }
      rejected++;
    }
    if (!done) {
      fallback++;
      if (fallbackSeeds.length < 3) fallbackSeeds.push(seed);
      attempts.push(128);
      candidate = {...candidate, width: 75, height: 40, tilt: 0};
    }
    assert(accepts(envelope, candidate));
    assert.deepEqual(randomEyes(input, seed), candidate);
    if (i % 128 === 0) assert.deepEqual(randomEyes(input, seed), candidate);
    observed.push(candidate);
    repeated.add(JSON.stringify(candidate));
    let expected;
    do { expected = uniformProposal(other); } while (!accepts(envelope, expected));
    control.push(expected);
  }
  const margins = Object.fromEntries(keyValues.map(([key, {min, max}]) => {
    let a = 0, b = 0, cdf = 0;
    const counts = list => list.reduce((out, value) => { out[value[key] - min]++; return out; }, Array(max - min + 1).fill(0));
    const x = counts(observed), y = counts(control);
    for (let i = 0; i < x.length; i++) { a += x[i]; b += y[i]; cdf = Math.max(cdf, Math.abs(a - b) / count); }
    const active = grid(min, max).filter((_, i) => x[i]);
    return [key, {domain: [active[0], active.at(-1)], first: x[active[0] - min], firstIndependent: y[active[0] - min],
      last: x[active.at(-1) - min], lastIndependent: y[active.at(-1) - min],
      contractMin: x[0], contractMax: x.at(-1), maxCdfGap: round(cdf), counts: x, independentCounts: y}];
  }));
  const sameFallbackTriple = ({width,height,tilt}) => width === 75 && height === 40 && tilt === 0;
  const sorted = attempts.sort((a, b) => a - b);
  return {count, rejected, acceptance: round((count - fallback) / (count - fallback + rejected)),
    fallback, fallbackSeeds, fallbackTriple: observed.filter(sameFallbackTriple).length, independentTriple: control.filter(sameFallbackTriple).length, unique: repeated.size, median: sorted[count / 2], p95: sorted[Math.ceil(count * .95) - 1], max: sorted.at(-1), margins};
}

function persistence() {
  const raw = {style: 'p5-061', arrangement: 'G', body: 'bust', forehead_height: 1.18, skull_width: 9,
    accessories: false, contrast: false, metadata: {code: 'archive'}};
  const selection = restoreSelection(raw), json = exportSelection(selection), reload = restoreSelection(JSON.parse(json));
  assert.deepEqual(reload, selection);
  const input = {...selection.state, accessories: false, contrast: false};
  const options = {hairColor: 'bleu-vif', eyes: 'round'};
  const result = solveEyes(faceEnvelope(input), normalizeEyes(options.eyes));
  const active = svg(input, options), afterUIReload = svg(reload.state, options);
  const fullReloadWithoutOptions = svg(reload.state);
  const replay = svg(reload.state, {hairColor: options.hairColor, eyes: result.effective});
  return {raw, appliedSkull: selection.state.skull_width, visibleKey: selection.visibleKey, exactRaw: JSON.parse(json),
    selectionStable: sig(active) === sig(afterUIReload), completeWithoutMemory: sig(active) === sig(fullReloadWithoutOptions),
    effectiveReplayExact: sig(active) === sig(replay), eyeEffective: result.effective,
    svgHashes: {active: sig(active), afterUIReload: sig(afterUIReload), fullReloadWithoutOptions: sig(fullReloadWithoutOptions), replay: sig(replay)}};
}

console.log(JSON.stringify({
  bodies: bodiesResults(), faces: facesResults(), hair: hairResults(), eyes: eyeResults(),
  random: Object.fromEntries(['neutral', 'tall', 'broad', 'narrow', 'elongated', 'ipad'].map(name => [name, examineRandom(cases[name], name)])),
  persistence: persistence()
}, null, 2));
