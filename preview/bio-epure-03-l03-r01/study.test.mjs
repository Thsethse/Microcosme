import assert from 'node:assert/strict';
import {test} from 'node:test';
import {restoreAdultSettings} from '../../bio-yeux-01/adult-settings.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../../bio-yeux-01/appearance.mjs';
import {browDrawVersion, browMarkup, browPresets, drawBrows, normalizeBrows} from '../../bio-yeux-01/brows.mjs';
import {parseResident, renderResident, serializeResident} from '../../bio-yeux-01/resident.mjs';
import {residentWitnesses} from '../../bio-yeux-01/resident-witnesses.mjs';
import {parseWorkshop, workshopDocument} from '../../bio-yeux-01/workshop-archive.mjs';
import {studyCases, visualCases} from './cases.mjs';
import {historicalLevels, inkPoints, prepareStudy, proposedLevels, upwardCap} from './study.mjs';

test('les neuf témoins reproduisent exactement l’ancien 6 % au nouveau 50 %, SVG entier compris', () => {
  assert.deepEqual(historicalLevels, [0, 6, 25, 50, 75, 100]);
  assert.deepEqual(proposedLevels, [0, 25, 50, 75, 100]);
  assert.equal(visualCases.length, 9);
  for (const scenario of visualCases) {
    const study = prepareStudy(scenario);
    assert.equal(study.carrier(50), 6, scenario.id);
    assert.deepEqual(study.solve(study.carrier(50)), study.solve(6), scenario.id);
    for (const crop of ['close', 'face']) {
      const oldSVG = study.picture(6, crop, 'exact');
      assert.match(oldSVG, /data-bio-brows="custom"/);
      assert.equal(oldSVG, study.picture(study.carrier(50), crop, 'exact'), scenario.id);
    }
  }
});

test('1 404 configurations, extrémités admissibles et progression sans déformation', () => {
  let cases = 0, plateaus = 0;
  for (const scenario of studyCases()) {
    cases++;
    const study = prepareStudy(scenario);
    const {height: anchor, ...shape} = study.solve(6).effective;
    assert.equal(study.carrier(50), 6, scenario.id);
    assert.equal(study.solve(study.carrier(0)).effective.height, study.min, scenario.id);
    assert.equal(study.solve(study.carrier(100)).effective.height, Math.min(study.max, anchor + upwardCap), scenario.id);
    assert(study.rise > 0, scenario.id);
    const points = inkPoints(study.centre);
    assert(points.length > 0, scenario.id);
    const frame = study.frame;
    let previous = -Infinity;
    for (let level = 0; level <= 100; level += 5) {
      const result = study.solve(study.carrier(level));
      const {height, ...other} = result.effective;
      assert(height + 1e-10 >= previous, scenario.id);
      assert(height >= study.min - 1e-10 && height <= study.max + 1e-10, scenario.id);
      assert.deepEqual(other, shape, scenario.id);
      assert.deepEqual(result.pigment, study.centre.pigment, scenario.id);
      previous = height;
      if (!proposedLevels.includes(level)) continue;
      const vertex = inkPoints(result);
      assert.equal(vertex.length, points.length, scenario.id);
      const dy = (anchor - height) * frame.travel / 100;
      for (const [index, [x, y]] of vertex.entries()) {
        assert(Math.abs(x - frame.cx) <= frame.halfWidth + 1e-6, scenario.id);
        assert(y >= frame.top - 1e-6 && y <= frame.bottom + 1e-6, scenario.id);
        assert.equal(x, points[index][0], scenario.id);
        assert(Math.abs(y - points[index][1] - dy) <= 1.01e-6, scenario.id);
      }
    }
    if (study.descent === 0) {
      plateaus++;
      for (const level of [0, 25, 50]) {
        assert.equal(browMarkup(study.solve(study.carrier(level))), browMarkup(study.centre), scenario.id);
      }
    }
  }
  assert.equal(cases, 1404);
  assert.equal(plateaus, 756);
});

test('les neuf presets gardent leur demande historique, avec quatre demandes explicites', () => {
  const heights = Object.fromEntries(Object.entries(browPresets).map(([key, preset]) => [key, normalizeBrows(preset.values).height]));
  assert.deepEqual(heights, {straight: 50, round: 50, angular: 50, rising: 40, falling: 72,
    inflected: 58, thick: 64, fine: 50, short: 50});
  assert.equal(normalizeBrows({}).height, 50);
});

test('archives avant sourcils, demandes hors plage, absents, latents et mémoires H/F', () => {
  const common = {eyes: null, form: 'historical', colour: 'chatain-clair', flat: false};
  const cases = [
    {},
    {brows: {height: 3.125, thickness: 145}},
    {brows: {height: 94.875, slit: true}},
    {brows: {height: 94.875, absent: true}},
    {browsLatent: {height: 94.875, slit: true}}
  ];
  for (const body of ['adult-h', 'adult-f']) {
    const selection = restoreAdultSettings({style: 'shaved', arrangement: 'G'}, body, {});
    const other = body === 'adult-h' ? 'adult-f' : 'adult-h';
    const memory = new Map([[other, {corpulence: 73.125}]]);
    const study = prepareStudy(visualCases.find(scenario => scenario.id === 'broad-f'));
    assert(study.min > cases[1].brows.height && study.limit < cases[2].brows.height);
    for (const settings of cases) {
      const document = appearanceDocument(selection, {...common, ...settings});
      const restored = parseAppearance(JSON.stringify(document));
      assert.deepEqual(appearanceDocument(restored.selection, restored), document);
      if (settings.brows) assert.equal(document.brows.requested.height, settings.brows.height);
      if (settings.brows?.absent) assert.equal(document.brows.effective.height, null);
      if (settings.browsLatent) assert.equal(document.brows.latent.height, settings.browsLatent.height);
      if (!document.brows) assert.equal(settings.brows, undefined);
      const workshop = workshopDocument(selection, restored, memory, true);
      const cold = parseWorkshop(JSON.stringify(workshop));
      const preferences = new Map(Object.entries(cold.inactiveBodies));
      assert.deepEqual(workshopDocument(cold.selection, cold, preferences, true), workshop);
      assert.equal(cold.inactiveBodies[other].corpulence, 73.125);
    }
  }
});

test('canon résident et rejeu historique conservent demandes, graine, version et rendu', () => {
  for (const resident of residentWitnesses()) {
    resident.biology.face.brows = normalizeBrows({height: 94.875, slit: true});
    const restored = parseResident(serializeResident(resident));
    assert.deepEqual(restored, resident);
    for (const representation of ['portrait', 'pawn', 'thumbnail']) {
      const options = {representation, instance: 'high-legacy'};
      assert.equal(renderResident(restored, options), renderResident(resident, options));
    }
  }
  const selection = restoreAdultSettings({style: 'p5-038', arrangement: 'G'}, 'adult-f', {});
  const input = characterInput(selection);
  for (const seed of ['sourcils ✦', 'R01-archive', 'profil étroit']) {
    const brows = drawBrows(input, null, seed);
    for (const stored of [{brows}, {browsLatent: brows}]) {
      const document = appearanceDocument(selection, {eyes: null, form: 'historical', colour: 'chatain-clair',
        flat: false, ...stored, browsDraw: {seed, version: browDrawVersion}});
      const reopened = parseAppearance(JSON.stringify(document));
      assert.deepEqual(reopened.browsDraw, {seed, version: 'brows-xoshiro128ss-v1'});
      assert.deepEqual(drawBrows(characterInput(reopened.selection), null, reopened.browsDraw.seed), brows);
      assert.deepEqual(appearanceDocument(reopened.selection, reopened), document);
    }
  }
});
