import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {abdominalFoldGeometry, groinGeometry, pelvicLandmarks} from '../belly-details.mjs';
import {appearanceDocument, characterInput, parseAppearance, pelvicAppearanceVersion} from '../appearance.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {referenceAbdominals} from '../abdominals.mjs';
import {referenceChest} from '../chest.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {referenceThoraxDetails} from '../thorax-details.mjs';
import {pelvicDetailFrame, pubicHairGeometry, pubicHairStops, validatePubicHairLength} from '../pelvic-details.mjs';
import {character} from '../render.mjs';
import {structureCombinations} from '../structure-study.mjs';

const bases = ['adult-h','adult-f'];
const raw = {style:'p5-061',arrangement:'G',body:'standard'};
const settings = {eyes:null,form:'historical',colour:'chatain-clair',flat:true};
const layer = svg => svg.match(/<g data-pelvic-details="[^"]+"[^>]*>.*?<\/g>(?:<\/g>)?/)?.[0];
const hair = svg => svg.match(/<g data-pubic-hair="">.*?<\/g>/)?.[0];

test('24 racines et trois tons immuables, avec une croissance continue des embouts et des courbes',()=>{
  const frame = {axis:80,top:185,end:201,reach:12};
  const roots = pubicHairGeometry(frame,0);
  assert.equal(roots.length,24);
  assert.equal(new Set(roots.map(({root})=>root.join(','))).size,24);
  assert.equal(new Set(roots.map(({tone})=>tone)).size,3);
  assert(roots.every(({root,curves})=>curves.flat().every(point=>point.every((v,i)=>v===root[i]))));
  for (let step=1; step<=1000; step++) {
    const length=step/10;
    const before=pubicHairGeometry(frame,length-.1);
    const after=pubicHairGeometry(frame,length);
    assert.deepEqual(after.map(({root,tone})=>({root,tone})),roots.map(({root,tone})=>({root,tone})));
    for (const [index,{tip,curves}] of after.entries()) {
      const previous=before[index];
      assert(tip[1]>previous.tip[1] && tip[1]-previous.tip[1]<.01);
      assert(curves.flat().every((point,j)=>point.every((value,i)=>Math.abs(value-previous.curves.flat()[j][i])<.02)));
      assert.equal(curves[1].at(-1),after[index].root);
    }
  }
});

test('le calque et les points de contrôle restent entre ventre, plis de l’aine et base du pion',()=>{
  for (const key of bases) for (const [, , structure] of structureCombinations) {
    for (const chinY of [98,109,117]) for (let fat=0; fat<=100; fat+=.5) {
      const body=adultBodyGeometry(key,[80,chinY],structure,fat);
      const frame=pelvicDetailFrame(body,fat);
      const fold=abdominalFoldGeometry(body,fat);
      const crease=groinGeometry(body,fat)[1];
      assert.equal(frame.axis,body.ground.x);
      assert(frame.top>fold.bottom);
      assert(frame.end<pelvicLandmarks(body).pelvicBase);
      assert(frame.end-frame.top>3);
      assert(frame.reach<Math.min(...[crease[0],...crease[1],...crease[2]].map(([x])=>x-frame.axis)));
      for (const {root,curves} of pubicHairGeometry(frame,100)) {
        for (const [x,y] of [root,...curves.flat()]) {
          assert(y>=frame.top && y<=frame.end);
          assert(Math.abs(x-frame.axis)<=frame.reach);
        }
      }
    }
  }
});

test('anatomie standardisée H/F, neutralité des mineurs et des bases historiques, couleur issue des cheveux',()=>{
  for (const body of bases) for (const smallScale of [false,true]) {
    const input={...raw,body,chest:{...referenceChest,volume:93},pectorals:{...referencePectorals,volume:90},
      abdominals:{...referenceAbdominals,volume:80},thoraxDetails:referenceThoraxDetails[body]};
    const options={pelvicDetails:true,bellyFinish:true,boneReliefs:true,hairColor:'blond-pale',smallScale};
    const legacy=character(input,{...options,pelvicDetails:false});
    const shaved=character(input,options);
    assert(!hair(shaved));
    assert(layer(shaved));
    assert.deepEqual([...layer(shaved).matchAll(/data-pelvic-part="([^"]+)"/g)].map(match=>match[1]),
      body==='adult-h' ? ['rounded','rounded','u',...(smallScale ? [] : ['light'])] : ['triangle','median']);
    assert.equal(shaved.replace(layer(shaved),''),legacy);
    const adult={...input,pubicHairLength:68};
    const current=character(adult,options);
    assert.equal(current,character(adult,options));
    assert.equal(current.replace(layer(current),''),legacy);
    assert.equal([...hair(current).matchAll(/M/g)].length,24);
    const dark=character(adult,{...options,hairColor:'noir-profond'});
    assert.notEqual(hair(current),hair(dark));
    assert.equal(hair(current).replace(/fill="#[a-f0-9]+"/g,''),hair(dark).replace(/fill="#[a-f0-9]+"/g,''));
    for (const age of ['adult','mature','elder']) assert.equal(layer(character({...adult,age},options)),layer(current));
    for (const age of ['child','adolescent','unknown',null]) {
      assert.equal(character({...adult,age},options),legacy);
      assert.equal(characterInput(restoreSelection({...raw,age},body)).age,undefined);
    }
    for (const old of ['standard','slim','broad','narrow','shoulders','bust','T']) {
      assert(!layer(character({...adult,body:old},options)));
    }
  }
});

test('v22 restaure les valeurs exactes, y compris zéro, avec les autres réglages et les archives R02',()=>{
  for (const body of bases) for (const length of [...pubicHairStops.map(([value])=>value),36.125]) {
    const args=[raw,body,structureCombinations[2][2],86.375,{...referenceChest,volume:60},undefined,
      {...referencePectorals,volume:44},referenceThoraxDetails[body],{...referenceAbdominals,volume:70}];
    const old=appearanceDocument(restoreSelection(...args),settings);
    const current=appearanceDocument(restoreSelection(...args,length),settings);
    assert.equal(old.version,21);
    assert.equal(current.version,pelvicAppearanceVersion);
    assert.deepEqual(current.character,{...old.character,pubicHairLength:length});
    const restored=parseAppearance(JSON.stringify(current));
    assert.equal(characterInput(restored.selection).pubicHairLength,length);
    assert.deepEqual(appearanceDocument(restored.selection,restored),current);
    const previous=parseAppearance(JSON.stringify(old));
    assert.equal(characterInput(previous.selection).pubicHairLength,undefined);
    assert.deepEqual(appearanceDocument(previous.selection,previous),old);
    for (const invalid of [null,-1,101,'25',undefined]) {
      assert.throws(()=>parseAppearance(JSON.stringify({...current,character:{...current.character,pubicHairLength:invalid}})),/longueur/);
    }
    assert.throws(()=>parseAppearance(JSON.stringify({...current,character:{...current.character,body:'standard'}})),/Base adulte/);
    assert.throws(()=>parseAppearance(JSON.stringify({...old,character:{...old.character,pubicHairLength:length}})),/incompatibles/);
  }
  assert.throws(()=>validatePubicHairLength(NaN),/longueur/);
  assert.throws(()=>validatePubicHairLength(Infinity),/longueur/);
  assert.equal(restoreSelection({...raw,pubicHairLength:75}).state.pubicHairLength,undefined);
});
