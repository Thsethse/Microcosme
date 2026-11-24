import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {availableOptions} from '../availability.mjs';
import {eyeChanges, eyeDomains, eyeProposal} from '../eye-domain.mjs';
import {acceptsEyes, eyePresets, faceEnvelope, normalizeEyes, solveEyes} from '../eyes.mjs';
import {characterInput} from '../appearance.mjs';
import {choices} from '../../bio-col-01/catalogue.mjs';
import {restoreSelection} from '../../bio-col-01/selection.mjs';
import {controls, presets, bodies} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const audit = JSON.parse(readFileSync(new URL('../../docs/ai/bio-inv-01/preuves/vecteurs.json', import.meta.url)));
const extremes = property => Object.fromEntries(Object.entries(controls).map(([key, range]) => [key, range[property]]));
const narrow = {...extremes('min'), forehead_width: 1.14, jowls: 1.35};
const faces = {neutral: {}, tall: presets.tall.values, broad: presets.broad.values, ipad: priorityCase,
  min: extremes('min'), max: extremes('max'), narrow, elongated: {...narrow, skull_height: 1.18}};
const eyeProfiles = {neutral: normalizeEyes({}), ...Object.fromEntries(Object.entries(eyePresets).map(([key, p]) => [key, p.values]))};

test('B1 — 72 balayages P3, crans sûrs et valeurs effectives complètes', () => {
  let slices = 0, empty = 0;
  for (const [face, input] of Object.entries(faces)) {
    const envelope = faceEnvelope(input);
    for (const [context, values] of Object.entries(eyeProfiles)) {
      const originals = eyeDomains(envelope, values);
      for (const [key, {intervals}] of Object.entries(originals)) {
        const prior = audit.eyes.sweeps[face][context][key].direct;
        assert.deepEqual(intervals, prior, [face, context, key].join('/'));
        if (!intervals.length) empty++;
        slices++;
      }
      const {effective} = solveEyes(envelope, values);
      const direct = eyeDomains(envelope, effective);
      for (const [key, {points}] of Object.entries(direct)) {
        for (const value of points) {
          const request = {...effective, [key]: value};
          assert.equal(acceptsEyes(envelope, request), true);
          const result = eyeProposal(envelope, request);
          assert.deepEqual(result.changes, []);
          for (const other of Object.keys(effective)) assert.equal(result.effective[other], request[other]);
        }
      }
    }
  }
  assert.equal(slices, 576);
  assert(empty > 0);
  console.log(JSON.stringify({slices, empty}));
});

test('B1 — coin 159, union d’intervalles et proposition explicite sur la largeur', () => {
  const {input, values, gap, admissible, solved} = audit.eyes.sliceExample.tilt;
  const face = faceEnvelope(input);
  assert.deepEqual(eyeDomains(face, values).tilt, {intervals: admissible, points: [-12, -11, -10, 10, 11, 12]});
  const request = {...values, tilt: gap};
  const proposal = eyeProposal(face, request);
  assert.deepEqual(proposal.changes, [{key: 'width', before: 94, after: solved.width}]);
  assert.deepEqual(proposal.effective, solved);
  assert.deepEqual(eyeChanges(solved, solved), []);
  assert.equal(values.width, 94);
});

test('B2/B3 — disponibilité issue du rendu sur les 126 références et les six corps', () => {
  const rows = choices.map(({key, style, arrangement}) => {
    const selection = restoreSelection({style, arrangement: arrangement === 'U' ? 'G' : arrangement});
    const options = availableOptions(characterInput(selection), 'historical');
    return {key, options};
  });
  const keys = flag => rows.filter(({options}) => options[flag]).map(({key}) => key);
  const row = key => rows.find(row => row.key === key).options;
  assert.equal(rows.length, 126);
  assert.deepEqual(keys('accessories'), audit.hair.flags.accessories);
  assert.deepEqual(keys('contrast'), ['p5-050:G', 'p5-050:D', 'p5-062:D']);
  assert.equal(keys('arrangement').length, 108);
  assert.equal(keys('palette').length, 124);
  assert.equal(row('shaved:U').forehead, false);
  assert.equal(row('p5-063:G').palette, false);
  assert.equal(row('p5-063:G').accessories, true);
  assert.equal(row('p5-038:G').contrast, false);
  assert.equal(row('p5-038:G').accessories, false);
  assert.equal(row('p5-050:D').contrast, true);
  for (const body of Object.keys(bodies)) {
    const selection = restoreSelection({style:'p5-050', arrangement:'D', body});
    assert.equal(availableOptions(characterInput(selection), 'bleu-vif').contrast, true);
  }
  const mono = restoreSelection({style:'p5-050', arrangement:'D', monochrome:true, contrast:true});
  assert.equal(availableOptions(characterInput(mono), 'bleu-vif').contrast, false);
});
