import assert from 'node:assert/strict';
import {test} from 'node:test';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {choice, choices, groups, ordinaryChoices, restoreSelection, selectOrdinary, exportSelection} from '../catalogue.mjs';
import {character} from '../render.mjs';
import {groups as inheritedGroups, ordinaryChoices as inheritedOrdinary} from '../../bio-col-01/catalogue.mjs';
import {presets} from '../../preview/bio-vis-p5-i6/model.mjs';

const a = 'p5-048:D', b = 'p5-065:D';
const rendering = ({style, arrangement}, context, options) =>
  character({style, arrangement, ...context}, {instance: 'contract-c', ...options});
const drawing = svg => svg.replace(/ (aria-label|data-reference|data-hair-status)="[^"]*"/g, '')
  .replace(/<g data-layer="[^"]*"><\/g>/g, '');

test('C — 72 équivalences de tracés, avec les seuls éléments non peints ignorés', () => {
  let count = 0;
  for (const morph of [{}, presets.tall.values, presets.broad.values]) {
    for (const accessories of [false, true]) for (const contrast of [false, true]) {
      for (const [headOnly, smallScale] of [[true, false], [false, false], [true, true]]) {
        for (const hairColor of ['historical', 'bleu-vif']) {
          const context = {...morph, accessories, contrast}, opts = {headOnly, smallScale, hairColor};
          assert.equal(drawing(rendering(choice(a), context, opts)), drawing(rendering(choice(b), context, opts)));
          count++;
        }
      }
    }
  }
  assert.equal(count, 72);
});

test('C — un seul alias ajouté et tous les autres choix sont conservés', () => {
  assert.equal(choices.length, 126);
  assert.equal(ordinaryChoices.length, 119);
  assert.deepEqual(ordinaryChoices, inheritedOrdinary.filter(({key}) => key !== b));
  assert.deepEqual(groups.slice(0,-1), inheritedGroups);
  assert.deepEqual([groups.at(-1).primary, groups.at(-1).secondary], [a,b]);
  assert(ordinaryChoices.includes(choice('p5-065:G')));
  assert.throws(() => selectOrdinary(b, {}), /identifiants historiques/i);
  for (const entry of choices) {
    const {style, arrangement, key} = entry;
    const archive = {style, arrangement: arrangement === 'U' ? 'G' : arrangement, memo: [1, 2]};
    const restored = restoreSelection(archive);
    assert.equal(restored.key, key);
    assert.deepEqual(JSON.parse(exportSelection(restored)), archive);
    if (key === b) assert.equal(restored.visibleKey, a);
  }
  const v01 = restoreSelection({style:'p5-061', arrangement:'G'});
  assert.equal(v01.visibleKey, 'p5-056:G');
  assert.equal([...character(characterInput(v01)).matchAll(/data-feature="loose-lock"/g)].length, 2);
});

test('C — export exact des deux identifiants et conservation de 65-G', () => {
  for (const key of [a,b,'p5-065:G']) {
    const {style, arrangement} = choice(key);
    const restored = restoreSelection({style, arrangement, body:'bust', note:'Original exact'});
    const doc = appearanceDocument(restored, {eyes:'round',form:'round',colour:'bleu-vif',flat:true});
    const again = parseAppearance(JSON.stringify(doc));
    assert.equal(again.selection.key, key);
    assert.equal(doc.character.style, style);
    assert.equal(doc.character.arrangement, arrangement);
    assert.equal(again.selection.visibleKey, key === b ? a : key);
    assert.deepEqual(again.selection.raw, restored.raw);
    assert.equal(character(characterInput(again.selection),{instance:'saved',eyes:'round',hairColor:'bleu-vif'}),
      character(characterInput(restored),{instance:'saved',eyes:'round',hairColor:'bleu-vif'}));
  }
  const alias = restoreSelection({style:'p5-065',arrangement:'D'});
  assert.equal(selectOrdinary(a, alias.raw).key, a);
  assert.notEqual(drawing(rendering(choice('p5-065:G'),{},{})),drawing(rendering(choice(b),{},{})));
});
