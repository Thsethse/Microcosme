import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {corpulenceStops} from '../body-corpulence.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {referenceChest} from '../chest.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {referenceThoraxDetails} from '../thorax-details.mjs';
import {character} from '../render.mjs';
import {boneReliefGeometry, boneReliefMarkup} from '../body-bone-reliefs.mjs';

const bodies=['adult-h','adult-f'];
const profile={style:'p5-061',arrangement:'G',body:'standard'};
const chin=[80,111];
const palette='#dbbf88';
const boneLayer=/<g data-bone-reliefs=""[^>]*>(?:<g data-bone-family="[^"]+">[^]*?<\/g>)+<\/g>/;
const corners=Array.from({length:64},(_,bits)=>Object.fromEntries(
  Object.entries(structureControls).map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const volumes={chest:{...referenceChest,volume:100},pectorals:{...referencePectorals,volume:100}};

test('les quatre visibilités baissent continûment de très maigre à très obèse',()=>{
  const body=adultBodyGeometry('adult-h',chin);
  const samples=Array.from({length:1001},(_,i)=>boneReliefGeometry(body,i/10));
  for(let family=0;family<4;family++){
    const values=samples.map(sample=>sample[family].visibility);
    assert.equal(values[0],1);
    assert.equal(values.at(-1),0);
    assert(values[500]>.08 && values[500]<.12);
    assert(values[750]<.015);
    assert(values.slice(1).every((value,i)=>value<values[i] && values[i]-value<.004));
  }
  for (const {value} of corpulenceStops) {
    const markup=boneReliefMarkup(body,value,palette);
    assert.equal(markup.includes('data-bone-reliefs'),value!==100);
  }
});

test('2 304 géométries restent à l’intérieur du corps et au-dessus de la base pelvienne',()=>{
  let count=0;
  for (const key of bodies) for (const skeleton of corners) for (const head of [[80,103],[80,117]]) {
    for (const {value} of corpulenceStops) {
      const shape=adultBodyGeometry(key,head,skeleton,value);
      const regions=boneReliefGeometry(shape,value);
      assert.equal(new Set(regions.map(({id})=>id)).size,4);
      assert(regions[0].top>shape.levels[0].y);
      assert(regions.at(-1).bottom<shape.levels[6].y);
      for (const {top,bottom,reach,shadow,light} of regions) {
        assert(top<bottom && reach>0);
        for (const [start,...curves] of [shadow,light]) {
          assert.deepEqual(curves.at(-1).at(-1),start);
          for (const [x,y] of [start,...curves.flat()]) {
            const projectedY=top+y*(bottom-top);
            assert(projectedY>=top && projectedY<=bottom);
            assert(x>0 && x*reach<=shape.minimumWidth(projectedY,projectedY)-2.39);
          }
        }
      }
      count++;
    }
  }
  assert.equal(count,2304);
});

test('le calque est indépendant de la silhouette et passe derrière les volumes',()=>{
  for (const body of [...bodies,'standard','bust']) for(const corpulence of [0,25,50,75,100]) for(const size of [
    {},{headOnly:true},{headOnly:true,smallScale:true}
  ]) {
    const input={...profile,...volumes,body,corpulence,structure:corners[11],thoraxDetails:referenceThoraxDetails[body]};
    const options={...size,instance:'bone-test',naturalEyes:true,makeup:{blush:{enabled:true}}};
    const baseline=character(input,options);
    const overlay=character(input,{...options,boneReliefs:true});
    assert.equal(overlay.replace(boneLayer,''),baseline);
    if (!bodies.includes(body) || corpulence===100) assert.equal(overlay,baseline);
    else {
      const bodyIndex=overlay.indexOf('data-adult-body');
      const bones=overlay.indexOf('data-bone-reliefs');
      const carrier=overlay.indexOf(body==='adult-f' ? 'data-chest="adult-f"' : 'data-pectorals');
      const skinDetails=overlay.indexOf('data-thorax-details');
      assert(bodyIndex>=0 && bodyIndex<bones && bones<carrier && carrier<skinDetails);
      const patches=overlay.match(boneLayer)[0];
      assert.equal([...patches.matchAll(/<path /g)].length,size.smallScale ? 8 : 16);
    }
    assert(!boneLayer.test(character(input,{...options,boneReliefs:true,beforeCorpulenceCorrection:true})));
  }
});

test('les archives v13 et v18 se réexportent à l’identique et recalculent le calque',()=>{
  const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
  for (const key of bodies) for (const corpulence of [0,37.125,100]) for (const detailed of [false,true]) {
    const chosen=restoreSelection(profile,key,corners[55],corpulence,
      detailed ? volumes.chest : undefined,undefined,detailed ? volumes.pectorals : undefined,
      detailed ? referenceThoraxDetails[key] : undefined);
    const archived=appearanceDocument(chosen,settings);
    const restored=parseAppearance(JSON.stringify(archived));
    assert.equal(archived.version,detailed ? 18 : 13);
    assert(!Object.hasOwn(archived.character,'boneReliefs'));
    assert.deepEqual(appearanceDocument(restored.selection,restored),archived);
    const options={boneReliefs:true,instance:'archive-bones'};
    const before=character(characterInput(chosen),options);
    assert.equal(character(characterInput(restored.selection),options),before);
    assert.equal(boneLayer.test(before),corpulence!==100);
  }
});
