import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {choices, restoreSelection} from '../catalogue.mjs';
import {drawEyes, currentDraw, legacyDraw} from '../draw.mjs';
import {eyesFor, eyePresets} from '../eyes.mjs';
import {drawIris, heterochromias, intervalsOf, irisControls, irisDrawVersion, irisFor, irisMarkup,
  irisPalette, normalizeIris, pigmentCenters, pupilShapes, referenceRadius, solveIris} from '../iris.mjs';
import {character} from '../render.mjs';
import {contrast, luminance} from '../../bio-col-01/palette.mjs';
import {controls, presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const reference = '2da4ea2729abf233973781c7b57d30e609e0fae9';
async function frozen(file) {
  const source = execFileSync('git', ['-c', 'safe.directory=' + root, 'show', reference + ':bio-yeux-01/' + file],
    {cwd: root, encoding:'utf8'});
  const module = source.replace(/(from )'([^']+)'/g, (_, from, path) => from + JSON.stringify(new URL('../' + path, import.meta.url).href));
  return import('data:text/javascript;base64,' + Buffer.from(module).toString('base64'));
}

const scales = [{headOnly:true}, {}, {headOnly:true,smallScale:true}];
const openings = [null, ...Object.keys(eyePresets)];
const shapeIds = Object.keys(pupilShapes);
const colourIds = irisPalette.map(c=>c.id);
const extrema = bound => Object.fromEntries(Object.entries(controls).map(([key, range])=>[key,range[bound]]));
const morphs = {
  neutral:{}, tall:presets.tall.values, broad:presets.broad.values, ipad:priorityCase,
  min:extrema('min'), max:extrema('max'),
  narrow:{...extrema('min'),forehead_width:1.14,jowls:1.35},
  elongated:{...extrema('min'),forehead_width:1.14,jowls:1.35,skull_height:1.18}
};
const selection=restoreSelection({style:'p5-061',arrangement:'G',body:'bust',...morphs.tall,extra:['précision',2]});
const input=characterInput(selection);
const options={eyes:drawEyes(input,'archive-yeux',legacyDraw).values,form:'custom',
  draw:{seed:'archive-yeux',version:legacyDraw},colour:'bleu-vif',flat:true};
const hashCase = (key, scale) => ({...scale,instance:'recette-'+key.replace(':','-')});

test('T1 · 126 références × trois échelles × deux états et trois accès historiques', async () => {
  const {character:before}=await frozen('render.mjs');
  assert.equal(choices.length,126);
  for (const {style,arrangement,key} of choices) {
    const portrait={style,arrangement:arrangement==='U'?'G':arrangement,...morphs.broad};
    for (const scale of scales) for (const extra of [{}, {eyes:'round',hairColor:'bleu-vif',eyeEnvelopes:true}]) {
      const settings={...hashCase(key,scale),...extra};
      const expected=before(portrait,settings);
      for (const entry of [{},{iris:null},{iris:'historical'}]) {
        assert.equal(character(portrait,{...settings,...entry}),expected,key);
      }
    }
  }
});

test('T2 · silhouettes et codes validés, contour sombre déterministe, aplat fixe', () => {
  assert.deepEqual(irisPalette.map(c=>c.fill), [
    '#4c3226','#82532f','#9b864a','#c18b36','#748b58','#929da4','#638cae','#a2c9df',
    '#b73943','#df83b1','#9668bc','#40b9b5','#e8bb39','#d5dbe0','#ed873c','#f4f2e9'
  ]);
  assert.equal(new Set(colourIds).size,16);
  assert.equal(irisPalette.filter(c=>c.family==='natural').length,8);
  const contrasts=irisPalette.map(c=>{
    assert(luminance(c.outline)<luminance(c.fill),c.id);
    return contrast(c.fill,c.outline);
  });
  assert(Math.min(...contrasts)>=1.2);
  const aperture=eyesFor({},null), center=pigmentCenters(aperture)[0];
  const signatures=shapeIds.map(pupilShape=>{
    const result=solveIris(aperture,{pupilShape});
    const markup=irisMarkup(result,center,0);
    assert.doesNotMatch(markup, /gradient|image|pattern|animate|filter/i);
    return markup.match(/data-pupil-shape="[^"]+">(.+?)<\/g>/)[1];
  });
  assert.equal(new Set(signatures).size,6);
  assert.match(signatures.at(-1),/fill-rule="evenodd"/);
  console.log('T2 '+JSON.stringify({colours:16,shapes:6,minimumContourContrast:Math.min(...contrasts)}));
});

test('T3 · balayage des cinq axes, réductions utiles et intervalle disjoint', () => {
  for (const [axis,{min,max,step}] of Object.entries(irisControls)) {
    for (let i=0;i<=Math.round((max-min)/step);i++) {
      const point=+(min+i*step).toFixed(2);
      const result=irisFor({},null,{[axis]:point,heterochromia:'central',pupilShape:'ring'},true);
      assert.equal(result.requested[axis],point);
      if (axis!=='secondarySize') assert.equal(result.effective[axis],point);
      assert(result.geometry.pupil<=Math.min(result.geometry.innerRx,result.geometry.innerRy)+1e-12);
    }
  }
  const ring=irisFor({},null,{heterochromia:'central',pupilShape:'ring'},true);
  assert.deepEqual(intervalsOf(ring.domains.secondarySize,1),[[0,25],[46,80]]);
  const plateau=irisFor({},null,{heterochromia:'central',pupilShape:'ring',secondarySize:32},true);
  assert.equal(plateau.requested.secondarySize,32);
  assert.equal(plateau.effective.secondarySize,25);
  const tight=irisFor({},null,{irisRatio:.75,outline:10,pupilSize:80},true);
  assert.equal(tight.requested.pupilSize,80);
  assert.equal(tight.effective.pupilSize,100*Math.sqrt(.75)-10);
  assert.equal(tight.domains.pupilSize.at(-1),76);
  const round=irisFor({},null,{irisRatio:1,outline:10,pupilSize:80},true);
  assert.deepEqual(intervalsOf(round.domains.irisRatio,.01),[[.81,1.23]]);
  console.log('T3 '+JSON.stringify({ring:intervalsOf(ring.domains.secondarySize,1),tight:tight.effective.pupilSize}));
});

test('T4 · conservation de la surface, des ouvertures et des centres historiques', async () => {
  const {character:before}=await frozen('render.mjs');
  let corners=0, catalog=0;
  for (const morph of Object.values(morphs)) for (const eyes of openings) {
    const opening=eyesFor(morph,eyes);
    for (const irisSize of [60,140]) for (const irisRatio of [.75,1.25])
      for (const pupilSize of [15,80]) for (const outline of [0,10]) for (const pupilShape of shapeIds) {
        const {geometry}=solveIris(opening,{irisSize,irisRatio,pupilSize,outline,pupilShape});
        const {rx,ry,innerRx,innerRy,pupil}=geometry;
        assert(Math.abs(rx*ry-(referenceRadius*irisSize/100)**2)<1e-12);
        assert(Math.abs(rx/ry-irisRatio)<1e-12);
        assert(pupil<=Math.min(innerRx,innerRy)+1e-12);
        corners++;
      }
  }
  const historicalPairs=/<ellipse ([^>]+)\/><ellipse ([^>]+rx="1.9" ry="2.2"[^>]*)\/>/g;
  const customInk=/<g data-bio-iris="(left|right)"[^>]*><ellipse cx="([^"]+)" cy="([^"]+)" [^>]+\/>(?:<ellipse [^>]+\/>)*<g data-pupil-shape="[^"]+">.*?<\/g><ellipse [^>]+\/><\/g>/g;
  for (const {style,arrangement} of choices) for (const eyes of openings) {
    const portrait={style,arrangement:arrangement==='U'?'G':arrangement,...morphs.ipad};
    const plain=before(portrait,{eyes});
    const historical=before(portrait,{});
    const pairs=[...historical.matchAll(historicalPairs)];
    assert.equal(pairs.length,2);
    const advanced=character(portrait,{eyes,iris:{irisSize:140,irisRatio:.75,pupilSize:80,outline:10}});
    const inks=[...advanced.matchAll(customInk)];
    assert.equal(inks.length,2);
    for (const [i,ink] of inks.entries()) {
      const {1:x,2:y}=pairs[i][2].match(/cx="([^"]+)" cy="([^"]+)"/);
      assert.deepEqual(ink.slice(2),[x,y]);
    }
    let i=0;
    let restored=advanced.replace(customInk,()=>'<ellipse '+pairs[i++][2]+'/>');
    if (eyes===null) restored=restored.replace(/<defs><clipPath[^>]+><ellipse [^>]+\/><\/clipPath><\/defs><g clip-path="[^"]+">(<ellipse [^>]+\/>)<\/g>/g,'$1');
    assert.equal(restored,plain,style+' · '+eyes);
    catalog++;
  }
  console.log('T4 '+JSON.stringify({corners,catalog}));
});

test('T5 · hétérochromie à droite, zone concentrique bilatérale et réglages latents', () => {
  const settings={primary:'ambre',secondary:'violet'};
  const render=iris=>character({},{iris:{...settings,...iris}});
  const complete=render({heterochromia:'complete'});
  assert.match(complete,/data-bio-iris="left" data-iris-colour="ambre"/);
  assert.match(complete,/data-bio-iris="right" data-iris-colour="violet"/);
  assert.doesNotMatch(complete,/data-iris-secondary/);
  const central=render({heterochromia:'central'});
  const rings=[...central.matchAll(/data-iris-secondary=""><ellipse cx="([^"]+)" cy="([^"]+)" [^>]+fill="#9668bc"/g)];
  assert.equal(rings.length,2);
  const centers=pigmentCenters(eyesFor({},null));
  assert.deepEqual(rings.map(m=>m.slice(1).map(Number)),centers.map(c=>[c.x,c.y]));
  assert.equal(render({heterochromia:'complete',secondary:'ambre'}),render({}));
  assert.equal(render({heterochromia:'central',secondary:'ambre'}),render({}));
  assert.equal(render({heterochromia:'central',pupilSize:80,secondarySize:50}),render({pupilSize:80}));
  const hidden=irisFor({},null,{...settings,heterochromia:'central',pupilSize:80,secondarySize:50},true);
  assert.deepEqual(hidden.domains.secondarySize,[0]);
  assert.equal(hidden.requested.secondarySize,50);
  assert.equal(hidden.requested.secondary,'violet');
  const restored=irisFor({},null,{...hidden.requested,pupilShape:'ring'},true);
  assert.equal(restored.effective.secondarySize,45);
  assert.equal(restored.effective.secondary,'violet');
});

test('T6 · archives v1 intactes, v2 exactes à froid, graines et pigments latents', async () => {
  const {appearanceDocument:oldArchive}=await frozen('appearance.mjs');
  const legacy=oldArchive(selection,options);
  assert.deepEqual(appearanceDocument(selection,options),legacy);
  const old=parseAppearance(JSON.stringify(legacy));
  assert.deepEqual(appearanceDocument(old.selection,old),legacy);
  assert.deepEqual(drawEyes(input,old.draw.seed,old.draw.version).values,old.eyes);
  const custom={irisRatio:.7501,irisSize:119.333,pupilSize:80,outline:9.777,
    pupilShape:'star',primary:'argent',secondary:'vert',heterochromia:'central',secondarySize:63.125};
  const irisDraw={seed:'grain ✦',version:irisDrawVersion};
  for (const data of [{iris:custom},{iris:drawIris(input,options.eyes,irisDraw.seed),irisDraw},
    {iris:null,irisLatent:custom},{iris:null,irisLatent:drawIris(input,options.eyes,irisDraw.seed),irisDraw}]) {
    const archive=appearanceDocument(selection,{...options,...data});
    assert.equal(archive.version,2);
    const restored=parseAppearance(JSON.stringify(archive));
    assert.deepEqual(appearanceDocument(restored.selection,restored),archive);
    for (const scale of scales) {
      const render=(p,settings)=>character(p,{...scale,eyes:settings.eyes,hairColor:settings.colour,
        iris:settings.iris,instance:'archive'});
      assert.equal(render(characterInput(restored.selection),restored),render(input,{...options,...data}));
    }
    if (data.irisDraw) assert.deepEqual(drawIris(input,restored.eyes,restored.irisDraw.seed),data.iris??data.irisLatent);
    if (data.iris===custom) {
      assert.equal(archive.iris.requested.irisSize,119.333);
      assert.equal(archive.iris.effective.pupilSize,100*Math.sqrt(custom.irisRatio)-custom.outline);
      const altered=structuredClone(archive);
      altered.iris.effective.pupilSize=+altered.iris.effective.pupilSize.toFixed(2);
      assert.throws(()=>parseAppearance(JSON.stringify(altered)),/incompatibles/i);
    }
  }
  assert.equal(appearanceDocument(selection,{...options,draw:{seed:'un',version:currentDraw}}).version,1);
});

test('T7 · 6 144 graines répétées sur trois ouvertures et distributions admissibles', () => {
  const seeds=2048;
  for (const [name, portrait, eyes] of [['ancien',{},null],['haut',morphs.tall,'round'],['étroit',morphs.narrow,'narrow']]) {
    const modes=Object.fromEntries(Object.keys(heterochromias).map(key=>[key,0]));
    const shapes=Object.fromEntries(shapeIds.map(key=>[key,0]));
    const colours=Object.fromEntries(colourIds.map(key=>[key,0]));
    const ends={irisSize:0,irisRatio:0,pupilSize:0,outline:0,secondarySize:0};
    const totals={pupil:0,central:0};
    for (let i=0;i<seeds;i++) {
      const seed='bio-yeux-02-'+name+'-'+i;
      const values=drawIris(portrait,eyes,seed);
      assert.deepEqual(drawIris(portrait,eyes,seed),values);
      const result=irisFor(portrait,eyes,values,true);
      assert.deepEqual(result.effective,normalizeIris(values),seed);
      modes[values.heterochromia]++;
      shapes[values.pupilShape]++;
      colours[values.primary]++;
      for (const [key,domain] of Object.entries(result.domains)) {
        if (key==='secondarySize'&&values.heterochromia!=='central') continue;
        const selectable=key==='secondarySize'?domain.slice(1):domain;
        if (values[key]===selectable.at(-1)) ends[key]++;
        if (key==='pupilSize') totals.pupil+=1/selectable.length;
        if (key==='secondarySize') totals.central+=1/selectable.length;
      }
    }
    for (const counts of [modes,shapes,colours]) {
      const values=Object.values(counts);
      assert(values.every(n=>Math.abs(n/seeds-1/values.length)<.05),JSON.stringify(counts));
    }
    for (const [key,domain] of [['irisSize',81],['irisRatio',51],['outline',11]]) {
      assert(Math.abs(ends[key]/seeds-1/domain)<.035,key);
    }
    assert(Math.abs(ends.pupilSize-totals.pupil)<5*Math.sqrt(totals.pupil));
    assert(Math.abs(ends.secondarySize-totals.central)<5*Math.sqrt(totals.central));
    console.log('T7 '+JSON.stringify({name,seeds,modes,shapes,colours,ends,
      expectedPupilMaximum:+totals.pupil.toFixed(2),expectedCentralMaximum:+totals.central.toFixed(2)}));
  }
});
