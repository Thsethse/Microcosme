import assert from 'node:assert/strict';
import {test} from 'node:test';
import {browHeightEquivalent, browHeightRange, historicalBrowHeight} from '../brow-height-control.mjs';
import {browMarkup, normalizeBrows} from '../brows.mjs';
import {eyePresets} from '../eyes.mjs';
import {normalizeMouth} from '../mouth.mjs';
import {normalizeNose} from '../nose.mjs';
import {initialProceduralFace} from '../procedural-face.mjs';
import {studyCases, visualCases} from '../../preview/bio-epure-03-l03-r01/cases.mjs';
import {prepareStudy} from '../../preview/bio-epure-03-l03-r01/study.mjs';

const editingRange = study => browHeightRange(height => study.solve(height).effective.height);

test('la transformation définitive reproduit la planche R01 sur les 1 404 configurations', () => {
  let cases = 0, plateaus = 0;
  for (const scenario of studyCases()) {
    const study = prepareStudy(scenario);
    const range = editingRange(study);
    const {height, ...shape} = study.centre.effective;
    assert.deepEqual(range, {low: study.min, anchor: height, high: study.limit}, scenario.id);
    let previous = -Infinity;
    for (let level = 0; level <= 100; level += 5) {
      const request = historicalBrowHeight(level, range);
      assert.equal(request, study.carrier(level), scenario.id);
      const {height: effective, ...other} = study.solve(request).effective;
      assert(effective >= previous - 1e-10, scenario.id);
      assert.deepEqual(other, shape, scenario.id);
      const shown = browHeightEquivalent(effective, range);
      if (effective === range.anchor) assert.equal(shown, 50, scenario.id);
      else assert(Math.abs(shown - level) < 1e-9, scenario.id);
      previous = effective;
    }
    if (range.low === range.anchor) {
      plateaus++;
      assert.equal(browMarkup(study.solve(historicalBrowHeight(0, range))), browMarkup(study.centre), scenario.id);
    }
    cases++;
  }
  assert.deepEqual([cases, plateaus], [1404, 756]);
});

test('le repère 50 convertit en demande 6 et produit le même SVG aux deux cadrages des neuf témoins', () => {
  for (const scenario of visualCases) {
    const study = prepareStudy(scenario);
    const anchor = historicalBrowHeight(50, editingRange(study));
    assert.equal(anchor, 6);
    for (const crop of ['close', 'face']) assert.equal(study.picture(anchor, crop, 'r02'), study.picture(6, crop, 'r02'));
  }
});

test('l’équivalent est conditionnel et la limite du solveur prime sur le plafond proposé', () => {
  const collapsed = {low: 20, anchor: 20, high: 45};
  assert.equal(browHeightEquivalent(94.875, collapsed), null);
  assert.equal(browHeightEquivalent(20, collapsed), 50);
  assert.equal(historicalBrowHeight(25, collapsed), 20);
  assert.equal(historicalBrowHeight(50, collapsed), 6);
  const restricted = browHeightRange(height => Math.max(2, Math.min(14, height)));
  assert.deepEqual(restricted, {low: 2, anchor: 6, high: 14});
  assert.equal(historicalBrowHeight(100, restricted), 14);
  assert.equal(browHeightEquivalent(14, restricted), 100);
  assert.equal(browHeightEquivalent(2, restricted), 0);
});

test('la création utilise les références existantes et fournit des demandes indépendantes', () => {
  const first = initialProceduralFace();
  assert.deepEqual(first, {
    eyes: eyePresets.round.values,
    brows: {...normalizeBrows({}), height: 6},
    nose: normalizeNose({}),
    mouth: normalizeMouth({})
  });
  assert(Object.isFrozen(first.eyes));
  first.brows.height = 10;
  assert.deepEqual(initialProceduralFace().eyes, eyePresets.round.values);
  assert.equal(initialProceduralFace().brows.height, 6);
});
