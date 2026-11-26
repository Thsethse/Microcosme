import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {structureControls} from '../body-structure.mjs';
import {corpulenceStops} from '../body-corpulence.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {referenceChest} from '../chest.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {referenceThoraxDetails} from '../thorax-details.mjs';
import {referenceAbdominals} from '../abdominals.mjs';
import {character} from '../render.mjs';
import {abdominalFoldGeometry, bellyDetailsMarkup, navelControls, navelGeometry, referenceNavel, validateNavel} from '../belly-details-before.mjs';

const bodies=['adult-h','adult-f'];
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const layer=/<g data-belly-details=""[^>]*>[^]*?<\/g>/;
const corners=Array.from({length:64},(_,bits)=>Object.fromEntries(
  Object.entries(structureControls).map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const navelCorners=Array.from({length:8},(_,bits)=>Object.fromEntries(
  Object.keys(navelControls).map((key,i)=>[key,bits&(1<<i) ? 100 : 0])));

test('le pli progresse continûment en largeur, courbure, position et intensité',()=>{
  for (const key of bodies) {
    let previous;
    for (let i=0;i<=1000;i++) {
      const fat=i/10;
      const body=adultBodyGeometry(key,[80,111],undefined,fat);
      const shape=abdominalFoldGeometry(body,fat);
      if (previous) {
        assert(shape.strength>previous.strength && shape.strength-previous.strength<.0022);
        assert(shape.reach>previous.reach && shape.reach-previous.reach<.2);
        assert(shape.depth>previous.depth && shape.depth-previous.depth<.02);
        assert(shape.center>previous.center && shape.center-previous.center<.02);
      } else {
        assert.equal(shape.strength,0);
        assert.equal(bellyDetailsMarkup(body,0,'#dbbf88',{fold:true}),'');
      }
      previous=shape;
    }
    assert.equal(previous.strength,1);
  }
});

test('18 432 cas gardent le nombril sur l’axe et le pli dans la silhouette, sous le nombril',()=>{
  let count=0;
  for (const key of bodies) for (const chin of [[80,103],[80,117]]) for (const structure of corners) {
    let previousY;
    for (const {value} of corpulenceStops) {
      const body=adultBodyGeometry(key,chin,structure,value);
      const fold=abdominalFoldGeometry(body,value);
      assert(fold.reach>0);
      assert(fold.reach<body.minimumWidth(fold.center-fold.depth,fold.center+fold.thickness)-2.79);
      assert(fold.center+fold.thickness<body.levels[5].y);
      for (const settings of navelCorners) {
        const navel=navelGeometry(body,settings,value);
        assert.equal(navel.cx,body.ground.x);
        assert(navel.cy>body.levels[3].y && navel.cy<body.levels[4].y);
        assert(navel.cy+navel.ry<fold.center-2);
        assert(navel.rx>0 && navel.rx<body.minimumWidth(navel.cy-navel.ry,navel.cy+navel.ry));
        if (previousY!==undefined) assert(navel.cy>previousY);
        count++;
      }
      previousY=navelGeometry(body,referenceNavel,value).cy;
    }
  }
  assert.equal(count,18432);
});

test('chaque axe change le rendu et la miniature conserve une empreinte simplifiée',()=>{
  for (const key of bodies) for (const skin of ['#dbbf88','#573222']) {
    const body=adultBodyGeometry(key,[80,111]);
    for (const smallScale of [false,true]) for (const axis of Object.keys(navelControls)) {
      const signatures=Array.from({length:21},(_,i)=>bellyDetailsMarkup(body,50,skin,{fold:true,
        navel:{...referenceNavel,[axis]:i*5},smallScale}));
      assert.equal(new Set(signatures).size,21,axis);
      assert.equal([...signatures[0].matchAll(/data-navel-part/g)].length,smallScale ? 1 : 3);
    }
    const circle=navelGeometry(body,{...referenceNavel,shape:0},50);
    const elongated=navelGeometry(body,{...referenceNavel,shape:100},50);
    assert.equal(circle.rx,circle.ry);
    assert(elongated.ry>circle.ry && elongated.rx<circle.rx);
  }
});

test('le SVG reste identique après retrait du nouveau calque, à toutes les échelles',()=>{
  for (const body of [...bodies,'standard','bust']) for (const corpulence of [0,50,100]) for (const scale of [
    {},{headOnly:true},{headOnly:true,smallScale:true}
  ]) {
    const input={...raw,body,structure:corners[11],corpulence,
      chest:{...referenceChest,volume:93},pectorals:{...referencePectorals,volume:85},
      thoraxDetails:referenceThoraxDetails[body],abdominals:{...referenceAbdominals,volume:86}};
    const opts={...scale,instance:'belly-test',boneReliefs:true,naturalEyes:true,makeup:{blush:{enabled:true}}};
    const base=character(input,opts);
    const result=character(input,{...opts,bellyFinish:'before'});
    assert.equal(result.replace(layer,''),base);
    if (bodies.includes(body)) {
      assert(result.includes('data-navel-part'));
      assert.equal(result.includes('data-abdominal-fold'),corpulence>0);
      assert(result.indexOf('data-abdominals')<result.indexOf('data-belly-details'));
    } else assert.equal(result,base);
  }
});

test('les documents 05-C restent lisibles, avec les contrôles pris en charge dans l’atelier actuel',()=>{
  const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
  const archive=selection=>appearanceDocument(selection,settings);
  const read=doc=>parseAppearance(JSON.stringify(doc));
  const requested={size:41.625,shape:64.125,relief:86};
  for (const key of bodies) for (const full of [false,true]) {
    const context=full ? [raw,key,corners[17],87.125,{...referenceChest,volume:70},undefined,
      {...referencePectorals,volume:57},referenceThoraxDetails[key],{...referenceAbdominals,volume:61.5}] :
      [raw,key,...Array(7).fill(undefined)];
    const previous=archive(restoreSelection(...context));
    assert.equal(previous.version,full ? 21 : 11);
    assert.deepEqual(appearanceDocument(read(previous).selection,read(previous)),previous);
    const doc={...previous,version:20,renderer:'bio-corps-05-c-svg@1',character:{...previous.character,navel:requested}};
    if (full) doc.character.thoraxDetails={...previous.character.thoraxDetails,nippleSize:54,relief:60};
    const restored=read(doc);
    assert(restored.importedNavel);
    assert(!Object.hasOwn(restored.selection.state,'navel'));
    assert.deepEqual(appearanceDocument(restored.selection,restored),previous);
    const withOldSettings=character({...characterInput(restored.selection),navel:requested},{bellyFinish:true});
    assert.equal(withOldSettings,character(characterInput(restored.selection),{bellyFinish:true}));
  }
  for (const value of [null,{...requested,size:101},{...requested,shape:'64'},{...requested,position:40}]) {
    assert.throws(()=>validateNavel(value),/trois réglages/);
  }
});
