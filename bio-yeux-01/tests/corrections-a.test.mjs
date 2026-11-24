import assert from 'node:assert/strict';
import {test} from 'node:test';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {drawEyes, currentDraw, legacyDraw} from '../draw.mjs';
import {acceptsEyes, eyeControls, faceEnvelope, normalizeEyes, randomEyes} from '../eyes.mjs';
import {character} from '../render.mjs';
import {restoreSelection, exportSelection} from '../../bio-col-01/selection.mjs';
import {controls, presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const selected = restoreSelection({style: 'p5-061', arrangement: 'G', body: 'bust',
  ...presets.tall.values, accessories: true, contrast: false, fingerprint: {archive: 47}});
const seed = 'archive-bio-inv';
const settings = {form: 'custom', draw: {seed, version: currentDraw}, colour: 'bleu-vif', flat: true,
  eyes: drawEyes(characterInput(selected), seed).values};
const scales = [{headOnly: true}, {}, {headOnly: true, smallScale: true}];

function archive(selection = selected, overrides = {}) {
  return appearanceDocument(selection, {...settings, ...overrides});
}

test('A1 — reproduction à froid de 61-G, à instance SVG constante et aux trois échelles', () => {
  const document = archive();
  const restored = parseAppearance(JSON.stringify(document));
  assert.equal(restored.selection.key, 'p5-061:G');
  assert.equal(restored.selection.visibleKey, 'p5-056:G');
  assert.equal(document.character.arrangement, 'G');
  assert.equal(document.character.body, 'bust');
  assert.deepEqual(document.eyes.requested, settings.eyes);
  assert.deepEqual(restored.draw, settings.draw);
  assert.deepEqual(archive(restored.selection, restored), document);
  for (const scale of scales) {
    const before = character(characterInput(selected), {...scale, instance: 'audit', hairColor: settings.colour, eyes: settings.eyes});
    const after = character(characterInput(restored.selection), {...scale, instance: 'audit',
      hairColor: restored.colour, eyes: restored.eyes});
    assert.equal(after, before);
  }
});

test('A1 — précision du solveur, réglages latents, historique et anciens JSON', () => {
  const legacy = {style: 'shaved', body: 'standard', forehead_height: 1.18, skull_width: 8,
    accessories: true, contrast: true, monochrome: true, customField: [1, 2]};
  const selection = restoreSelection(legacy);
  const document = archive(selection, {eyes: normalizeEyes('round'), form: 'round', draw: null, flat: false});
  assert.equal(document.character.arrangement, 'U');
  assert.equal(document.character.morphology.skull_width, 1.18);
  assert.equal(document.character.morphology.forehead_height, 1.18);
  assert.equal(document.character.options.accessories, true);
  assert.equal(document.palette.colour, 'bleu-vif');
  assert.equal(document.palette.mode, 'historical');
  assert.notEqual(document.eyes.effective.height, document.eyes.requested.height);
  assert.notEqual(document.eyes.effective.height, +document.eyes.effective.height.toFixed(2));
  const restored = parseAppearance(JSON.stringify(document));
  assert.deepEqual(restored.selection.raw, legacy);
  assert.deepEqual(archive(restored.selection, restored), document);
  assert.deepEqual(JSON.parse(exportSelection(restoreSelection(legacy))), legacy);
  const historical = archive(selection, {eyes: null, form: 'historical', draw: null, flat: false});
  const restoredHistorical = parseAppearance(JSON.stringify(historical));
  assert.deepEqual(historical.eyes, {mode: 'historical'});
  assert.equal(restoredHistorical.eyes, null);
  assert.equal(character(characterInput(restoredHistorical.selection)), character(characterInput(selection)));
});

test('A1 — refus explicite des archives incohérentes ou d’une version inconnue', () => {
  for (const [mutate, pattern] of [
    [d => { d.version++; }, /version du document/i],
    [d => { d.renderer += '-future'; }, /version de rendu/i],
    [d => { d.character.style = 'shaved'; }, /incompatibles/i],
    [d => { delete d.character.morphology.skull_width; }, /incompatibles/i],
    [d => { d.eyes.effective.height += 0.001; }, /incompatibles/i],
    [d => { delete d.eyes.requested; }, /incompatibles/i],
    [d => { d.eyes.draw.version = 'future'; }, /tirage invalide/i],
    [d => { d.palette.colour = 'introuvable'; }, /couleur inconnue/i],
    [d => { d.historicalSelection.style = 'introuvable'; }, /identifiant historique/i]
  ]) {
    const document = archive();
    mutate(document);
    assert.throws(() => parseAppearance(JSON.stringify(document)), pattern);
  }
  assert.throws(() => parseAppearance('{'), SyntaxError);
  assert.throws(() => parseAppearance(exportSelection(selected)), /sélection historique/i);
});

const axes = Object.entries(eyeControls);
const minima = Object.fromEntries(Object.entries(controls).map(([key, {min}]) => [key, min]));
const narrow = {...minima, forehead_width: 1.14, jowls: 1.35};
const faces = {neutral: {}, tall: presets.tall.values, broad: presets.broad.values, ipad: priorityCase,
  narrow, elongated: {...narrow, skull_height: 1.18}};
const seeds = 4096;
const sameTriple = ({width, height, tilt}) => width === 75 && height === 40 && tilt === 0;

function witness(face, salt) {
  // Mulberry32, separate seed stream and quantiles independent of drawEyes.
  let state = salt;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
  return () => {
    for (let i = 0; i < 65536; i++) {
      const values = Object.fromEntries(axes.map(([key, {min, max}]) => {
        const span = max - min + 1, limit = 2 ** 32 - (2 ** 32 % span);
        let value;
        do { value = next(); } while (value >= limit);
        return [key, min + (value % span)];
      }));
      if (acceptsEyes(face, values)) return values;
    }
    throw new Error('Budget du témoin dépassé.');
  };
}

function distribution(draws, control) {
  return Object.fromEntries(axes.map(([key, {min, max}]) => {
    const hist = values => {
      const counts = Array(max - min + 1).fill(0);
      for (const value of values) counts[value[key] - min]++;
      return counts;
    };
    const measured = hist(draws), reference = hist(control);
    let cumulative = 0, cdfGap = 0;
    for (let i = 0; i < measured.length; i++) {
      cumulative += (measured[i] - reference[i]) / seeds;
      cdfGap = Math.max(cdfGap, Math.abs(cumulative));
    }
    return [key, {cdfGap, min, max, measured, reference}];
  }));
}

for (const [index, [name, input]] of Object.entries(faces).entries()) {
  test('A2 — 4 096 graines, répétition et témoin sans repli · ' + name, () => {
    const envelope = faceEnvelope(input);
    const independent = witness(envelope, 8675309 + index * 20437);
    const draws = [], control = [], attempts = [], durations = [];
    for (let i = 0; i < seeds; i++) {
      const seed = 'bio-inv-' + i;
      const start = performance.now();
      const sample = drawEyes(input, seed);
      durations.push(performance.now() - start);
      assert(acceptsEyes(envelope, sample.values), seed);
      assert.deepEqual(drawEyes(input, seed), sample);
      attempts.push(sample.attempts);
      draws.push(sample.values);
      control.push(independent());
    }
    const stats = distribution(draws, control);
    const triple = [draws.filter(sameTriple).length, control.filter(sameTriple).length];
    for (const [key, {cdfGap}] of Object.entries(stats)) assert(cdfGap <= 0.06, key + ' ' + cdfGap);
    assert(Math.abs(triple[0] - triple[1]) / seeds <= 0.01);
    attempts.sort((a, b) => a - b);
    durations.sort((a, b) => a - b);
    const result = {name, seeds, errors: 0, p50: attempts[seeds / 2], p95: attempts[Math.ceil(seeds * .95) - 1],
      max: attempts.at(-1), elapsedMs: +durations.reduce((a, b) => a + b, 0).toFixed(1),
      p95Ms: +durations[Math.ceil(seeds * .95) - 1].toFixed(3), maxMs: +durations.at(-1).toFixed(3),
      triple, maxCdfGap: Math.max(...Object.values(stats).map(data => data.cdfGap)), histograms: stats};
    console.log('A2 ' + JSON.stringify(result));
  });
}

test('A2 — élimination explicite des versions inconnues, rejeu LCG conservé', () => {
  for (const input of Object.values(faces)) {
    for (const seed of ['bio-inv-3', 'archive-bio-inv', '☘ Microcosme']) {
      assert.deepEqual(drawEyes(input, seed, legacyDraw).values, randomEyes(input, seed));
    }
  }
  assert.throws(() => drawEyes({}, seed, 'future'), /version de tirage/i);
  assert.throws(() => drawEyes({}, 7), /graine textuelle/i);
});
