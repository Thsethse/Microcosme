// Projections et rejeu des laboratoires historiques. JSON sur stdout.
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const V1 = require('../../../../preview/bio-gen-t1/model.js');
const B2 = require('../../../../preview/bio-gen-t1-b2/model.js');
const R1 = require('../../../../preview/bio-gen-t1/render.js');
const Rb2 = require('../../../../preview/bio-gen-t1-b2/render.js');
const T2 = require('../../../../preview/bio-gen-t2/model.js');
const G2 = require('../../../../preview/bio-gen-t2/geometry.js');
const profile = require('../../../../preview/bio-struct-t3-b2/biological-profile.js');
const t3 = require('../../../../preview/bio-struct-t3-b2/canonical-body.js');
const project = require('../../../../preview/bio-struct-t3-b2/body-projection.js');
const shape = require('../../../../preview/bio-struct-t3-b2/shape-grammar.js');
const finish = require('../../../../preview/bio-struct-t3-b2/morphology-settings.js');
const face = require('../../../../preview/bio-struct-t3-b2/face-settings.js');
const grooming = require('../../../../preview/bio-struct-t3-b2/grooming-settings.js');

const hash = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const grid = (min, max) => Array.from({length: Math.round((max - min) * 100) + 1}, (_, i) => +(min + i * .01).toFixed(4));
const domain = field => field.type === 'boolean' ? [false, true] : field.options ? Object.keys(field.options) : grid(field.min, field.max);
const summary = (values, rows, views) => ({
  domain: typeof values[0] === 'number' ? [values[0], values.at(-1), .01] : values,
  tested: values.length, rejects: rows.filter(row => row.error),
  changes: Object.fromEntries(views.map(view => [view, new Set(rows.flatMap(row => row[view] ?? [])).size])),
  adjacentEqual: Object.fromEntries(views.map(view => [view,
    rows.slice(1).filter((row, i) => row[view] && row[view] === rows[i][view]).length]))
});
const t2Views = ['front', 'profile', 'back', 'portrait'];
const t2Proj = d => {
  const body = G2.derive(d);
  return Object.fromEntries(t2Views.map(view => [view, hash(G2.project(body, view).commands)]));
};
const t2Mod = (d, patch) => ({...d, params: {...d.params, ...patch}});
function t2Sweeps() {
  const neutral = T2.reference('bio-inv'), active = t2Mod(neutral, {
    chestPresent: true, chestVolume: .65, hairStyle: 'long', beard: .5, moustache: .5,
    sideburns: .5, pubicHair: .5, lashes: true, pecsInk: .75
  });
  const settings = {neutral, active, hidden: t2Mod(neutral, {hairStyle: 'shaved', browShape: 'triangle', pecsInk: 0})};
  const sweeps = Object.fromEntries(Object.entries(settings).map(([key, d]) => [key,
    Object.fromEntries(T2.schema.map(field => {
      const values = domain(field);
      const rows = values.map(value => t2Proj(t2Mod(d, {[field.key]: value})));
      return [field.key, summary(values, rows, t2Views)];
    }))
  ]));
  const commands = (d, view, tag) => G2.project(G2.derive(d), view).commands.filter(c => c.tag.startsWith(tag));
  const chestPair = [{chestShape:'round', chestStretch:.84}, {chestShape:'oval', chestStretch:1.2}]
    .map(v => commands(t2Mod(active, v), 'front', 'chest'));
  const eyeProfile = [.7,1.2].map(eyeSpacing => commands(t2Mod(active, {eyeSpacing}), 'profile', 'eye'));
  const browTriangle = [-.6,.6].map(browTilt => commands(t2Mod(settings.hidden, {browTilt}), 'front', 'brow'));
  const strictPairs = {chestPairEqual: hash(chestPair[0]) === hash(chestPair[1]),
    chestPairMaxDelta: Math.max(...chestPair[0].map((cmd, i) => Math.max(...['x','y','w','h'].map(k => Math.abs(cmd[k] - chestPair[1][i][k]))))),
    eyeProfileEqual: hash(eyeProfile[0]) === hash(eyeProfile[1]), browTriangleEqual: hash(browTriangle[0]) === hash(browTriangle[1])};
  const sample = Array.from({length:4096}, (_, i) => T2.generate('bio-inv-t2-' + i));
  for (const d of sample.slice(0,128)) {
    assert.deepEqual(d, T2.generate(d.seed));
    assert.deepEqual(t2Proj(d), t2Proj(T2.parse(T2.serialize(d))));
  }
  const endpoints = Object.fromEntries(T2.schema.filter(field => field.type === 'number').map(({key,min,max}) => {
    const counts = sample.reduce((out, d) => {const x = d.params[key]; out[x] = (out[x] ?? 0) + 1; return out;}, {});
    const active = Object.values(counts).reduce((a,b) => a+b) - (counts[min] ?? 0) - (counts[max] ?? 0);
    return [key, {min: counts[min], max: counts[max], meanInterior: +(active / ((max - min) * 100 - 1)).toFixed(2)}];
  }));
  const count = predicate => sample.filter(d => predicate(d.params)).length;
  return {sweeps, strictPairs, seeded: {sample: sample.length, chestAbsent: count(p => !p.chestPresent || !p.chestVolume),
    hairShaved: count(p => p.hairStyle === 'shaved'), lashesOff: count(p => !p.lashes), endpoints, replayVerified:128}};
}

const t3Views = ['front', 'profile', 'back'];
const drawingFields = ['kind','x','y','w','h','points','color','outline','surfaceMarks','content','width','radius','clip','inFront'];
function project3(body) {
  return Object.fromEntries(t3Views.map(view => {
    const s = project.projectBody(body, view);
    const pure = s.commands.filter(c => c.visible !== false).map(c =>
      Object.fromEntries(drawingFields.filter(k => Object.hasOwn(c,k)).map(k => [k,c[k]])));
    return [view, hash([pure, s.facialCommands, s.groomingFacial])];
  }));
}
const baseT3 = {morph:{}, shape:{}, finish:{}, face:{}, groom:{}};
function createT3(category, state, seed = 'bio-inv-t3') {
  return t3.generateBodyB2(seed, profile.reference(category).biologicalProfile,
    state.morph, state.shape, state.finish, state.face, state.groom);
}
const t3Clone = (state, group, key, value) => ({...state, [group]: {...state[group], [key]: value}});
function fields3(category) {
  const list = [];
  const add = (group, key, values) => list.push({group, key, values});
  for (const axis of profile.schema) add('morph', axis.key, grid(axis.min, axis.max));
  for (const axis of shape.schema) add('shape', axis.key, Object.keys(axis.options));
  for (const axis of finish.ranges) add('finish', axis.key, grid(0,1));
  add('finish','breastShape', category === 'M' ? [null] : Object.keys(finish.breastShapes));
  add('finish','pubicHairShape', category === 'M' ? ['none','rectangle'] : Object.keys(finish.pubicShapes));
  add('finish','hairColor',['#731d03','#346b27']);
  add('face','eyeShape',Object.keys(face.eyes)); add('face','eyeSize',grid(.5,1.5));
  add('face','browShape',Object.keys(face.brows)); add('face','mouthShape',Object.keys(face.mouths));
  add('face','lashes',category === 'M' ? ['none'] : category === 'F' ? ['short','long'] : Object.keys(face.lashStyles));
  for (const key of ['irisColor','browColor','lipColor']) add('face',key,['#731d03','#346b27']);
  add('groom','hairLength',Object.keys(grooming.lengths)); add('groom','hairTexture',Object.keys(grooming.textures));
  add('groom','hairFamily',Object.keys(grooming.families)); add('groom','hairCut',Object.values(grooming.cuts).flatMap(Object.keys));
  add('groom','hairColor',['#731d03','#346b27']);
  for (const part of grooming.facial) {
    add('groom',part+'Present',[false,true]); add('groom',part+'Size',grid(0,1)); add('groom',part+'Color',['#731d03','#346b27']);
  }
  return list;
}
function t3Sweeps() {
  const states = {};
  const replay = [];
  for (const category of ['M','F','T']) {
    states[category] = {};
    const active = {
      ...baseT3,
      finish:{chestHairDensity:.4,bellyHairDensity:.4,pubicHairDensity:.5,pubicHairShape:'rectangle'},
      groom:{hairLength:'long',moustachePresent:category !== 'F',beardPresent:category !== 'F',sideburnsPresent:category !== 'F'}
    };
    for (const [name,state] of Object.entries({neutral:baseT3,active})) {
      states[category][name] = Object.fromEntries(fields3(category).map(({group,key,values}) => {
        const rows = values.map(value => {
          try { return project3(createT3(category,t3Clone(state,group,key,value))); }
          catch (error) { return {value,error:error.message}; }
        });
        return [group + ':' + key, summary(values, rows, t3Views)];
      }));
    }
    for (let i = 0; i < 12; i++) {
      const body = createT3(category, {...active, morph:{headWidth:i%2 ? 1.125 : 1.7},
        shape:{headShape:i%2 ? 'oval' : 'rectangle'},face:{eyeSize:i%2 ? 1.2 : 1.8}}, 'persist-' + i);
      const serialized = t3.serializeBody(body), restored = t3.parseBody(serialized);
      assert.equal(t3.serializeBody(restored), serialized);
      assert.deepEqual(project3(body), project3(restored));
      assert.deepEqual(body.grooming, restored.grooming);
      replay.push({category,i,version:restored.version,corrections:restored.corrections.length+restored.faceCorrections.length});
    }
  }
  const v2 = t3.generateBody('oval-v2',profile.reference('T').biologicalProfile,{},{pelvisShape:'oval'});
  const migrated = t3.parseBody(t3.serializeBody(v2));
  assert.equal(migrated.geometryChoices.pelvisShape,'rectangle');
  const migration = {before:v2.geometryChoices, after:migrated.geometryChoices, version:migrated.version, trace:migrated.migration,
    sameProjected:hash(project3(v2)) === hash(project3(migrated))};
  const tProfile = profile.reference('T').biologicalProfile;
  const seeds = Array.from({length:4096}, (_, i) => 'bio-inv-t3-' + i);
  const skinCounts = Array(6).fill(0);
  for (const seed of seeds) skinCounts[Math.floor(profile.hash(seed,0)*6)]++;
  const generatedPairs = seeds.slice(0,32).map(seed => t3.generateBodyB2(seed,tProfile,{},{},{chestHairDensity:.5}));
  assert.equal(new Set(generatedPairs.map(body => hash(body.parameters))).size,1);
  assert.equal(new Set(generatedPairs.map(body => hash(body.skeleton))).size,1);
  const moustache = [];
  for (const headShape of Object.keys(face.heads)) {
    for (const eyeSize of [.5,1,1.5]) {
      for (const moustacheSize of [0,.25,.5,.75,1]) {
        const body = createT3('T', {...baseT3,shape:{headShape},face:{eyeSize},groom:{moustachePresent:true,moustacheSize}});
        if(body.grooming.constraints.length) moustache.push({headShape,eyeSize,moustacheSize,limits:body.grooming.constraints});
      }
    }
  }
  return {states, replay, migration, seed:{count:seeds.length,skinCounts,geometryReplay:generatedPairs.length},moustache};
}
// T1 draws with fillRect and primitive Canvas operations. Record the operations,
// with their properties, for geometry comparison independently of raster hashes.
function recorded(renderer, model, view) {
  const ops = [];
  const canvas = {getContext: () => new Proxy({}, {
    get: (_, key) => (...args) => ops.push([key,...args]),
    set: (_, key, value) => {ops.push([key,value]); return true;}
  })};
  renderer.render(canvas, model, view);
  return hash(ops);
}
function t1Generations() {
  const sample = 256, signedZeros = [];
  for (let i = 0; i < sample; i++) {
    const seed = 'bio-inv-t1-' + i;
    const a = V1.generate(seed), b = B2.generate(seed);
    const av = V1.parse(V1.serialize(a)), bv = B2.parse(B2.serialize(b));
    for (const [version, candidate] of [['T1',a],['B2',b]]) {
      const keys = Object.keys(candidate.params).filter(key => Object.is(candidate.params[key],-0));
      if (keys.length) signedZeros.push({seed,version,keys});
    }
    assert.equal(hash(V1.derive(a)),hash(V1.derive(av)));
    assert.equal(hash(B2.derive(b)),hash(B2.derive(bv)));
    assert.equal(hash(B2.baseline(b)),hash(a));
  }
  const base = B2.generate('bio-inv-b2');
  const state = p => B2.derive({...base,params:{...base.params,...p}});
  const a = state({hairPotential:.5, bodyHair:.8, beard:.4, hairSpread:.5});
  const b = state({hairPotential:.8, bodyHair:.5, beard:.25, hairSpread:.5});
  assert.deepEqual(a.zones,b.zones);
  const views=['front','profile','back','portrait'];
  const modelAxes = (module, renderer) => {
    const reference = module.generate('bio-inv-b2');
    return Object.fromEntries(module.schema.map(field => {
      const values = domain(field);
      const rows = values.map(value => {
        const d = module.derive({...reference,params:{...reference.params,[field.key]:value}});
        return Object.fromEntries(views.map(view => [view, recorded(renderer,d,view)]));
      });
      return [field.key,summary(values,rows,views)];
    }));
  };
  return {sample,signedZeros, t1Axes:modelAxes(V1,R1), b2Axes:modelAxes(B2,Rb2),
    shapeMarkers:{sameHairZones:a.zones, equalProducts:[.4,.2]}};
}

console.log(JSON.stringify({t1:t1Generations(), t2:t2Sweeps(), t3:t3Sweeps()},null,2));
