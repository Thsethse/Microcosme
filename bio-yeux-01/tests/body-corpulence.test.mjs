import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {adultBodies, adultBodyGeometry, adultBodyMarkup} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {corpulenceCoefficients, corpulenceResponse, corpulenceStops, referenceCorpulence, validateCorpulence} from '../body-corpulence.mjs';
import {referenceStructure, structureControls} from '../body-structure.mjs';
import {beardPresets} from '../beard.mjs';
import {exportSelection, restoreSelection} from '../catalogue.mjs';
import {character} from '../render.mjs';
import {controls, model, presets} from '../../preview/bio-vis-p5-i6/model.mjs';

const profiles = Object.keys(adultBodies);
const scales = [{headOnly:true}, {}, {headOnly:true,smallScale:true}];
const raw = {style:'p5-061', arrangement:'G', body:'bust', accessories:true};
const savedAxes = {neck:72, shoulders:129, thorax:82, waist:121, pelvis:73, base:123};
const axes = Object.entries(structureControls);
const corners = Array.from({length:2**axes.length}, (_, bits) =>
  Object.fromEntries(axes.map(([key, range], i) => [key, range[bits & (1<<i) ? 'max' : 'min']])));
const faceLimit = side => Object.fromEntries(Object.entries(controls).map(([key, domain]) => [key, domain[side]]));
const faces = [{},faceLimit('min'),faceLimit('max'),presets.tall.values,presets.broad.values];
const chins = faces.map(face => model({...raw,...face}).anchors.chin);
const layer = /<g class="body-shape"[^>]*>[^]*?<\/g>/;
const skin = {skin:'#dbbf88', contour:'#c2a873'};

function pathPoints(path) {
  return [...path.matchAll(/[MC]([^MCZ]+)/g)].map(([, line]) =>
    line.trim().split(' ').map(pair => pair.split(',').map(Number)));
}
const right = path => pathPoints(path).slice(0,9).flat();
const vertical = ({levels,ground,height}) => ({
  levels:levels.map(({y})=>y), ground, height, baseRatio:(ground.y-levels.at(-1).y)/height
});

test('50 % reprend BIO-CORPS-02 à l’octet pour les deux bases et toutes les ossatures du balayage', async () => {
  const source = execFileSync('git', ['show','c6906c120c78cea8438f3713753be46e9a26ed70:bio-yeux-01/adult-body.mjs'],
    {cwd:new URL('../..',import.meta.url)}).toString();
  const url = new URL('../body-structure.mjs',import.meta.url);
  const inherited = await import('data:text/javascript;base64,' +
    Buffer.from(source.replace("'./body-structure.mjs'", JSON.stringify(url.href))).toString('base64'));
  for (const body of profiles) for (const chin of chins) for (const structure of [...corners,savedAxes,referenceStructure]) {
    const previous = inherited.adultBodyMarkup(body,chin,skin,structure);
    assert.equal(adultBodyMarkup(body,chin,skin,structure,referenceCorpulence),previous);
    assert.equal(adultBodyMarkup(body,chin,skin,structure),previous);
  }
});

test('les neuf repères et les intermédiaires suivent une réponse continue et monotone', () => {
  assert.deepEqual(corpulenceStops.map(({value})=>value),[0,12.5,25,37.5,50,62.5,75,87.5,100]);
  assert.equal(corpulenceResponse(50),0);
  assert.equal(corpulenceResponse(0),-.56);
  assert.equal(corpulenceResponse(100),1);
  for (let i=0; i<1000; i++) {
    assert(corpulenceResponse(i/10)<corpulenceResponse((i+1)/10));
  }
  for (const body of profiles) {
    const coefficients = corpulenceCoefficients[body];
    assert.equal(coefficients.neck,coefficients.shoulders);
    assert(coefficients.neck<coefficients.thorax && coefficients.thorax<coefficients.waist);
    assert.equal(coefficients.thorax,coefficients.base);
    assert(body==='adult-h' ? coefficients.abdomen>coefficients.hips : coefficients.hips>coefficients.abdomen);
    for (const structure of [referenceStructure,savedAxes,corners[0],corners.at(-1)]) {
      const steps = Array.from({length:201}, (_, i) => adultBodyGeometry(body,chins[0],structure,i/2));
      const paths = new Set(steps.map(({path})=>path));
      assert.equal(paths.size,201);
      const landmarkWidths = steps.map(({levels})=>levels.map(({width})=>width));
      for (let i=1; i<steps.length; i++) {
        assert(landmarkWidths[i].every((width,index)=>width>landmarkWidths[i-1][index]));
      }
    }
  }
});

test('aux 128 coins et sur les bases intermédiaires, les courbes restent jointes et le point d’appui est stable', () => {
  let checks=0,seed=0x303f;
  const random = () => ((seed=(Math.imul(1664525,seed)+1013904223)>>>0)/2**32);
  const samples = Array.from({length:32}, () =>
    Object.fromEntries(axes.map(([key,{min,max}])=>[key,min+Math.floor(random()*(max-min+1))])));
  for (const body of profiles) for (const chin of chins) for (const structure of [...corners,...samples]) {
    const reference = adultBodyGeometry(body,chin,structure);
    const y = pathPoints(reference.path).flat().map(([,coordinate])=>coordinate);
    let previous;
    for (const {value} of corpulenceStops) {
      const shape = adultBodyGeometry(body,chin,structure,value);
      assert.deepEqual(vertical(shape),vertical(reference));
      const [[top],...curves] = pathPoints(shape.path);
      assert.deepEqual([top,...curves.flat()].map(([,coordinate])=>coordinate),y);
      assert.deepEqual(curves[7][2],[shape.ground.x,shape.ground.y]);
      assert.deepEqual(curves[16][2],top);
      const outline = [top,...curves.slice(0,8).flat()];
      assert(outline.slice(0,-1).every(([x])=>x>shape.ground.x && x+2.1<190));
      assert(outline.every(([,v],i)=>i===0 || v>=outline[i-1][1]));
      const mirrored = outline.slice().reverse().slice(1);
      for (const [i,[x,v]] of curves.slice(8,16).flat().entries()) {
        assert(Math.abs(x+mirrored[i][0]-2*shape.ground.x)<.0011);
        assert.equal(v,mirrored[i][1]);
      }
      if (previous) assert(outline.every(([x],i)=>x>=previous[i][0]));
      previous=outline;
      for (const [i,[,[u,v],[x,w]]] of curves.entries()) {
        const [a,b]=curves[(i+1)%curves.length][0];
        const dx=x-u, dy=w-v, nextX=a-x, nextY=b-w;
        assert(dx*nextX+dy*nextY>0);
        assert(Math.abs(dx*nextY-dy*nextX)/(Math.hypot(dx,dy)*Math.hypot(nextX,nextY))<.003);
      }
      checks++;
    }
  }
  assert.equal(checks,8640);
});

test('la courbe de corpulence conserve les écarts horizontaux entre ossatures', () => {
  const chin=chins[0];
  for (const body of profiles) for (const [a,b] of [[corners[0],corners.at(-1)],[referenceStructure,savedAxes]]) {
    const gap = value => {
      const from=right(adultBodyGeometry(body,chin,a,value).path), to=right(adultBodyGeometry(body,chin,b,value).path);
      return from.map(([x],i)=>to[i][0]-x);
    };
    const original=gap(50);
    assert(original.some(difference=>Math.abs(difference)>1));
    for (const {value} of corpulenceStops) {
      assert(gap(value).every((difference,i)=>Math.abs(difference-original[i])<.0021));
    }
  }
});

test('le visage, les calques cutanés, les cheveux et les corps historiques gardent leurs SVG', () => {
  const options = {
    naturalEyes:true, instance:'corps-03', eyes:'almond', iris:{}, details:{lashes:{count:3}}, brows:{}, nose:{}, mouth:{},
    beard:beardPresets.full.values, beardCategory:'T', marks:[{id:'m1',type:'mole'}], scars:[{id:'s1'}],
    makeup:{blush:{enabled:true},liner:{enabled:true}}
  };
  for (const style of ['p5-029','p5-061','waist_waves','shaved']) for (const scale of scales) {
    const input={...raw,...faces[style==='shaved'?1:2],style,structure:savedAxes};
    const opts={...options,...scale};
    const before=character(input,opts);
    for (const corpulence of [0,100]) {
      assert.equal(character({...input,corpulence},opts),before);
      for (const body of profiles) {
        const reference=character({...input,body},opts);
        const modified=character({...input,body,corpulence},opts);
        assert.notEqual(reference,modified);
        assert.equal(reference.replace(layer,''),modified.replace(layer,''));
      }
    }
  }
});

test('archives v11, v12 et v13 exactes, corps actif séparé et anciennes clés inertes', () => {
  const rawWithFields={...raw,corpulence:100,structure:savedAxes};
  const historic=restoreSelection(rawWithFields);
  assert.equal(historic.state.corpulence,undefined);
  assert.deepEqual(JSON.parse(exportSelection(historic)),rawWithFields);
  const options={eyes:'almond',form:'almond',colour:'chatain-clair',flat:true, makeup:{blush:{enabled:true}}};
  for (const body of profiles) for (const structure of [undefined,savedAxes]) {
    const prior = appearanceDocument(restoreSelection(rawWithFields,body,structure),options);
    assert.equal(prior.version,structure ? 12 : 11);
    const old = parseAppearance(JSON.stringify(prior));
    assert.equal(old.selection.state.corpulence,undefined);
    assert.deepEqual(appearanceDocument(old.selection,old),prior);
    for (const corpulence of [0,12.5,37.125,50,87.5,100]) {
      const chosen=restoreSelection(rawWithFields,body,structure,corpulence);
      const doc=appearanceDocument(chosen,options);
      assert.equal(doc.version,13);
      assert.equal(doc.renderer,'bio-corps-03-svg@1');
      assert.equal(doc.character.corpulence,corpulence);
      assert.deepEqual(doc.character.structure,structure);
      const replay=parseAppearance(JSON.stringify(doc));
      assert.deepEqual(appearanceDocument(replay.selection,replay),doc);
      for (const scale of scales) assert.equal(
        character(characterInput(replay.selection),scale),character(characterInput(chosen),scale));
    }
  }
  for (const invalid of [null,undefined,NaN,Infinity,-.1,100.1,'50']) {
    assert.throws(()=>validateCorpulence(invalid),/pourcentage de corpulence/);
    const doc=appearanceDocument(restoreSelection(raw,'adult-f',savedAxes,75),options);
    doc.character.corpulence=invalid;
    assert.throws(()=>parseAppearance(JSON.stringify(doc)),/pourcentage de corpulence/);
  }
});
