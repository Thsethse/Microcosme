import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import {adultSettings, restoreAdultSettings} from '../adult-settings.mjs';
import {appearanceDocument} from '../appearance.mjs';
import {referenceChest} from '../chest.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {referenceThoraxDetails} from '../thorax-details.mjs';
import {normalizeIris} from '../iris.mjs';
import {normalizeMakeup} from '../makeup.mjs';
import {parseWorkshop, workshopDocument, workshopVersion} from '../workshop-archive.mjs';
import {parseResident, renderResident, residentVersion, r02RenderVersion, serializeResident} from '../resident.mjs';
import {residentWitnesses} from '../resident-witnesses.mjs';
import {character} from '../render.mjs';

const raw = {style:'p5-061', arrangement:'G', body:'standard'};
const settings = {
  eyes: null, form: 'historical', colour: 'bleu-vif', flat: false,
  irisLatent: normalizeIris({}), makeupLatent: normalizeMakeup({lips: {enabled: true}})
};
const encode = JSON.stringify;

test('l’archive atelier relit H/F à froid dans les deux sens et depuis un corps historique', () => {
  const bodySettings = {
    'adult-f': {chest: {...referenceChest, volume: 0, width: 37.125}, pubicHairLength: 36.125},
    'adult-h': {pectorals: {...referencePectorals, volume: 0, width: 78.25}, corpulence: 73.125}
  };
  const preferences = new Map(Object.entries(bodySettings));
  for (const body of ['adult-f', 'adult-h', 'standard']) {
    const selection = restoreAdultSettings(raw, body, bodySettings[body] ?? {});
    const document = workshopDocument(selection, settings, preferences, true);
    const restored = parseWorkshop(encode(document));
    const coldPreferences = new Map(Object.entries(restored.inactiveBodies));
    if (bodySettings[body]) coldPreferences.set(body, adultSettings(restored.selection.state));
    for (const [base, expected] of preferences) {
      const reopened = restoreAdultSettings(restored.selection.raw, base, coldPreferences.get(base));
      assert.deepEqual(adultSettings(reopened.state), expected);
    }
    assert.equal(restored.selection.state.body, body);
    assert.equal(restored.colour, 'bleu-vif');
    assert.equal(restored.flat, false);
    assert.deepEqual(restored.irisLatent, settings.irisLatent);
    assert.deepEqual(restored.makeupLatent, settings.makeupLatent);
    assert.deepEqual(workshopDocument(restored.selection, restored, coldPreferences, true), document);
  }
});

test('les archives historiques restent lisibles et le tracé d’origine v22 reste indéterminé', () => {
  const oldSelection = restoreAdultSettings(raw, 'adult-f', {pubicHairLength: 36.125});
  const old = appearanceDocument(oldSelection, settings);
  const legacy = parseWorkshop(encode(old));
  assert.equal(old.version, 22);
  assert.equal(legacy.ambiguousRender, true);
  assert.equal(legacy.selection.state.pubicHairLength, 36.125);
  assert.deepEqual(legacy.inactiveBodies, {});
  const current = workshopDocument(legacy.selection, legacy, new Map(), true);
  assert.equal(current.version, workshopVersion);
  assert.equal(current.renderProfile, r02RenderVersion);
  assert.deepEqual(current.active, old);
  assert.equal(parseWorkshop(encode(current)).ambiguousRender, undefined);
  const v1 = appearanceDocument(restoreAdultSettings(raw, 'standard', {}), {...settings, irisLatent: null, makeupLatent: null});
  assert.equal(v1.version, 1);
  assert.equal(parseWorkshop(encode(v1)).selection.key, 'p5-061:G');
});

test('l’archive conserve les valeurs historiques des mamelons et du nombril retirées de l’éditeur', () => {
  const selection = restoreAdultSettings(raw, 'adult-h', {thoraxDetails: referenceThoraxDetails['adult-h']});
  const historic = appearanceDocument(selection, settings);
  historic.version = 20;
  historic.renderer = 'bio-corps-05-c-svg@1';
  historic.character.navel = {size:80,shape:70,relief:60};
  Object.assign(historic.character.thoraxDetails, {nippleSize: 50, relief: 80});
  const restored = parseWorkshop(encode(historic));
  assert.equal(restored.importedNavel, true);
  assert.equal(restored.selection.state.thoraxDetails.nippleSize, undefined);
  const archive = workshopDocument(restored.selection, restored, new Map(), true, restored.historicalSource);
  const cold = parseWorkshop(encode(archive));
  assert.deepEqual(cold.historicalSource, historic);
  assert.equal(cold.selection.state.thoraxDetails.nippleSize, undefined);
});

test('l’atelier refuse les archives incohérentes et les valeurs inactives incompatibles', () => {
  const selection = restoreAdultSettings(raw, 'adult-f', {});
  const archive = workshopDocument(selection, settings, new Map(), true);
  for (const [value, diagnostic] of [
    [{...archive, version: 99}, /format/i],
    [{...archive, renderProfile: 'futur'}, /profil/i],
    [{...archive, inactiveBodies: {'adult-h': {chest: referenceChest}}}, /incompatibles/i],
    [{...archive, inactiveBodies: {'adult-f': {}}}, /inactive/i],
    [{...archive, inactiveBodies: {'adult-h': {corpulence: 101}}}, /corpulence/i],
    [{...archive, inactiveBodies: {'adult-h': {unknown: 23}}}, /incompatibles/i]
  ]) assert.throws(() => parseWorkshop(encode(value)), diagnostic);
});

const views = {
  portrait: '-30 -65 220 225', pawn: '-40 -85 240 355', thumbnail: '-35 -68 230 245'
};

// Matched against the distributed BIO-CORPS-06-R02 SVGs with a stable instance.
const r02Digests = {
  'temoin-f-01': {
    portrait: 'b09a57cf8bfe0de30d0117703b73d40bc85b253ae13c20924083aa31e228e8e8',
    pawn: '2d94f3c0c61650b76ea42d96d7a8f8ba0ecf63e30c2b5650049b26f08412c4b8',
    thumbnail: '9607d4baaea82fd587684478c9e9a1a98642da95d641845bd124fe387e6808da'
  },
  'temoin-h-01': {
    portrait: '2a36e850f5d93249d3064bbb8fc15f52f540374dfc39cab0c2d181df75e4f2a5',
    pawn: 'a14eca6f455602c793cc27766f9db993666028d0f454e77d7ef3774f9cb0bdf2',
    thumbnail: '8fe8e1bec1bdec9e464a957c9b9743c4b443415bc4c9c76ff4678ce02e9d424d'
  }
};

test('les témoins conservent leurs données et leur identité et reproduisent l’appel artistique R02', () => {
  const ids = new Set();
  for (const resident of residentWitnesses()) {
    const data = serializeResident(resident);
    const restored = parseResident(data);
    assert.deepEqual(restored, resident);
    assert.equal(restored.identity.id, resident.identity.id);
    ids.add(restored.identity.id);
    assert.doesNotMatch(data, /<svg|viewBox|effectiveOptions/);
    for (const [representation, viewBox] of Object.entries(views)) {
      const opts = {representation, instance:'snapshot'};
      const svg = renderResident(restored, opts);
      const {beard, ...body} = resident.physical;
      const input = {...resident.voluntary.hairstyle, ...resident.biology.morphology, ...body,
        body: resident.biology.body, structure: resident.biology.structure};
      const reference = character(input, {
        ...resident.biology.face, beard, beardCategory: resident.biology.body === 'adult-h' ? 'H' : 'F',
        scars: resident.acquired.scars, makeup: resident.voluntary.makeup,
        hairColor: resident.biology.naturalHairColor, rememberedHairColor: resident.biology.naturalHairColor,
        naturalEyes: true, boneReliefs: true, bellyFinish: true, pelvicDetails: true,
        headOnly: representation !== 'pawn', smallScale: representation === 'thumbnail',
        instance: 'resident-explicit-snapshot'
      }).replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`);
      assert.equal(svg, reference);
      assert.equal(createHash('sha256').update(svg).digest('hex'), r02Digests[resident.identity.id][representation]);
      assert.equal(svg, renderResident(resident, opts));
      assert.match(svg, /data-bone-reliefs/);
      assert.match(svg, /data-navel-part/);
      assert.match(svg, /data-pubic-hair/);
      assert.match(svg, resident.biology.body === 'adult-f' ? /data-bio-makeup/ : /data-bio-scar/);
    }
    assert.equal(serializeResident(resident), data);
    assert.equal(serializeResident(restored), data);
  }
  assert.equal(ids.size, 2);
});

test('chaque SVG a des identifiants propres et ses références restent locales', () => {
  const seen = new Set();
  for (const resident of residentWitnesses()) for (const representation of Object.keys(views)) {
    const svg = renderResident(resident, {representation});
    const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);
    assert(ids.length > 0);
    for (const id of ids) {
      assert(!seen.has(id), id);
      seen.add(id);
    }
    for (const [, id] of svg.matchAll(/url\(#([^\)]+)\)/g)) assert(ids.includes(id), id);
  }
});

test('les versions des données, de génération et de rendu évoluent indépendamment', () => {
  const [resident] = residentWitnesses();
  const original = renderResident(resident, {instance: 'fixed'});
  for (const generatorVersion of ['prototype-1', 'prototype-2']) {
    resident.generation = {seed: 'graine témoin', generatorVersion};
    const restored = parseResident(serializeResident(resident));
    assert.equal(restored.version, residentVersion);
    assert.equal(restored.generation.generatorVersion, generatorVersion);
    assert.equal(renderResident(restored, {instance: 'fixed', renderVersion: r02RenderVersion}), original);
    assert.throws(() => renderResident(restored, {renderVersion: generatorVersion}), /version de rendu/i);
  }
});

test('une sauvegarde individuelle invalide produit une erreur sans recréer un habitant', () => {
  const [resident] = residentWitnesses();
  assert.throws(() => parseResident('{'), SyntaxError);
  assert.throws(() => parseResident(encode({...resident, version: 9})), /format/i);
  assert.throws(() => parseResident(encode({...resident, identity: {id: ''}})), /identité/i);
  assert.throws(() => parseResident(encode({...resident, physical: {corpulence: 101}})), /corpulence/i);
  assert.throws(() => parseResident(encode({...resident, physical: {pectorals: referencePectorals}})), /incompatibles/i);
  assert.throws(() => parseResident(encode({...resident, physical: {unknown: 1}})), /structure/i);
  assert.throws(() => parseResident(encode({...resident, generation: {generatorVersion: 'demo'}})), /génération/i);
  assert.throws(() => serializeResident({...resident, svg: '<svg/>'}), /structure/i);
});
