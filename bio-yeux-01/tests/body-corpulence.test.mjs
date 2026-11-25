import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {adultBodies, adultBodyGeometry, adultBodyMarkup} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {corpulenceStops, referenceCorpulence, validateCorpulence} from '../body-corpulence.mjs';
import {referenceStructure, structureControls} from '../body-structure.mjs';
import {beardPresets} from '../beard.mjs';
import {exportSelection, restoreSelection} from '../catalogue.mjs';
import {character} from '../render.mjs';
import {structureCombinations} from '../structure-study.mjs';
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
// The paired contours have the same vertical parameterization. Integrate the
// half-width along the cubics, including the lower cap, by quadrature.
function area(shape) {
  const [[start],...curves] = pathPoints(shape.path);
  return 2 * curves.slice(0,8).reduce((total, controls, index) => {
    const [a,b,c,d] = [index ? curves[index-1][2] : start, ...controls];
    const cubic = (p,q,r,s,t) => p*(1-t)**3+3*q*(1-t)**2*t+3*r*(1-t)*t*t+s*t**3;
    const integral = [0,(1-Math.sqrt(3/7))/2,.5,(1+Math.sqrt(3/7))/2,1].reduce((sum,t,i) => {
      const width = cubic(a[0],b[0],c[0],d[0],t)-shape.ground.x;
      const dy = 3*((b[1]-a[1])*(1-t)**2+2*(c[1]-b[1])*(1-t)*t+(d[1]-c[1])*t*t);
      return sum + [1/20,49/180,16/45,49/180,1/20][i]*width*dy;
    },0);
    return total+integral;
  },0);
}
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
  for (const body of profiles) for (const [,,structure] of structureCombinations) {
    const steps = Array.from({length:201}, (_, i) => adultBodyGeometry(body,chins[0],structure,i/2));
    assert.equal(new Set(steps.map(({path})=>path)).size,201);
    const areas = steps.map(area);
    assert(areas.every((size,index)=>index===0 || size>areas[index-1]));
    const neutral = right(steps[100].path);
    for (const amount of [49.999,50.001]) {
      const nearby = right(adultBodyGeometry(body,chins[0],structure,amount).path);
      assert(nearby.every(([x],index)=>Math.abs(x-neutral[index][0])<.003));
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
      const size=area(shape);
      if (previous!==undefined) assert(size>previous);
      previous=size;
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

test('l’enveloppe réduit les écarts locaux d’ossature en conservant ses différentes largeurs générales', () => {
  const chin=chins[0];
  for (const body of profiles) for (const [a,b] of [[corners[0],corners.at(-1)],[referenceStructure,savedAxes]]) {
    const gap = value => {
      const from=adultBodyGeometry(body,chin,a,value).levels, to=adultBodyGeometry(body,chin,b,value).levels;
      return Math.hypot(...from.slice(1).map(({width},i)=>to[i+1].width-width));
    };
    assert(gap(50)>1);
    assert(gap(75)>gap(100));
    assert(gap(100)<.6*gap(50));
    assert(gap(100)>0);
  }
});

test('du volume à la taille et à l’abdomen, sans pointe sur les hanches F aux trois repères hauts', () => {
  const chin=chins[0];
  const prominence = (levels, index) => {
    const [a,b,c] = levels.slice(index-1,index+2);
    return b.width - (a.width+(c.width-a.width)*(b.y-a.y)/(c.y-a.y));
  };
  const notch = levels => Math.max(0,-prominence(levels,3));
  for (const body of profiles) for (const [,,structure] of structureCombinations) {
    const neutral=adultBodyGeometry(body,chin,structure);
    const thin=adultBodyGeometry(body,chin,structure,0);
    assert(area(thin)<.69*area(neutral));
    assert(area(thin)<area(adultBodyGeometry(body,chin,structure,0,true)));
    assert(prominence(thin.levels,3)>-4);
    for (const value of [75,87.5,100]) {
      const before=adultBodyGeometry(body,chin,structure,value,true);
      const after=adultBodyGeometry(body,chin,structure,value);
      assert(after.levels[3].width>before.levels[3].width);
      assert(after.levels[4].width>neutral.levels[4].width);
      assert(notch(after.levels)<=notch(before.levels));
      if (body==='adult-f') assert(prominence(after.levels,5)<.40*prominence(before.levels,5));
    }
  }
  const [h,f] = profiles.map(body=>adultBodyGeometry(body,chin,referenceStructure,100));
  assert(h.levels[2].width>f.levels[2].width);
  assert(f.levels[5].width>h.levels[5].width);
});

test('les témoins avant reproduisent le moteur BIO-CORPS-03 publié', async () => {
  const source = execFileSync('git', ['show','244dc7867eadab8df7d24d0e9c64aee47a850646:bio-yeux-01/adult-body.mjs'],
    {cwd:new URL('../..',import.meta.url)}).toString();
  const originalResponse = execFileSync('git', ['show','244dc7867eadab8df7d24d0e9c64aee47a850646:bio-yeux-01/body-corpulence.mjs'],
    {cwd:new URL('../..',import.meta.url)}).toString();
  const moduleData = text=>'data:text/javascript;base64,'+Buffer.from(text).toString('base64');
  const inherited = await import(moduleData(source
    .replace("'./body-structure.mjs'", JSON.stringify(new URL('../body-structure.mjs',import.meta.url).href))
    .replace("'./body-corpulence.mjs'", JSON.stringify(moduleData(originalResponse)))));
  for (const body of profiles) for (const [,,structure] of structureCombinations) for (const {value} of corpulenceStops) {
    assert.equal(adultBodyMarkup(body,chins[0],skin,structure,value,true),
      inherited.adultBodyMarkup(body,chins[0],skin,structure,value));
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
