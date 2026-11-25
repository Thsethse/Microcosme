import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {test} from 'node:test';
import {bodies, model, presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {beardPresets} from '../beard.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {eyePresets, eyesFor} from '../eyes.mjs';
import {
  drawMakeup, hasMakeup, inactiveFields, makeupDocument, makeupPalette, normalizeMakeup, paintShapes, parseMakeup
} from '../makeup.mjs';
import {makeupFor, solveMakeup} from '../makeup-render.mjs';
import {character} from '../render.mjs';

const scales = [{headOnly:true}, {}, {headOnly:true,smallScale:true}];
const neutral = {style:'p5-038', arrangement:'G'};
const choice = restoreSelection(neutral);
const settings = {eyes:'almond', form:'almond', colour:'chatain-clair', flat:false};
const inherited = {eyes:'almond', iris:{}, details:{}, brows:{}, mouth:{}, nose:{}, beard:beardPresets.full.values,
  marks:[{id:'m1',type:'mole'}], scars:[{id:'s1'}]};
const sample = drawMakeup('Microcosme maquillage');
const withoutLayer = svg => svg.replace(/<g data-bio-makeup=""[\s\S]*?(?=<g data-bio-facial-hair=)/, '');
const layer = (family, values = {}) => ({[family]:{enabled:true,...values}});

test('T1 · l’historique et les archives v1 à v9 restent identiques', async () => {
  const git = (file, ref = 'a267b5c') =>
    execFileSync('git', ['show', ref + ':bio-yeux-01/' + file], {encoding:'utf8'});
  // Load the archived renderer with its inherited dependencies at their
  // original absolute paths so the result is checked against actual R1 code.
  const scratch = mkdtempSync(resolve(tmpdir(), 'bio-maquillage-reference-'));
  const from = new URL('../', import.meta.url);
  const archived = code => code.replace(/from '(\.[^']+)'/g, (_, url) => "from '" + new URL(url, from).href + "'");
  try {
    for (const file of ['render.mjs','appearance.mjs']) writeFileSync(resolve(scratch,file), archived(git(file)));
    const {character: before} = await import(pathToFileURL(resolve(scratch,'render.mjs')));
    const {appearanceDocument: beforeDocument} = await import(pathToFileURL(resolve(scratch,'appearance.mjs')));
    for (const morph of [neutral, {...neutral, ...presets.tall.values, body:'slim'}, {...neutral, ...presets.broad.values}]) {
      for (const scale of scales) {
        for (const options of [{}, inherited]) {
          assert.equal(character(morph, {...scale,...options}), before(morph, {...scale,...options}));
          assert.equal(character(morph, {...scale,...options,makeup:{}}), before(morph, {...scale,...options}));
        }
      }
    }
    const changes = [{},{iris:{}},{details:{}},{brows:{}},{mouth:{}},{nose:{}},{beard:{}},
      {marks:inherited.marks},{scars:inherited.scars}];
    for (const [index, change] of changes.entries()) {
      const args = {...settings,...change};
      const archive = beforeDocument(choice,args);
      assert.equal(archive.version, index + 1);
      assert.deepEqual(appearanceDocument(choice, parseAppearance(JSON.stringify(archive))), archive);
    }
  } finally {
    rmSync(scratch,{recursive:true,force:true});
  }
});

test('T2 · pigment et contour restent dans les deux lèvres, avec la séparation héritée', () => {
  const makeup = layer('lips',{colour:'#a52f47',edge:80,edgeColour:'#79243e',coverage:90});
  for (const mouth of [null, {}, {upper:170,lower:130,width:92}]) {
    const fit = makeupFor(neutral,'almond',makeup,{mouth});
    const {paths, separator} = fit.geometry.lips;
    assert.equal(paths.length,2);
    assert.match(separator, /fill="black"|stroke="black"/);
    const svg = character(neutral,{eyes:'almond',mouth,makeup});
    assert.match(svg,/clip-path="url\(#bio-makeup-.*-lips\)"/);
    assert.match(svg,/#a52f47/);
    assert.match(svg,/#79243e/);
    assert.equal(character(neutral,{mouth,makeup:layer('lips',{intensity:0})}), character(neutral,{mouth}));
    assert.notEqual(character(neutral,{mouth,makeup}), character(neutral,{mouth,makeup:layer('lips',{...makeup.lips,coverage:35})}));
  }
});

test('T3 · les paupières suivent toutes les ouvertures et la pointe respecte le cadre', () => {
  const makeup = {
    ...layer('shadow',{accent:'#4d9eab',extent:87,height:79,outer:91}),
    ...layer('liner',{top:83,bottom:75,wing:90,slant:42})
  };
  for (const open of [null,...Object.keys(eyePresets)]) {
    const fit = makeupFor(neutral,open,makeup);
    const [left,right] = fit.geometry.eyes;
    assert(left.eyelid.some(({y,top})=>y>top));
    assert(right.eyelid.some(({y,top})=>y>top));
    assert(left.wing[2][0] < left.wing[0][0]);
    assert(right.wing[2][0] > right.wing[0][0]);
    assert(left.wing[2][1] < left.wing[0][1]);
    const svg = character(neutral, {eyes:open,details:{},brows:{},makeup});
    assert.match(svg,/data-lash-count=/);
    assert.match(svg,/data-brow-side=/);
    assert.match(svg,/data-makeup-family="shadow"/);
    assert.match(svg,/data-makeup-family="liner"/);
  }
});

test('T4 · la diffusion, l’étendue et les deux positions des joues changent indépendamment', () => {
  const base = layer('blush',{});
  const original = character(neutral,{makeup:base});
  assert.match(original, /<radialGradient[^>]+-cheek/);
  assert.match(original, /offset="1"[^>]*stop-opacity="0"/);
  for (const key of ['diffusion','extent','x','y','intensity']) {
    const changed = character(neutral,{makeup:layer('blush',{[key]:100})});
    assert.notEqual(original,changed,key);
  }
  const fit = makeupFor(neutral,null,base).effective.blush;
  assert(fit.positions[0][0] < model(neutral).base.head.cx && fit.positions[1][0] > model(neutral).base.head.cx);
});

test('T5 · douze primitives, superposition ordonnée, miroir et forme asymétrique', () => {
  const elements = Object.keys(paintShapes).map((shape,i) =>
    ({shape,mirror:i%2===0,x:27,y:65,size:43,stretch:62,rotation:16,weight:60}));
  const makeup = layer('paint',{elements});
  const svg = character(neutral,{makeup});
  assert.deepEqual([...svg.matchAll(/data-makeup-shape="([^"]+)"/g)].map(match=>match[1]),Object.keys(paintShapes));
  assert.equal((svg.match(/data-makeup-mirror="true"/g)??[]).length,6);
  const fit = makeupFor(neutral,null,makeup);
  for (const [i,item] of fit.effective.paint.entries()) {
    assert.equal(item.mirror,i%2===0);
    if (item.mirror) {
      const [a,b] = item.transforms;
      assert.equal(a[1],b[1]);
      assert(a[0]<b[0]);
      assert.equal(b[2],-1);
    }
  }
  assert.notEqual(svg,character(neutral,{makeup:layer('paint',{elements:elements.toReversed()})}));
});

test('T6 · les 32 teintes exactes sont communes aux cinq familles', () => {
  const exact = '#e7c5a9 #c89a7c #ae785e #85543d #684331 #493026 #c88e80 #ad7467 #edb3ba #d78399 #cf526f #a52f47 #79243e #a83d30 #db7452 #733447 #e0b43f #dc8437 #829e4d #397e62 #4d9eab #3f649b #79549e #ac65b2 #fff8e9 #e5e2d9 #b7b8bd #85858e #53545e #28272d #151519 #b38b4f'.split(' ');
  assert.deepEqual(makeupPalette.flatMap(([, colours])=>colours),exact);
  for (const colour of exact) {
    const parameters = normalizeMakeup({...layer('lips',{colour,edge:48,edgeColour:colour}),
      ...layer('shadow',{colour,accent:colour}),...layer('liner',{colour}),...layer('blush',{colour}),
      ...layer('paint',{elements:[{shape:'star',colour}]})});
    const svg = character(neutral,{makeup:parameters});
    assert.equal((svg.match(/data-makeup-family=/g)??[]).length,5);
    assert(svg.includes(colour));
    assert.doesNotMatch(svg,/specular|lighting|metallic/i);
  }
});

test('T7 · couche indépendante, réserves et paramètres latents', () => {
  const one = character(neutral,inherited), two = character(neutral,{...inherited,makeup:sample});
  assert.equal(withoutLayer(two),one);
  assert(two.indexOf('data-bio-scars') < two.indexOf('data-bio-makeup'));
  assert(two.indexOf('data-bio-makeup') < two.indexOf('data-bio-facial-hair'));
  assert(two.indexOf('data-bio-makeup') < two.indexOf('data-layer="front"'));
  assert.match(two, /<ellipse data-nose-region="nostrils"[^>]*fill="black"/);
  const zero = normalizeMakeup({
    ...layer('lips',{intensity:0}), ...layer('shadow',{intensity:0}), ...layer('liner',{intensity:0}),
    ...layer('blush',{intensity:0}), ...layer('paint',{elements:[{shape:'wave',intensity:0}]})
  });
  assert.equal(hasMakeup(zero),false);
  assert.equal(character(neutral,{...inherited,makeup:zero}),one);
  assert(inactiveFields('liner',{intensity:50,wing:0}).includes('slant'));
  assert(inactiveFields('paint',{intensity:100,shape:'point'}).includes('stretch'));
  assert(!inactiveFields('paint',{intensity:100,shape:'ring',stretch:50}).includes('rotation'));
  assert.throws(()=>normalizeMakeup(layer('liner',{slant:46})),RangeError);
});

test('T8 · archives froides, composition transférable, plusieurs graines et persistance latente', () => {
  const args = {...settings,...inherited,makeup:sample};
  const appearance = appearanceDocument(choice,args);
  assert.equal(appearance.version,10);
  assert(appearance.scars);
  const data = parseAppearance(JSON.stringify(appearance));
  assert.deepEqual(appearanceDocument(data.selection,data),appearance);
  const hidden = appearanceDocument(choice,{...args,makeup:null,makeupLatent:sample});
  const parsed = parseAppearance(JSON.stringify(hidden));
  assert.deepEqual(parsed.makeupLatent,sample);
  assert.deepEqual(appearanceDocument(parsed.selection,parsed),hidden);
  const target = restoreSelection({...neutral,...presets.broad.values,body:'slim'});
  const transferred = parseMakeup(JSON.stringify(makeupDocument(sample)));
  const received = appearanceDocument(target,{...settings,makeup:transferred});
  assert.deepEqual(received.makeup.requested,appearance.makeup.requested);
  assert.notDeepEqual(received.makeup.effective,appearance.makeup.effective);
  const characterOnly = document => [document.character,document.eyes,document.palette,document.historicalSelection];
  assert.deepEqual(characterOnly(received), characterOnly(appearanceDocument(target,settings)));
  assert.deepEqual(drawMakeup('Microcosme maquillage'),sample);
  assert.notDeepEqual(drawMakeup('Autre graine'),sample);
  assert.equal(character(characterInput(data.selection),data),character(characterInput(choice),args));
  assert.throws(()=>parseMakeup('{"schema":"microcosme.makeup","version":2,"makeup":{}}'),/version 1/);
});

test('T9 · les trois catégories, six corps et les extrêmes morphologiques rendent aux trois échelles', () => {
  let checked = 0;
  for (const body of Object.keys(bodies)) {
    for (const beardCategory of ['H','F','T']) {
      for (const morph of [{},presets.tall.values,presets.broad.values]) {
        for (const scale of scales) {
          const svg = character({...neutral,...morph,body},{...scale,beardCategory,makeup:sample});
          assert.equal((svg.match(/data-makeup-family=/g)??[]).length,5);
          checked++;
        }
      }
    }
  }
  assert.equal(checked,162);

  const face = model(neutral), opening = eyesFor(neutral,'almond');
  const adult = solveMakeup(face,opening,sample).effective;
  for (const age of ['child','elder']) {
    const aged = structuredClone(face);
    aged.base.parameters.age = age;
    assert.deepEqual(solveMakeup(aged,opening,sample).effective,adult);
  }
});
