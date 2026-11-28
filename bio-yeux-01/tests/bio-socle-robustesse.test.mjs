import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultSettings, restoreAdultSettings} from '../adult-settings.mjs';
import {characterInput} from '../appearance.mjs';
import {abdominalControls, referenceAbdominals} from '../abdominals.mjs';
import {beardDrawVersion, beardPresets, normalizeBeard} from '../beard.mjs';
import {structureControls, referenceStructure} from '../body-structure.mjs';
import {chestControls, referenceChest} from '../chest.mjs';
import {currentDraw, drawEyes, seededIndex} from '../draw.mjs';
import {drawMakeup} from '../makeup.mjs';
import {pectoralControls, referencePectorals} from '../pectorals.mjs';
import {parseResident, renderResident, serializeResident} from '../resident.mjs';
import {residentWitnesses} from '../resident-witnesses.mjs';
import {renderView, workshopRenderVersion} from '../render-profile.mjs';
import {referenceThoraxDetails, thoraxDetailControls} from '../thorax-details.mjs';
import {workshopDocument, parseWorkshop} from '../workshop-archive.mjs';
import {historicalDocuments, legacyAppearanceDefaults} from './legacy-appearance-fixtures.mjs';

const bodies = ['adult-f', 'adult-h'];
const categories = ['H', 'F', 'T'];
const views = {portrait:'head', pawn:'tile', thumbnail:'mini'};
const {raw, basic, iris, details, brows, mouth, nose, marks, scars, makeup} = legacyAppearanceDefaults;
const beard = normalizeBeard(beardPresets.short.values);

function allFields(controls, pick) {
  return Object.fromEntries(Object.entries(controls).map(([key, {min, max}]) => [key, pick(min, max)]));
}

function settingsForBody(body, pick, percent) {
  return {
    structure: allFields(structureControls, (min,max) => Math.round(pick(min,max))),
    corpulence: percent(), thoraxDetails: allFields(thoraxDetailControls,pick),
    abdominals: allFields(abdominalControls,pick), pubicHairLength: percent(),
    ...(body === 'adult-f'
      ? {chest: allFields(chestControls,pick)}
      : {pectorals: allFields(pectoralControls,pick)})
  };
}

function faceSettings(input, category, mode, flat, seed) {
  const settings = {...basic, beardCategory:category, flat};
  if (mode === 'historical') return settings;
  const draw = {seed, version:beardDrawVersion};
  if (mode === 'latent') return {...settings,
    irisLatent:iris, detailsLatent:details, browsLatent:brows, mouthLatent:mouth, noseLatent:nose,
    beardLatent:beard, beardDraw:draw, marksLatent:marks, scarsLatent:scars, makeupLatent:makeup
  };
  return {...settings,
    eyes:drawEyes(input,seed).values, form:'custom', draw:{seed,version:currentDraw},
    iris, details, brows, mouth, nose, beard, beardDraw:draw, marks, scars, makeup
  };
}

function renderArchive(selection, settings, body, view) {
  const {eyes, iris, details, brows, mouth, nose, beard, beardCategory, marks, scars, makeup, colour, flat} = settings;
  return renderView(characterInput(selection), {
    view, eyes, iris, details, brows, mouth, nose, beard, beardCategory, marks, scars, makeup,
    naturalEyes:true, boneReliefs:true, bellyFinish:true, pelvicDetails:true,
    hairColor:flat ? colour : 'historical', rememberedHairColor:colour, instance:`archive-${body}-${view}`
  });
}

function assertWorkshopCycle({
  activeBody, preferences, rawSelection = raw, category, mode, flat, seed
}) {
  const selection = restoreAdultSettings(rawSelection, activeBody, preferences.get(activeBody));
  const settings = faceSettings(characterInput(selection), category, mode, flat, seed);
  const expected = Object.fromEntries(bodies.map(body => {
    const own = restoreAdultSettings(rawSelection, body, preferences.get(body));
    return [body, Object.values(views).map(view => renderArchive(own, settings, body, view))];
  }));
  let active = selection;
  let options = settings;
  let retained = preferences;
  for (const body of [activeBody, bodies.find(body => body !== activeBody), activeBody]) {
    const document = workshopDocument(active, options, retained, true);
    assert.equal(document.active.character.body, body);
    const restored = parseWorkshop(JSON.stringify(document));
    assert.equal(restored.beardCategory ?? 'H', category);
    assert.equal(restored.selection.key, selection.key);
    assert.equal(restored.flat, flat);
    assert.deepEqual(adultSettings(restored.selection.state), preferences.get(body));
    const other = bodies.find(base => base !== body);
    assert.deepEqual(restored.inactiveBodies, {[other]:preferences.get(other)});
    const graphics = Object.values(views).map(view => renderArchive(restored.selection, restored, body, view));
    assert.deepEqual(graphics, expected[body]);
    if (mode === 'latent') {
      for (const key of ['iris','details','brows','mouth','nose','beard','marks','scars','makeup']) {
        const field = key + 'Latent';
        assert.deepEqual(restored[field], settings[field], key);
      }
    }
    if (mode === 'active' && category === 'F') {
      assert(Object.values(document.active.facialHair.effective.zones).every(value => !value));
      assert(!graphics.some(svg => svg.includes('data-bio-facial-hair')));
    }
    retained = new Map(Object.entries(restored.inactiveBodies));
    retained.set(body, adultSettings(restored.selection.state));
    assert.deepEqual(workshopDocument(restored.selection, restored, retained, true), document);
    active = restoreAdultSettings(restored.selection.raw, other, retained.get(other));
    options = restored;
  }
}

test('atelier · 108 configurations croisent base, catégorie, calques, bornes et palette', () => {
  let count = 0;
  for (const activeBody of bodies) for (const category of categories) {
    for (const mode of ['historical','latent','active']) for (const level of [0,.37125,1]) {
      for (const flat of [false,true]) {
        const preferences = new Map(bodies.map(body => {
          const ratio = body === activeBody ? level : 1-level;
          const pick = (lo,hi) => lo + (hi-lo)*ratio;
          return [body,settingsForBody(body,pick,()=>pick(0,100))];
        }));
        const seed = `socle-r02/croisement/${count}`;
        assertWorkshopCycle({activeBody, preferences, category, mode, flat, seed});
        count++;
      }
    }
  }
  assert.equal(count,108);
});

test('atelier · 48 configurations à graine fixe, changements H/F et réexports', () => {
  for (let i=0;i<48;i++) {
    const seed = `socle-r02/atelier/${i}`;
    const next = seededIndex(seed);
    const pick = (lo,hi) => lo + (hi-lo)*next(1025)/1024;
    const activeBody = bodies[i%2];
    const category = categories[i%3];
    const mode = ['historical','latent','active'][Math.floor(i/6)%3];
    const choices = [raw,{...raw,style:'shaved',arrangement:'U'},{...raw,style:'p5-065',arrangement:'D'}];
    const rawSelection = {...choices[next(choices.length)], skull_width:pick(.86,1.18),
      skull_height:pick(.88,1.18), cheek_width:pick(.88,1.22), monochrome:next(2)===1};
    const preferences = new Map(bodies.map(body => [body,settingsForBody(body,pick,()=>pick(0,100))]));
    try {
      assertWorkshopCycle({activeBody, preferences, rawSelection, category, mode, flat:next(2)===1, seed});
    } catch (error) {
      throw new Error(seed, {cause:error});
    }
  }
});

test('atelier · 22 archives historiques, migration puis rejeu et contrôle de provenance', () => {
  const fixtures = historicalDocuments();
  assert.deepEqual(fixtures.map(({version}) => version),Array.from({length:22}, (_,i) => i+1));
  for (const legacy of fixtures) {
    const restored = parseWorkshop(JSON.stringify(legacy));
    assert.equal(restored.legacy,true);
    assert.equal(restored.ambiguousRender,legacy.version===22);
    assert.deepEqual(restored.inactiveBodies,{});
    assert.equal(restored.selection.key,'p5-061:G');
    const obsolete = [18,19,20].includes(legacy.version);
    assert.deepEqual(restored.historicalSource, obsolete ? legacy : undefined);
    const output = workshopDocument(restored.selection,restored,new Map(),false,restored.historicalSource);
    const replay = parseWorkshop(JSON.stringify(output));
    assert.deepEqual(replay.historicalSource,restored.historicalSource);
    assert.deepEqual(workshopDocument(replay.selection,replay,new Map(),false,replay.historicalSource),output);
    assert.equal(output.renderProfile,workshopRenderVersion);
    if (legacy.version===14) assert.deepEqual(output.active.character.chestOrigin,{divergence:-9,position:37.125});
    if (legacy.version===22) assert.equal(output.active.character.pubicHairLength,36.125);
  }
});

test('atelier · le lecteur et l’export refusent les sources historiques incohérentes', () => {
  const [v1] = historicalDocuments();
  const {selection,...options} = parseWorkshop(JSON.stringify(v1));
  const valid = workshopDocument(selection,options,new Map(),true);
  for (const [source, diagnostic] of [[v1,/source historique/i], [null,/document d’apparence/i],
    [{...v1,renderer:'inconnu'},/version de rendu/i]]) {
    assert.throws(()=>workshopDocument(selection,options,new Map(),true,source),diagnostic);
    assert.throws(()=>parseWorkshop(JSON.stringify({...valid,historicalSource:source})),diagnostic);
  }
});

test('atelier · 16 archives incomplètes ou incohérentes sont refusées sur les deux bases', () => {
  for (const body of bodies) {
    const prefs = new Map(bodies.map(base => [base,settingsForBody(base,(a,b)=>(a+b)/2,()=>50)]));
    const selection = restoreAdultSettings(raw,body,prefs.get(body));
    const archive = workshopDocument(selection,{...basic,beardCategory:'T'},prefs,true);
    const change = mutate => {
      const candidate = structuredClone(archive);
      mutate(candidate);
      return JSON.stringify(candidate);
    };
    const other = bodies.find(base => base !== body);
    for (const [text, diagnostic] of [
      ['{', SyntaxError], ['null', /format/i], [change(d=>delete d.active), /champs/i],
      [change(d=>delete d.inactiveBodies), /champs/i], [change(d=>{d.inactiveBodies=[];}), /inactives/i],
      [change(d=>{d.inactiveBodies[body]={};}), /inactive/i],
      [change(d=>{d.inactiveBodies[other].pubicHairLength='40';}), /pousse/i],
      [change(d=>{d.active.facialHair.category='';}), /catégorie/i],
      [change(d=>{d.active.character.corpulence=101;}), /corpulence/i],
      [change(d=>{d.active.character.pubicHairLength=null;}), /pousse/i],
      [change(d=>delete d.active.character.body), /base adulte/i],
      [change(d=>{d.active.character.morphology.skull_width=.1;}), /données effectives/i],
      [change(d=>{d.active.palette.mode='autre';}), /palette/i],
      [change(d=>{d.active.renderer='ancien-inconnu';}), /version de rendu/i],
      [change(d=>{d.renderProfile='inconnu';}), /profil/i],
      [change(d=>{d.extra=true;}), /champs/i]
    ]) assert.throws(()=>parseWorkshop(text),diagnostic,text);
  }
});

test('habitants · 64 cas à graine fixe rejouent l’identité et les trois représentations', () => {
  const identities = new Set();
  const witnesses = residentWitnesses();
  for (let i=0;i<64;i++) {
    const seed = `socle-r02/habitant/${i}`;
    const next = seededIndex(seed);
    const pick = (lo,hi) => lo + (hi-lo)*next(257)/256;
    const resident = structuredClone(witnesses[i%2]);
    const {structure,...physical} = settingsForBody(resident.biology.body,pick,()=>pick(0,100));
    resident.identity.id = seed;
    resident.biology.structure = structure;
    resident.biology.morphology.skull_width = pick(.86,1.18);
    resident.physical = {...physical,beard};
    resident.voluntary.shaved = i%4<2;
    resident.voluntary.makeup = i%3===0 ? makeup : drawMakeup(seed);
    if (next(2)===1) resident.voluntary.dye = 'bleu-vif';
    resident.generation = {seed,generatorVersion:'fixture-robustesse-v1'};

    try {
      const original = serializeResident(resident);
      const replay = parseResident(serializeResident(parseResident(original)));
      assert.equal(serializeResident(replay),original);
      assert.equal(replay.identity.id,seed);
      identities.add(replay.identity.id);

      for (const representation of Object.keys(views)) {
        const options = {representation,instance:'robustesse'};
        const svg = renderResident(replay,options);
        assert.equal(svg,renderResident(resident,options));
        assert.match(svg,/^<svg /);
        assert.match(svg,/data-adult-body/);
        assert.doesNotMatch(svg,/NaN|Infinity/);
        const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map(([,id])=>id));
        for (const [,id] of svg.matchAll(/url\(#([^\)]+)\)/g)) assert(ids.has(id),id);
      }
      assert.equal(serializeResident(resident),original);
    } catch (error) {
      throw new Error(seed,{cause:error});
    }
  }
  assert.equal(identities.size,64);
});

test('habitants · 12 mutations invalides sont rejetées par le lecteur, l’export et le rendu sur les deux bases', () => {
  for (const resident of residentWitnesses()) {
    for (const mutate of [
      d=>delete d.history, d=>{d.history=[{target:'cheveux'}];}, d=>{d.identity.id='  ';},
      d=>{d.biology.body='standard';}, d=>{d.biology.naturalHairColor='bleu-vif';},
      d=>{d.physical.pubicHairLength=-1;}, d=>{d.voluntary.shaved='true';},
      d=>{d.voluntary.hairstyle.arrangement='Z';}, d=>{d.generation={seed:12,generatorVersion:'v1'};},
      d=>{d.acquired.marks=[{id:'m1'}];}, d=>{d.biology.face.iris={};},
      d=>{d.physical[d.biology.body==='adult-f'?'pectorals':'chest']=d.biology.body==='adult-f'?referencePectorals:referenceChest;}
    ]) {
      const candidate = structuredClone(resident);
      mutate(candidate);
      assert.throws(()=>parseResident(JSON.stringify(candidate)));
      assert.throws(()=>serializeResident(candidate));
      assert.throws(()=>renderResident(candidate));
    }
  }
});
