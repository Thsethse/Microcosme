import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {referenceChest} from '../chest.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {referenceThoraxDetails} from '../thorax-details.mjs';
import {character} from '../render.mjs';
import {abdominalControls, abdominalGeometry, abdominalMarkup, referenceAbdominals, validateAbdominals} from '../abdominals.mjs';

const bodies=['adult-h','adult-f'];
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const layer=/<g data-abdominals=""[^>]*>[^]*?<\/g>/;
const corners=Array.from({length:64},(_,bits)=>Object.fromEntries(
  Object.entries(structureControls).map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const shapeFields=['definition','width','obliques'];
const values={...referenceAbdominals,volume:80};

test('les quatre curseurs ont chacun un effet distinct pour H et F, même à forte corpulence',()=>{
  for (const key of bodies) for (const corpulence of [0,50,100]) {
    const body=adultBodyGeometry(key,[80,111],undefined,corpulence);
    const signatures=new Set();
    for (const axis of Object.keys(abdominalControls)) {
      const steps=Array.from({length:21},(_,i)=>abdominalMarkup(body,{...values,[axis]:i*5},corpulence,'#dbbf88',false));
      assert.equal(new Set(steps).size,steps.length,axis);
      signatures.add(steps.at(-1));
    }
    assert.equal(signatures.size,4);
    assert.equal(abdominalGeometry(body,{...values,volume:0},corpulence),null);
    const plain=abdominalMarkup(body,{...values,definition:0,obliques:0},corpulence,'#dbbf88',false);
    assert(plain.includes('data-abdominal-part="rectus"'));
    assert(!/data-abdominal-part="(?:upper|lower|oblique)"/.test(plain));
  }
});

test('l’atténuation par la corpulence est continue et ne change pas la masse enregistrée',()=>{
  const saved=Object.freeze({...values,definition:90});
  let previous;
  for (let i=0;i<=1000;i++) {
    const corpulence=i/10;
    const body=adultBodyGeometry('adult-h',[80,111],undefined,corpulence);
    const geo=abdominalGeometry(body,saved,corpulence);
    assert.equal(geo.mass,(.8)**.78);
    if (previous) {
      assert(geo.visibility<previous.visibility && previous.visibility-geo.visibility<.002);
      assert(geo.definitionVisible<previous.definitionVisible);
      assert.equal(geo.top,previous.top);
      assert.equal(geo.bottom,previous.bottom);
      assert(Math.abs(geo.reach-previous.reach)<.3);
    }
    previous=geo;
  }
  assert.equal(previous.visibility,.07);
  assert.deepEqual(saved,{...values,definition:90});
});

test('30 720 configurations restent dans le corps et entre le thorax et les hanches',()=>{
  const restrictions=Array.from({length:8},(_,bits)=>Object.fromEntries(shapeFields.map((key,i)=>[key,bits&(1<<i) ? 100 : 0])));
  let count=0;
  for (const key of bodies) for (const chin of [[80,103],[80,117]]) for (const structure of corners) {
    for (const corpulence of [0,25,50,75,100]) {
      const body=adultBodyGeometry(key,chin,structure,corpulence);
      for (const volume of [1,50,100]) for (const requested of restrictions) {
        const {sides,top,bottom,reach}=abdominalGeometry(body,{...requested,volume},corpulence);
        assert(top>body.levels[2].y && bottom<body.levels[5].y && reach>0);
        const points=([start,...segments])=>[start,...segments.flat()];
        for (const [name,right] of Object.entries(sides[1])) {
          const left=points(sides[0][name]);
          points(right).forEach(([x,y],index)=>{
            assert(x>body.ground.x && x-body.ground.x<=reach);
            assert(y>=top && y<=bottom);
            assert.equal(y,left[index][1]);
            assert(Math.abs(x+left[index][0]-2*body.ground.x)<1e-9);
          });
        }
        count++;
      }
    }
  }
  assert.equal(count,30720);
});

test('retirer le calque redonne le SVG précédent à l’identique, y compris les acquis thoraciques',()=>{
  for (const body of [...bodies,'standard','bust']) for (const corpulence of [0,50,100]) for (const scale of [
    {},{headOnly:true},{headOnly:true,smallScale:true}
  ]) {
    const input={...raw,body,structure:corners[11],corpulence,
      chest:{...referenceChest,volume:80},pectorals:{...referencePectorals,volume:70},thoraxDetails:referenceThoraxDetails[body]};
    const opts={...scale,instance:'abdomen-test',boneReliefs:true,naturalEyes:true,makeup:{blush:{enabled:true}}};
    const original=character(input,opts);
    assert.equal(character({...input,abdominals:referenceAbdominals},opts),original);
    const rendered=character({...input,abdominals:values},opts);
    assert.equal(rendered.replace(layer,''),original);
    if (!bodies.includes(body)) assert.equal(rendered,original);
    else {
      const bones=rendered.indexOf('data-bone-reliefs');
      const muscles=rendered.indexOf('data-abdominals');
      const carrier=rendered.indexOf(body==='adult-h' ? 'data-pectorals' : 'data-chest="adult-f"');
      assert(rendered.indexOf('data-adult-body')<muscles && muscles<carrier);
      if (corpulence<100) assert(muscles<bones && bones<carrier);
      assert.equal(rendered.includes('data-abdominal-part="surface"'),!scale.smallScale);
    }
  }
});

test('les quatre valeurs abdominales se restaurent en volume et à plat et les anciennes archives gardent leur version',()=>{
  const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
  const archive=selection=>appearanceDocument(selection,settings);
  const read=document=>parseAppearance(JSON.stringify(document));
  for (const key of bodies) for (const volume of [0,73.125]) for (const full of [false,true]) {
    const context=full ? [raw,key,corners[6],88.125,{...referenceChest,volume:80},undefined,{...referencePectorals,volume:70},referenceThoraxDetails[key]] : [raw,key];
    const old=archive(restoreSelection(...context));
    assert.equal(old.version,full ? 21 : 11);
    assert.deepEqual(appearanceDocument(read(old).selection,read(old)),old);
    const requested={...values,volume,width:42.875};
    const selected=restoreSelection(...(full ? context : [...context,...Array(6).fill(undefined)]),requested);
    const doc=archive(selected), restored=read(doc);
    assert.equal(doc.version,full ? 21 : 19);
    assert.deepEqual(restored.selection.state.abdominals,requested);
    assert.deepEqual(appearanceDocument(restored.selection,restored),doc);
    assert.equal(character(characterInput(restored.selection)),character(characterInput(selected)));
  }
  for (const invalid of [null,{...values,width:101},{...values,definition:'50'},{...values,extra:0}]) {
    assert.throws(()=>validateAbdominals(invalid),/quatre réglages/);
  }
});
