import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {adultBodies, adultBodyGeometry, adultBodyMarkup} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {referenceStructure, structureControls, validateStructure} from '../body-structure.mjs';
import {exportSelection, restoreSelection} from '../catalogue.mjs';
import {character} from '../render.mjs';
import {controls, model, presets} from '../../preview/bio-vis-p5-i6/model.mjs';

const axes = Object.entries(structureControls);
const profiles = Object.keys(adultBodies);
const scales = [{headOnly:true}, {}, {headOnly:true,smallScale:true}];
const appearance = {eyes:'almond', form:'almond', colour:'chatain-clair', flat:true};
const raw = {style:'p5-061', arrangement:'G', body:'bust', accessories:true};
const storedAxes = {...referenceStructure, neck:124, shoulders:72, waist:80, pelvis:127, base:73};
const corners = Array.from({length:2**axes.length}, (_, bits) =>
  Object.fromEntries(axes.map(([key, range], i) => [key, range[bits & (1<<i) ? 'max' : 'min']])));
const limits = side => Object.fromEntries(Object.entries(controls).map(([key, domain]) => [key, domain[side]]));
const faces = [{}, limits('min'), limits('max'), presets.tall.values, presets.broad.values].map(
  values => model({...raw,...values}).anchors.chin
);
const layer = /<g class="body-shape"[^>]*>[^]*?<\/g>/;
const savedRenderer = '7c756a9dab6b1fa21779cd247c5494c80a5e094c';

function pathPoints(path) {
  return [...path.matchAll(/[MC]([^MCZ]+)/g)].map(([, line]) =>
    line.trim().split(' ').map(pair => pair.split(',').map(Number)));
}

const vertical = ({levels,ground,height}) => ({
  levels: levels.map(({y}) => y), ground, height, baseRatio:(ground.y-levels.at(-1).y)/height
});

test('les deux bases à 100 % reproduisent le calque SVG BIO-CORPS-01 à l’octet', async () => {
  const source = execFileSync('git',['show',savedRenderer + ':bio-yeux-01/adult-body.mjs'],
    {cwd:new URL('../..',import.meta.url)});
  const inherited = await import('data:text/javascript;base64,' + source.toString('base64'));
  const palette = {skin:'#dbbf88', contour:'#c2a873'};
  for (const body of profiles) for (const chin of faces) {
    const old = inherited.adultBodyMarkup(body,chin,palette);
    assert.equal(adultBodyMarkup(body,chin,palette,referenceStructure),old);
    assert.equal(adultBodyMarkup(body,chin,palette),old);
  }
});

test('les 128 coins H/F et des profils intérieurs gardent les hauteurs et les raccords', () => {
  let seed = 0xc0a502;
  const random = () => ((seed = (Math.imul(1664525,seed) + 1013904223) >>> 0) / 2**32);
  const samples = Array.from({length:256}, () =>
    Object.fromEntries(axes.map(([key,{min,max}]) => [key, min + Math.floor(random()*(max-min+1))])));
  for (const body of profiles) for (const chin of faces) {
    const baseline = adultBodyGeometry(body, chin);
    const baseCurve = pathPoints(baseline.path).flat().map(([,y]) => y);
    for (const structure of [...corners,...samples]) {
      const shape = adultBodyGeometry(body,chin,structure);
      assert.deepEqual(vertical(shape),vertical(baseline));
      const [[top],...curves] = pathPoints(shape.path);
      assert.deepEqual([top,...curves.flat()].map(([,y]) => y),baseCurve);
      assert.deepEqual(curves[7][2],[shape.ground.x,shape.ground.y]);
      assert.deepEqual(curves[16][2],top);
      const right = [top,...curves.slice(0,8).flat()];
      const left = curves.slice(8,16).flat();
      assert.deepEqual(left,right.slice().reverse().slice(1).map(([x,y]) =>
        [Number((2*shape.ground.x-x).toFixed(3)),y]));
      assert(right.slice(0,-1).every(([x]) => x > shape.ground.x && x+2.1 < 200));
      assert(right.every(([,y],i) => !i || y >= right[i-1][1]));

      for (let i=0; i<curves.length; i++) {
        const [,[u,v],[x,y]] = curves[i];
        const [a,b] = curves[(i+1)%curves.length][0];
        const dx=x-u, dy=y-v, nextX=a-x, nextY=b-y;
        assert(dx*nextX+dy*nextY>0);
        assert(Math.abs(dx*nextY-dy*nextX)/(Math.hypot(dx,dy)*Math.hypot(nextX,nextY)) < .003);
      }
    }
  }
});

test('chaque largeur a son repère propre et chaque cran change la géométrie', () => {
  const owners = {neck:0, shoulders:1, thorax:2, waist:3, pelvis:5};
  for (const body of profiles) {
    const chin = faces[0], base = adultBodyGeometry(body,chin);
    const owned = (geometry, key) => key === 'base'
      ? pathPoints(geometry.path)[7][2][0] - geometry.ground.x
      : geometry.levels[owners[key]].width;
    const signatures = new Set();
    for (const [key,{min,max}] of axes) {
      let previous = -1;
      const paths = new Set();
      for (let value=min; value<=max; value++) {
        const geometry = adultBodyGeometry(body,chin,{...referenceStructure,[key]:value});
        assert(owned(geometry,key)>previous);
        previous=owned(geometry,key);
        assert(Math.abs(owned(geometry,key)-owned(base,key)*value/100) < .001);
        for (const [other] of axes) if (other!==key) assert.equal(owned(geometry,other),owned(base,other));
        paths.add(geometry.path);
      }
      assert.equal(paths.size, max-min+1);
      signatures.add(adultBodyGeometry(body,chin,{...referenceStructure,[key]:max}).path);
    }
    assert.equal(signatures.size,6);
  }
});

test('le SVG hors ossature et les corps historiques restent inchangés', () => {
  const full = {
    naturalEyes:true, instance:'ossature', eyes:'almond', iris:{}, details:{lashes:{count:3}},
    brows:{}, mouth:{}, nose:{}, marks:[{id:'m1', type:'mole'}], scars:[{id:'s1'}],
    makeup:{liner:{enabled:true}}
  };
  for (const style of ['p5-038', 'p5-061', 'waist_waves', 'shaved']) for (const scale of scales) {
    const opts = {...full,...scale};
    const old = character({...raw,style},opts);
    assert.equal(character({...raw,style,structure:storedAxes},opts),old);
    for (const body of profiles) {
      const neutral = character({...raw,style,body},opts);
      const modified = character({...raw,style,body,structure:storedAxes},opts);
      assert.notEqual(modified,neutral);
      assert.equal(modified.replace(layer,''),neutral.replace(layer,''));
    }
  }
});

test('archives v11 et v12 exactes, six valeurs explicites et champs bruts inertes', () => {
  const keep = {...raw,structure:storedAxes, neck:72, width:83};
  const oldSelection = restoreSelection(keep);
  assert.equal(oldSelection.state.structure,undefined);
  assert.deepEqual(JSON.parse(exportSelection(oldSelection)),keep);
  for (const body of profiles) {
    const original = appearanceDocument(restoreSelection(keep,body),appearance);
    assert.equal(original.version,11);
    assert.equal(original.character.structure,undefined);
    const restoredOld = parseAppearance(JSON.stringify(original));
    assert.equal(restoredOld.selection.state.structure,undefined);
    assert.deepEqual(appearanceDocument(restoredOld.selection,restoredOld),original);

    for (const structure of [referenceStructure,storedAxes,corners[0],corners.at(-1)]) {
      const selection = restoreSelection(keep,body,structure);
      const document = appearanceDocument(selection,appearance);
      assert.equal(document.version,12);
      assert.equal(document.renderer,'bio-corps-02-svg@1');
      assert.deepEqual(document.character.structure,structure);
      assert.deepEqual(document.historicalSelection,keep);
      const restored = parseAppearance(JSON.stringify(document));
      assert.deepEqual(appearanceDocument(restored.selection,restored),document);
      for (const scale of scales) assert.equal(character(characterInput(restored.selection),scale),
        character(characterInput(selection),scale));
    }
  }
  for (const invalid of [null, {}, {...referenceStructure, neck:69}, {...referenceStructure, waist:126},
    {...referenceStructure, base:100.5}, {...referenceStructure, thorax:'100'}, {...referenceStructure, elongation:100}]) {
    assert.throws(() => validateStructure(invalid),/largeurs|pourcentage/);
    const document = appearanceDocument(restoreSelection(raw,'adult-h',storedAxes),appearance);
    document.character.structure = invalid;
    assert.throws(() => parseAppearance(JSON.stringify(document)),/largeurs|pourcentage/);
  }
});
