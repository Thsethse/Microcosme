import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {makeupColourNames} from '../makeup-colour-names.mjs';
import {makeupPalette} from '../makeup.mjs';

const doc = name => readFileSync(new URL('../../docs/ai/' + name, import.meta.url), 'utf8');

test('lot 02 · une destination par identifiant de l’inventaire, y compris les commandes générées', () => {
  const inventory = doc('bio-epure-01-r01/INVENTAIRE.md');
  const matrix = doc('bio-epure-03/l02/MATRICE.md');
  const table = /^\| `([^`]+)`/gm;
  const rows = [...inventory.matchAll(table), ...inventory.matchAll(/`(H\.cas\.[^`]+)`\s+«/g)];
  const ids = new Set(rows.map(match => match[1]));
  const destinations = [...matrix.matchAll(/^\| `([^`]+)` \| (.+) \| (.+) \| (.+) \|$/gm)];
  assert.equal(ids.size, 1282);
  assert.equal(destinations.length, ids.size);
  assert.deepEqual(new Set(destinations.map(match => match[1])), ids);
  const byId = new Map(destinations.map(([, id, , area]) => [id, area]));
  for (const id of ['C1.random-eyes','C2.iris-seed','C3.details-random','C4.brows-seed','D1.nose-random',
    'D2.mouth-seed','E2.beard-random','F1.marks-seed','F2.scars-draw','J2.makeup-draw']) {
    assert.match(byId.get(id), /^Laboratoire → Tirages/, id);
  }
  assert.match(byId.get('E.cat.p5-065:D'), /^Laboratoire/);
  assert.match(byId.get('J2.makeup-json'), /^Technique/);
});

test('lot 02 · conformité des 32 noms de maquillage et de leurs clés', () => {
  const contract = doc('bio-epure-03/CONTRAT_MAITRE.md');
  const table = contract.split('Correspondance maquillage validée :')[1].split('Maquillage : conserver')[0];
  const expected = Object.fromEntries([...table.matchAll(/(?:^|[:;])\s*([a-f\d]{6}) ([^;.\n]+)/gm)]
    .map(([, hex, name]) => ['#' + hex, name.trim()]));
  assert.equal(Object.keys(expected).length, 32);
  assert.deepEqual(makeupColourNames, expected);
  assert.deepEqual(new Set(makeupPalette.flatMap(([, colours]) => colours)), new Set(Object.keys(expected)));
});
